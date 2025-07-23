document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    
    // Crear div para mensajes si no existe
    let mensajeDiv = document.getElementById('mensaje');
    if (!mensajeDiv) {
        mensajeDiv = document.createElement('div');
        mensajeDiv.id = 'mensaje';
        mensajeDiv.className = 'mensaje';
        form.parentNode.insertBefore(mensajeDiv, form);
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener los datos del formulario
        const formData = new FormData(form);
        
        // Crear el objeto JSON para enviar (adaptado a los nombres de tu HTML)
        const registroData = {
            nombreUsuario: formData.get('username'),
            correo: formData.get('email'),
            rol: "Admin", // Por defecto para el creador del negocio
            contrasena: formData.get('password'),
            calle: formData.get('calle'),
            colonia: formData.get('colonia'),
            codigoPostal: formData.get('codigoPostal'),
            negocio: {
                nombreNegocio: formData.get('negocio')
            },
            creador: {
                nombreUsuario: null
            }
        };

        // Validación básica
        if (!registroData.nombreUsuario || !registroData.correo || !registroData.contrasena || 
            !registroData.calle || !registroData.colonia || !registroData.codigoPostal || 
            !registroData.negocio.nombreNegocio) {
            mostrarMensaje('Por favor, complete todos los campos', 'error');
            return;
        }

        try {
            // Mostrar loading
            mostrarMensaje('Registrando...', 'info');
            
            // Realizar el POST al endpoint
            const response = await fetch('http://localhost:8080/negocio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registroData)
            });

            if (response.ok) {
                const resultado = await response.json();
                
                // Mostrar mensaje de éxito con el ID del negocio MUY VISIBLE
                mostrarMensaje(
                    `<div class="registro-exitoso">
                        <div class="check-icon">✅</div>
                        <h2>¡REGISTRO EXITOSO!</h2>
                        <div class="id-container">
                            <div class="id-label">ID DE TU NEGOCIO:</div>
                            <div class="id-numero">${resultado.idNegocio}</div>
                        </div>
                        <div class="instruccion">
                            🔒 <strong>GUARDA ESTE ID</strong> - Lo necesitarás para hacer login
                        </div>
                        <div class="countdown">Redirigiendo al login en <span id="countdown">5</span> segundos...</div>
                    </div>`, 
                    'success'
                );
                
                // Limpiar el formulario
                form.reset();
                
                // Countdown visual
                let segundos = 5;
                const countdownElement = document.getElementById('countdown');
                const countdownInterval = setInterval(() => {
                    segundos--;
                    if (countdownElement) {
                        countdownElement.textContent = segundos;
                    }
                    if (segundos <= 0) {
                        clearInterval(countdownInterval);
                    }
                }, 1000);
                
                // Redirigir al login después de 5 segundos
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 5000);
                
            } else {
                const error = await response.text();
                mostrarMensaje(`Error en el registro: ${error}`, 'error');
            }
            
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
        }
    });

    function mostrarMensaje(texto, tipo) {
        mensajeDiv.innerHTML = texto;
        mensajeDiv.className = `mensaje ${tipo}`;
        mensajeDiv.style.display = 'block';
        
        // Auto-ocultar después de 8 segundos si es un mensaje de error
        if (tipo === 'error') {
            setTimeout(() => {
                mensajeDiv.style.display = 'none';
            }, 8000);
        }
    }
});