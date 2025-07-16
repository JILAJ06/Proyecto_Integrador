document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario según tu HTML actualizado
            const formData = {
                nombreUsuario: document.getElementById('username').value.trim(),
                nombreNegocio: document.getElementById('negocio').value.trim(),
                calle: document.getElementById('calle').value.trim(),
                colonia: document.getElementById('colonia').value.trim(),
                codigoPostal: document.getElementById('codigoPostal').value.trim(),
                correo: document.getElementById('email').value.trim(),
                contrasena: document.getElementById('password').value.trim(),
                rol: 'empleado' // Por defecto empleado
            };
            
            // Validar campos
            if (!validarFormulario(formData)) {
                return;
            }
            
            try {
                mostrarCargando(true);
                await registrarEmpleado(formData);
            } catch (error) {
                console.error('Error en registro:', error);
                mostrarError('Error en registro: ' + error.message);
            } finally {
                mostrarCargando(false);
            }
        });
    }
});

// Función para validar el formulario
function validarFormulario(data) {
    // Verificar campos requeridos
    const camposRequeridos = [
        { campo: 'nombreUsuario', nombre: 'nombre de usuario' },
        { campo: 'nombreNegocio', nombre: 'nombre del negocio' },
        { campo: 'calle', nombre: 'calle' },
        { campo: 'colonia', nombre: 'colonia' },
        { campo: 'codigoPostal', nombre: 'código postal' },
        { campo: 'correo', nombre: 'correo electrónico' },
        { campo: 'contrasena', nombre: 'contraseña' }
    ];
    
    for (let item of camposRequeridos) {
        if (!data[item.campo]) {
            mostrarError(`El ${item.nombre} es requerido`);
            return false;
        }
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.correo)) {
        mostrarError('Por favor ingresa un correo válido');
        return false;
    }
    
    // Validar contraseña
    if (data.contrasena.length < 6) {
        mostrarError('La contraseña debe tener al menos 6 caracteres');
        return false;
    }
    
    // Validar código postal (solo números y 5 dígitos)
    if (!/^\d{5}$/.test(data.codigoPostal)) {
        mostrarError('El código postal debe tener exactamente 5 números');
        return false;
    }
    
    return true;
}

// Función principal de registro
async function registrarEmpleado(formData) {
    try {
        // Crear la dirección completa para el negocio
        const direccionCompleta = `${formData.calle}, ${formData.colonia}, CP: ${formData.codigoPostal}`;
        
        // Primero vamos a crear/buscar el negocio
        let idNegocio = await buscarOCrearNegocio(formData.nombreNegocio, direccionCompleta);
        
        // Crear objeto empleado para enviar
        const nuevoEmpleado = {
            nombreUsuario: formData.nombreUsuario,
            correo: formData.correo,
            contrasena: formData.contrasena,
            calle: formData.calle,
            colonia: formData.colonia,
            codigoPostal: formData.codigoPostal,
            rol: formData.rol
        };
        
        console.log('Intentando registrar empleado:', nuevoEmpleado);
        console.log('En negocio ID:', idNegocio);
        
        // Usar el endpoint correcto: /negocio/{id}/empleado (singular)
        const endpointRegistro = `http://localhost:8080/negocio/${idNegocio}/empleado`;
        
        const responseRegistro = await fetch(endpointRegistro, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoEmpleado)
        });
        
        if (!responseRegistro.ok) {
            const errorText = await responseRegistro.text();
            throw new Error(`Error al registrar empleado: ${errorText}`);
        }
        
        const resultado = await responseRegistro.json();
        console.log('Registro exitoso:', resultado);
        
        mostrarExito('¡Registro exitoso! Redirigiendo al login...');
        
        // Limpiar formulario
        document.getElementById('registerForm').reset();
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
            window.location.href = '/Login.html';
        }, 2000);
        
    } catch (error) {
        throw error;
    }
}

// Función para buscar o crear un negocio
async function buscarOCrearNegocio(nombreNegocio, direccion) {
    try {
        console.log('Buscando negocio:', nombreNegocio);
        
        // Primero intentar obtener todos los negocios para buscar por nombre
        const responseNegocios = await fetch('http://localhost:8080/negocio');
        
        if (responseNegocios.ok) {
            const negocios = await responseNegocios.json();
            console.log('Negocios encontrados:', negocios);
            
            // Buscar si ya existe un negocio con ese nombre
            const negocioExistente = negocios.find(neg => 
                neg.nombre && neg.nombre.toLowerCase() === nombreNegocio.toLowerCase()
            );
            
            if (negocioExistente) {
                console.log('Negocio encontrado:', negocioExistente);
                return negocioExistente.id;
            }
        }
        
        // Si no existe, crear nuevo negocio
        const nuevoNegocio = {
            nombre: nombreNegocio,
            direccion: direccion,
            telefono: '', // Campo vacío por ahora
            correo: '' // Campo vacío por ahora
        };
        
        console.log('Creando nuevo negocio:', nuevoNegocio);
        
        const responseCrear = await fetch('http://localhost:8080/negocio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoNegocio)
        });
        
        if (!responseCrear.ok) {
            throw new Error('Error al crear el negocio');
        }
        
        const negocioCreado = await responseCrear.json();
        console.log('Nuevo negocio creado:', negocioCreado);
        return negocioCreado.id;
        
    } catch (error) {
        // Si falla todo, usar ID por defecto
        console.warn('Error al buscar/crear negocio, usando ID por defecto:', error);
        return 1; // ID por defecto
    }
}

// Funciones de UI
function mostrarCargando(mostrar) {
    const btn = document.querySelector('.register-btn');
    if (btn) {
        if (mostrar) {
            btn.disabled = true;
            btn.textContent = 'Registrando...';
        } else {
            btn.disabled = false;
            btn.textContent = 'Registrar';
        }
    }
}

function mostrarError(mensaje) {
    mostrarMensaje(mensaje, 'error');
}

function mostrarExito(mensaje) {
    mostrarMensaje(mensaje, 'success');
}

function mostrarMensaje(mensaje, tipo) {
    // Remover mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-registro');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }
    
    // Crear nuevo mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje-registro mensaje-${tipo}`;
    mensajeDiv.textContent = mensaje;
    
    // Estilos básicos
    mensajeDiv.style.cssText = `
        padding: 12px;
        margin: 15px 0;
        border-radius: 8px;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        ${tipo === 'error' ? 
            'background-color: #ffebee; color: #c62828; border: 1px solid #e57373;' : 
            'background-color: #e8f5e8; color: #2e7d32; border: 1px solid #81c784;'}
    `;
    
    // Insertar antes del formulario
    const registerForm = document.getElementById('registerForm');
    const registerBox = registerForm.closest('.register-box');
    registerBox.insertBefore(mensajeDiv, registerForm);
    
    // Auto-remover después de 5 segundos para mensajes de error
    if (tipo === 'error') {
        setTimeout(() => {
            if (mensajeDiv && mensajeDiv.parentNode) {
                mensajeDiv.remove();
            }
        }, 5000);
    }
}