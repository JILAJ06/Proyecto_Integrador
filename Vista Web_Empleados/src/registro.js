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

// ✅ FUNCIÓN SIMPLIFICADA: Usar el endpoint único que crea negocio y usuario
async function registrarEmpleado(formData) {
    try {
        console.log('=== INICIANDO PROCESO DE REGISTRO ===');
        console.log('Datos del formulario:', formData);
        
        // ✅ CREAR NEGOCIO Y USUARIO EN UNA SOLA LLAMADA
        const resultado = await crearNegocioYUsuario(formData);
        console.log('✅ Registro completado exitosamente');
        
        // ✅ OBTENER EL ID DEL NEGOCIO DEL RESULTADO
        const idNegocio = extraerIdNegocio(resultado);
        
        // ✅ MOSTRAR MENSAJE DE ÉXITO CON EL ID DEL NEGOCIO
        mostrarExitoConId(idNegocio);
        
        // Limpiar formulario
        document.getElementById('registerForm').reset();
        
    } catch (error) {
        console.error('=== ERROR EN EL PROCESO DE REGISTRO ===');
        console.error('Error completo:', error);
        throw error;
    }
}

// ✅ FUNCIÓN NUEVA: Crear negocio y usuario con el endpoint correcto
async function crearNegocioYUsuario(formData) {
    try {
        // ✅ ESTRUCTURAR DATOS SEGÚN EL JSON QUE ESPERA TU BACKEND
        const datosRegistro = {
            nombreUsuario: formData.nombreUsuario,
            correo: formData.correo,
            rol: "Admin", // Rol de administrador para el primer usuario
            contrasena: formData.contrasena,
            calle: formData.calle,
            colonia: formData.colonia,
            codigoPostal: formData.codigoPostal,
            negocio: {
                nombreNegocio: formData.nombreNegocio
            },
            creador: {
                nombreUsuario: null // Para el primer usuario (creador del negocio)
            }
        };
        
        console.log('=== CREANDO NEGOCIO Y USUARIO ===');
        console.log('Datos enviados:', JSON.stringify(datosRegistro, null, 2));
        
        const response = await fetch('http://localhost:8080/negocio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosRegistro)
        });
        
        console.log('Response status:', response.status);
        console.log('Response Content-Type:', response.headers.get('content-type'));
        
        // ✅ VERIFICAR SI LA RESPUESTA TIENE CONTENIDO JSON
        const contentType = response.headers.get('content-type');
        let resultado = null;
        
        try {
            // Obtener el texto de la respuesta primero
            const responseText = await response.text();
            console.log('Texto de respuesta completo:', responseText);
            
            // ✅ VERIFICAR SI EL RESPONSE STATUS ES EXITOSO PRIMERO
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${responseText}`);
            }
            
            // ✅ MANEJAR RESPUESTA SEGÚN EL CONTENT-TYPE
            if (contentType && contentType.includes('application/json')) {
                // Es JSON, intentar parsear
                if (responseText.trim()) {
                    resultado = JSON.parse(responseText);
                    console.log('✅ JSON parseado exitosamente:', resultado);
                } else {
                    console.warn('⚠️ Respuesta JSON vacía');
                    // Si es exitoso pero vacío, buscar el negocio recién creado
                    resultado = await buscarNegocioRecienCreado(formData.nombreNegocio);
                }
            } else {
                // No es JSON, pero si es exitoso, buscar el negocio
                console.warn('⚠️ Respuesta no es JSON. Content-Type:', contentType);
                console.warn('⚠️ Contenido de respuesta:', responseText);
                
                if (response.status >= 200 && response.status < 300) {
                    console.log('✅ Registro exitoso (respuesta no-JSON), buscando ID real...');
                    // Buscar el negocio recién creado por nombre
                    resultado = await buscarNegocioRecienCreado(formData.nombreNegocio);
                } else {
                    throw new Error(`Error ${response.status}: ${responseText}`);
                }
            }
        } catch (parseError) {
            console.error('❌ Error parseando respuesta:', parseError);
            
            // ✅ SI EL REGISTRO FUE EXITOSO PERO NO PODEMOS PARSEAR
            if (response.status >= 200 && response.status < 300) {
                console.log('✅ Registro probablemente exitoso, buscando ID real...');
                // Buscar el negocio recién creado
                resultado = await buscarNegocioRecienCreado(formData.nombreNegocio);
            } else {
                throw new Error(`Error ${response.status}: No se pudo procesar la respuesta del servidor`);
            }
        }
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Error al crear negocio y usuario:', error);
        throw error;
    }
}

// ✅ FUNCIÓN NUEVA: Buscar el negocio recién creado por nombre
async function buscarNegocioRecienCreado(nombreNegocio) {
    try {
        console.log('🔍 Buscando negocio recién creado:', nombreNegocio);
        
        // Esperar un poco para que la base de datos se actualice
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Obtener todos los negocios
        const response = await fetch('http://localhost:8080/negocio', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            console.warn('⚠️ No se pudo obtener la lista de negocios');
            return {
                mensaje: 'Registro exitoso',
                status: 'success',
                nombreNegocio: nombreNegocio,
                id: null // Sin ID por ahora
            };
        }
        
        const responseText = await response.text();
        console.log('📋 Respuesta de GET negocios:', responseText);
        
        // Intentar parsear la respuesta
        let negocios = null;
        try {
            negocios = JSON.parse(responseText);
        } catch (e) {
            console.warn('⚠️ No se pudo parsear la lista de negocios');
            return {
                mensaje: 'Registro exitoso',
                status: 'success',
                nombreNegocio: nombreNegocio,
                id: null
            };
        }
        
        console.log('📋 Negocios obtenidos:', negocios);
        
        // Buscar el negocio por nombre
        let negocioEncontrado = null;
        
        if (Array.isArray(negocios)) {
            // Si es un array, buscar por nombre
            negocioEncontrado = negocios.find(negocio => 
                negocio.nombre === nombreNegocio || 
                negocio.nombreNegocio === nombreNegocio ||
                (negocio.negocio && negocio.negocio.nombre === nombreNegocio) ||
                (negocio.negocio && negocio.negocio.nombreNegocio === nombreNegocio)
            );
            
            // Si no se encuentra por nombre exacto, buscar el más reciente
            if (!negocioEncontrado && negocios.length > 0) {
                // Ordenar por ID descendente (asumiendo que IDs más altos = más recientes)
                negocios.sort((a, b) => (b.id || 0) - (a.id || 0));
                negocioEncontrado = negocios[0];
                console.log('⚠️ No se encontró por nombre, usando el más reciente:', negocioEncontrado);
            }
        } else if (negocios && typeof negocios === 'object') {
            // Si es un objeto único, podría ser el negocio recién creado
            negocioEncontrado = negocios;
        }
        
        if (negocioEncontrado) {
            console.log('✅ Negocio encontrado:', negocioEncontrado);
            return {
                mensaje: 'Registro exitoso',
                status: 'success',
                nombreNegocio: nombreNegocio,
                id: negocioEncontrado.id || negocioEncontrado.idNegocio,
                negocio: negocioEncontrado
            };
        } else {
            console.warn('⚠️ No se encontró el negocio recién creado');
            return {
                mensaje: 'Registro exitoso',
                status: 'success',
                nombreNegocio: nombreNegocio,
                id: null
            };
        }
        
    } catch (error) {
        console.error('❌ Error buscando negocio recién creado:', error);
        return {
            mensaje: 'Registro exitoso',
            status: 'success',
            nombreNegocio: nombreNegocio,
            id: null
        };
    }
}

// ✅ FUNCIÓN MEJORADA: Extraer ID del negocio con mejor debugging
function extraerIdNegocio(resultado) {
    try {
        console.log('🔍 ===== EXTRAYENDO ID DEL NEGOCIO =====');
        console.log('📊 Estructura completa del resultado:', JSON.stringify(resultado, null, 2));
        
        // ✅ INTENTAR DIFERENTES ESTRUCTURAS POSIBLES DE LA RESPUESTA
        let idNegocio = null;
        
        // Caso 1: ID directo en la respuesta
        if (resultado.id) {
            idNegocio = resultado.id;
            console.log('✅ ID encontrado en resultado.id:', idNegocio);
        }
        // Caso 2: ID en el objeto negocio
        else if (resultado.negocio && resultado.negocio.id) {
            idNegocio = resultado.negocio.id;
            console.log('✅ ID encontrado en resultado.negocio.id:', idNegocio);
        }
        // Caso 3: ID como idNegocio
        else if (resultado.idNegocio) {
            idNegocio = resultado.idNegocio;
            console.log('✅ ID encontrado en resultado.idNegocio:', idNegocio);
        }
        // Caso 4: ID en usuario.negocio
        else if (resultado.usuario && resultado.usuario.negocio && resultado.usuario.negocio.id) {
            idNegocio = resultado.usuario.negocio.id;
            console.log('✅ ID encontrado en resultado.usuario.negocio.id:', idNegocio);
        }
        // Caso 5: Si la respuesta es un array, tomar el primer elemento
        else if (Array.isArray(resultado) && resultado.length > 0) {
            const primerElemento = resultado[0];
            idNegocio = primerElemento.id || primerElemento.idNegocio;
            console.log('✅ ID encontrado en array[0]:', idNegocio);
        }
        // Caso 6: Buscar en cualquier propiedad que contenga "id"
        else {
            console.log('🔍 Buscando ID en todas las propiedades...');
            const buscarId = (obj, path = '') => {
                if (typeof obj !== 'object' || obj === null) return null;
                
                for (const [key, value] of Object.entries(obj)) {
                    const currentPath = path ? `${path}.${key}` : key;
                    
                    // Si la clave contiene "id" y el valor es un número
                    if (key.toLowerCase().includes('id') && (typeof value === 'number' || (typeof value === 'string' && !isNaN(value)))) {
                        console.log(`🎯 Posible ID encontrado en ${currentPath}:`, value);
                        return Number(value);
                    }
                    
                    // Buscar recursivamente en objetos
                    if (typeof value === 'object' && value !== null) {
                        const found = buscarId(value, currentPath);
                        if (found !== null) return found;
                    }
                }
                return null;
            };
            
            idNegocio = buscarId(resultado);
            if (idNegocio) {
                console.log('✅ ID encontrado recursivamente:', idNegocio);
            }
        }
        
        // ✅ VALIDAR QUE EL ID SEA VÁLIDO
        if (idNegocio !== null && idNegocio !== undefined) {
            const idNumerico = Number(idNegocio);
            if (!isNaN(idNumerico) && idNumerico > 0) {
                console.log('✅ ID válido encontrado:', idNumerico);
                return idNumerico;
            } else {
                console.warn('⚠️ ID no es un número válido:', idNegocio);
            }
        }
        
        // ✅ SI NO SE ENCUENTRA UN ID VÁLIDO
        console.warn('⚠️ No se pudo extraer un ID válido de la respuesta');
        console.warn('📊 Resultado completo:', resultado);
        
        // Mostrar alerta para debugging
        alert(`DEBUG: No se pudo extraer el ID del negocio. 
Revisa la consola para ver la estructura de la respuesta.
Resultado: ${JSON.stringify(resultado, null, 2)}`);
        
        return null;
        
    } catch (error) {
        console.error('❌ Error extrayendo ID del negocio:', error);
        console.error('📊 Resultado que causó el error:', resultado);
        return null;
    }
}

// ✅ FUNCIÓN ACTUALIZADA: Mostrar éxito con manejo de ID nulo
function mostrarExitoConId(idNegocio) {
    console.log('📢 Mostrando mensaje de éxito con ID:', idNegocio);
    
    // Remover mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-registro');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }
    
    // Crear mensaje con ID del negocio
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'mensaje-registro mensaje-success';
    
    // ✅ MANEJAR CASO CUANDO NO SE TIENE ID
    const contenidoId = idNegocio && idNegocio !== null ? 
        `<div style="font-size: 24px; font-weight: bold; color: #2e7d32; text-align: center; letter-spacing: 2px; background: #f8f8f8; padding: 10px; border-radius: 5px;">
            ${idNegocio}
        </div>` :
        `<div style="font-size: 16px; font-weight: bold; color: #f57c00; text-align: center; padding: 10px; border-radius: 5px; background: #fff3e0; border: 1px solid #ffb74d;">
            ⚠️ ID no disponible - Contacta al administrador
        </div>`;
    
    mensajeDiv.innerHTML = `
        <div style="margin-bottom: 15px;">
            <strong>🎉 ¡Registro exitoso!</strong>
        </div>
        <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 10px 0; border: 2px solid #4caf50;">
            <div style="font-size: 16px; margin-bottom: 8px;">
                <strong>📋 ID de tu negocio:</strong>
            </div>
            ${contenidoId}
            <div style="font-size: 12px; color: #666; margin-top: 8px; text-align: center;">
                ${idNegocio ? '⚠️ Guarda este ID para hacer login' : '⚠️ Revisa con el administrador para obtener tu ID'}
            </div>
        </div>
        <div style="margin-top: 15px; font-size: 14px;">
            🔄 Redirigiendo al login en <span id="countdown" style="font-weight: bold; color: #ff5722;">5</span> segundos...
        </div>
        <div style="margin-top: 15px;">
            <button id="btn-ir-login" style="background: #4caf50; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-weight: bold; margin-right: 10px; transition: background 0.3s;">
                🚀 Ir al Login Ahora
            </button>
            ${idNegocio ? `<button id="btn-copiar-id" style="background: #2196f3; color: white; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: background 0.3s;">
                📋 Copiar ID
            </button>` : ''}
        </div>
    `;
    
    // Estilos para el mensaje
    mensajeDiv.style.cssText = `
        padding: 25px;
        margin: 20px 0;
        border-radius: 12px;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
        color: #2e7d32;
        border: 2px solid #4caf50;
        box-shadow: 0 6px 20px rgba(76, 175, 80, 0.2);
        animation: slideIn 0.5s ease-out;
    `;
    
    // Agregar animación CSS
    if (!document.querySelector('#registro-animations')) {
        const style = document.createElement('style');
        style.id = 'registro-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            #btn-ir-login:hover {
                background: #45a049 !important;
                transform: translateY(-2px);
            }
            
            #btn-copiar-id:hover {
                background: #1976d2 !important;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Insertar antes del formulario
    const registerForm = document.getElementById('registerForm');
    const registerBox = registerForm.closest('.register-box') || registerForm.parentElement;
    registerBox.insertBefore(mensajeDiv, registerForm);
    
    // ✅ Resto de la funcionalidad (countdown, botones, etc.)
    let countdown = 5;
    const countdownElement = document.getElementById('countdown');
    const interval = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
            if (countdown <= 2) {
                countdownElement.style.color = '#d32f2f';
                countdownElement.style.fontSize = '16px';
            }
        }
        if (countdown <= 0) {
            clearInterval(interval);
            redirigirAlLogin(idNegocio);
        }
    }, 1000);
    
    // Botón para ir al login
    const btnIrLogin = document.getElementById('btn-ir-login');
    if (btnIrLogin) {
        btnIrLogin.onclick = () => {
            clearInterval(interval);
            redirigirAlLogin(idNegocio);
        };
    }
    
    // Botón para copiar ID (solo si hay ID)
    const btnCopiarId = document.getElementById('btn-copiar-id');
    if (btnCopiarId && idNegocio) {
        btnCopiarId.onclick = () => {
            copiarIdAlPortapapeles(idNegocio, btnCopiarId);
        };
    }
    
    // Auto-copiar al portapapeles si hay ID
    if (idNegocio) {
        copiarIdAlPortapapeles(idNegocio);
    }
}

// ✅ FUNCIÓN AUXILIAR: Redirigir al login con ID guardado
function redirigirAlLogin(idNegocio) {
    console.log('🔄 Redirigiendo al login con ID:', idNegocio);
    
    // Guardar el ID en localStorage para auto-llenar en login
    if (idNegocio) {
        localStorage.setItem('ultimoNegocioId', idNegocio.toString());
        localStorage.setItem('ultimoNegocioIdFecha', new Date().toISOString());
        console.log('💾 ID guardado en localStorage');
    }
    
    // Mostrar mensaje de redirección
    const mensajeDiv = document.querySelector('.mensaje-registro');
    if (mensajeDiv) {
        mensajeDiv.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 15px;">
                <strong>🔄 Redirigiendo...</strong>
            </div>
            <div style="font-size: 14px;">
                Serás redirigido al login en un momento
            </div>
        `;
    }
    
    // Redireccionar después de un breve delay
    setTimeout(() => {
        // Determinar la URL del login (ajusta según tu estructura)
        const loginUrl = window.location.href.includes('registro') 
            ? window.location.href.replace('registro.html', 'Login.html').replace('Registro.html', 'Login.html')
            : '/Login.html';
        
        console.log('🚀 Redirigiendo a:', loginUrl);
        window.location.href = loginUrl;
    }, 500);
}

// ✅ FUNCIÓN AUXILIAR: Copiar ID al portapapeles
function copiarIdAlPortapapeles(idNegocio, button = null) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(idNegocio.toString()).then(() => {
            console.log('📋 ID del negocio copiado al portapapeles');
            if (button) {
                const textoOriginal = button.textContent;
                button.textContent = '✅ Copiado!';
                button.style.background = '#4caf50';
                setTimeout(() => {
                    button.textContent = textoOriginal;
                    button.style.background = '#2196f3';
                }, 2000);
            }
        }).catch(err => {
            console.warn('⚠️ No se pudo copiar al portapapeles:', err);
            if (button) {
                const textoOriginal = button.textContent;
                button.textContent = '❌ Error';
                setTimeout(() => {
                    button.textContent = textoOriginal;
                }, 2000);
            }
        });
    } else {
        // Fallback para navegadores que no soportan clipboard API
        console.log('📋 Clipboard API no disponible, usando fallback');
        if (button) {
            button.textContent = '⚠️ Manual';
        }
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