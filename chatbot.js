// --- AITech Bot Conversacional ---
// Motor de chat con respuestas basadas en keywords

const chatbotResponses = {
    saludo: {
        keywords: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'saludos', 'qué tal', 'hi', 'hello'],
        response: '¡Hola! 👋 Soy **AIBot**, el asistente virtual de **AITech Educación**. ¿En qué puedo ayudarte hoy?\n\nPuedes preguntarme sobre:\n🎓 Cursos disponibles\n💰 Precios\n📝 Inscripción\n💳 Métodos de pago\n📞 Contacto'
    },
    cursos: {
        keywords: ['cursos', 'curso', 'catálogo', 'catalogo', 'oferta', 'programas', 'clases', 'qué enseñan', 'que enseñan', 'aprender', 'formación', 'formacion', 'capacitación', 'capacitacion'],
        response: null // Se genera dinámicamente
    },
    precios: {
        keywords: ['precio', 'precios', 'cuánto cuesta', 'cuanto cuesta', 'costo', 'valor', 'tarifa', 'inversión', 'inversion', 'cuánto vale', 'cuanto vale', 'pagar'],
        response: null // Se genera dinámicamente
    },
    inscripcion: {
        keywords: ['inscribirme', 'inscribir', 'inscripción', 'inscripcion', 'registrar', 'registro', 'matricula', 'matrícula', 'agendar', 'anotarme', 'quiero entrar', 'unirme'],
        response: '¡Excelente decisión! 🚀 Para inscribirte, tienes dos opciones:\n\n1️⃣ **Desde aquí**: Dime el nombre del curso y abro el formulario por ti.\n2️⃣ **Directamente**: Haz clic en "INSCRIBIRME" en cualquier tarjeta de curso.\n\n¿A qué curso te gustaría inscribirte?',
        action: 'showCourseOptions'
    },
    pago: {
        keywords: ['nequi', 'pago', 'transferencia', 'pagar', 'método de pago', 'metodo de pago', 'como pago', 'cómo pago', 'forma de pago'],
        response: '💳 **Método de Pago — Nequi**\n\n📱 Número: **311 207 8846**\n\nPasos:\n1. Realiza la transferencia por Nequi al número indicado\n2. Llena el formulario de inscripción con tus datos\n3. Hernán validará tu pago y te dará acceso al curso\n\n¿Quieres inscribirte a algún curso? 😊'
    },
    contacto: {
        keywords: ['contacto', 'contactar', 'teléfono', 'telefono', 'whatsapp', 'llamar', 'escribir', 'correo', 'email', 'comunicar', 'hernán', 'hernan'],
        response: '📞 **Contacto AITech Educación**\n\n📱 WhatsApp: **311 207 8846**\n👤 Hernán — Fundador de AITech\n\nTambién puedes inscribirte directamente aquí en la web. ¿Te ayudo con eso?'
    },
    horarios: {
        keywords: ['horario', 'horarios', 'cuándo', 'cuando', 'hora', 'horas', 'días', 'dias', 'duración', 'duracion', 'tiempo', 'fechas', 'fecha', 'inicio', 'empieza', 'comienza'],
        response: '🕐 Los horarios varían según cada curso. Te recomiendo:\n\n1. Consultar los detalles del curso que te interesa\n2. Contactar directamente a Hernán por WhatsApp: **311 207 8846**\n\n¿Quieres que te muestre los cursos disponibles?'
    },
    ia: {
        keywords: ['inteligencia artificial', 'ia', 'machine learning', 'deep learning', 'chatgpt', 'openai', 'gemini', 'copilot', 'robot', 'automatización', 'automatizacion'],
        response: '🤖 **¡La IA es nuestra pasión!**\n\nEn AITech Educación nos especializamos en cursos de:\n• Inteligencia Artificial para educadores\n• Herramientas de IA (ChatGPT, Gemini, Copilot)\n• Programación con IA\n• Scratch y pensamiento computacional para niños\n\n¿Te gustaría ver nuestros cursos disponibles?'
    },
    programacion: {
        keywords: ['programación', 'programacion', 'programar', 'código', 'codigo', 'scratch', 'python', 'javascript', 'niños', 'ninos', 'kids'],
        response: '💻 **Cursos de Programación**\n\nOfrecemos cursos para todas las edades:\n• 🧒 **Scratch** para niños — pensamiento computacional\n• 🎓 **Herramientas de IA** para educadores\n• 🚀 **Programación** aplicada con IA\n\n¿Quieres ver el catálogo completo o inscribirte?'
    },
    gracias: {
        keywords: ['gracias', 'muchas gracias', 'gracias por', 'te agradezco', 'agradezco', 'genial', 'excelente', 'perfecto', 'vale', 'ok', 'listo'],
        response: '¡Con mucho gusto! 😊 Si necesitas algo más, aquí estaré. ¡En AITech estamos para ayudarte a transformar el futuro con IA! 🚀'
    },
    despedida: {
        keywords: ['adiós', 'adios', 'chao', 'bye', 'nos vemos', 'hasta luego', 'hasta pronto'],
        response: '¡Hasta pronto! 👋 Recuerda que siempre puedes volver a escribirme. ¡Te esperamos en AITech Educación! 🌟'
    }
};

// Estado del chatbot
let chatbotOpen = false;
let loadedCourses = []; // Se llena cuando los cursos cargan desde el Sheet
let isTyping = false;

// Observar cuando los cursos se cargan en el DOM
function observeCourses() {
    const container = document.getElementById('courses-container');
    if (!container) return;

    const observer = new MutationObserver(() => {
        const cards = container.querySelectorAll('.course-card');
        loadedCourses = [];
        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent || '';
            const price = card.querySelector('span[style*="font-weight: bold"]')?.textContent || 'Consultar';
            const desc = card.querySelector('p')?.textContent || '';
            if (title && title !== 'Cargando cursos...') {
                loadedCourses.push({ titulo: title, precio: price, descripcion: desc });
            }
        });
    });

    observer.observe(container, { childList: true, subtree: true });
}

// Generar respuesta dinámica de cursos
function getCursosResponse() {
    if (loadedCourses.length === 0) {
        return '🎓 **Nuestros Cursos**\n\nEstamos cargando el catálogo actualizado. Mientras tanto, puedes:\n• Desplazarte a la sección de cursos en la página\n• Contactar a Hernán al **311 207 8846**\n\n¡Pronto tendremos la info lista!';
    }

    let msg = '🎓 **Cursos Disponibles en AITech:**\n\n';
    loadedCourses.forEach((c, i) => {
        msg += `${i + 1}. **${c.titulo}** — ${c.precio}\n`;
    });
    msg += '\n¿Te interesa alguno? Dime cuál y te inscribo directamente. 😊';
    return msg;
}

// Generar respuesta dinámica de precios
function getPreciosResponse() {
    if (loadedCourses.length === 0) {
        return '💰 Los precios varían según el curso. Contacta a Hernán al **311 207 8846** para más detalles.\n\n¿Quieres ver los cursos disponibles?';
    }

    let msg = '💰 **Precios de nuestros cursos:**\n\n';
    loadedCourses.forEach((c, i) => {
        msg += `• **${c.titulo}**: ${c.precio}\n`;
    });
    msg += '\n💳 Pago por **Nequi**: 311 207 8846\n\n¿Te gustaría inscribirte?';
    return msg;
}

// Buscar la mejor respuesta
function findResponse(userMessage) {
    const msg = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Verificar si quiere inscribirse a un curso específico
    if (loadedCourses.length > 0) {
        for (const course of loadedCourses) {
            const courseTitle = course.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (msg.includes(courseTitle) || courseTitle.includes(msg)) {
                return {
                    text: `¡Perfecto! Abriré el formulario de inscripción para **${course.titulo}** 📝`,
                    action: () => {
                        setTimeout(() => {
                            if (typeof window.openEnrollment === 'function') {
                                window.openEnrollment(course.titulo);
                            }
                        }, 1000);
                    }
                };
            }
        }
    }

    // Buscar por keywords
    let bestMatch = null;
    let maxScore = 0;

    for (const [category, data] of Object.entries(chatbotResponses)) {
        let score = 0;
        for (const keyword of data.keywords) {
            const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (msg.includes(normalizedKeyword)) {
                score += normalizedKeyword.length; // Más largo = más relevante
            }
        }
        if (score > maxScore) {
            maxScore = score;
            bestMatch = category;
        }
    }

    if (bestMatch) {
        const data = chatbotResponses[bestMatch];
        let responseText = data.response;

        // Respuestas dinámicas
        if (bestMatch === 'cursos') responseText = getCursosResponse();
        if (bestMatch === 'precios') responseText = getPreciosResponse();

        return {
            text: responseText,
            action: data.action === 'showCourseOptions' && loadedCourses.length > 0
                ? () => {
                    setTimeout(() => {
                        addBotMessage(getCursosResponse());
                    }, 1500);
                }
                : null
        };
    }

    // Respuesta por defecto
    return {
        text: '🤔 No estoy seguro de entender tu pregunta. Puedo ayudarte con:\n\n🎓 **Cursos** — "¿Qué cursos tienen?"\n💰 **Precios** — "¿Cuánto cuesta?"\n📝 **Inscripción** — "Quiero inscribirme"\n💳 **Pago** — "¿Cómo pago?"\n📞 **Contacto** — "¿Cómo los contacto?"\n\n¡Intenta con alguna de estas opciones!',
        action: null
    };
}

// Formatear markdown simple a HTML
function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

// Agregar mensaje del bot
function addBotMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message bot-message';
    msgDiv.innerHTML = `
        <div class="message-avatar">
            <img src="Logo de pie.png" alt="AIBot">
        </div>
        <div class="message-bubble">${formatMessage(text)}</div>
    `;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Agregar mensaje del usuario
function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message user-message';
    msgDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Mostrar indicador de "escribiendo..."
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <img src="Logo de pie.png" alt="AIBot">
        </div>
        <div class="message-bubble typing-dots">
            <span></span><span></span><span></span>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
    isTyping = false;
}

// Procesar mensaje del usuario
function processUserMessage(text) {
    if (!text.trim() || isTyping) return;

    addUserMessage(text);

    // Mostrar "escribiendo..." y responder después de un delay
    showTypingIndicator();

    const delay = 800 + Math.random() * 1200; // Entre 0.8 y 2 segundos
    setTimeout(() => {
        removeTypingIndicator();
        const response = findResponse(text);
        addBotMessage(response.text);
        if (response.action) response.action();
    }, delay);
}

// Toggle del chatbot
function toggleChatbot() {
    const chatWindow = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    const badge = document.getElementById('chatbot-badge');

    if (!chatWindow || !toggle) return;

    chatbotOpen = !chatbotOpen;

    if (chatbotOpen) {
        chatWindow.classList.add('open');
        toggle.classList.add('active');
        if (badge) badge.style.display = 'none';

        // Mensaje de bienvenida solo la primera vez
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer && messagesContainer.children.length === 0) {
            setTimeout(() => {
                addBotMessage('¡Hola! 👋 Soy **AIBot**, tu asistente virtual de **AITech Educación**.\n\n¿En qué puedo ayudarte hoy?\n\n🎓 Cursos disponibles\n💰 Precios\n📝 Inscripción\n💳 Métodos de pago\n📞 Contacto');
            }, 500);
        }

        // Focus en el input
        const input = document.getElementById('chatbot-input');
        if (input) setTimeout(() => input.focus(), 600);
    } else {
        chatWindow.classList.remove('open');
        toggle.classList.remove('active');
    }
}

// Inicializar chatbot
function initChatbot() {
    // Toggle button
    const toggleBtn = document.getElementById('chatbot-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleChatbot);

    // Close button
    const closeBtn = document.getElementById('chatbot-close');
    if (closeBtn) closeBtn.addEventListener('click', toggleChatbot);

    // Send button
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    if (sendBtn && input) {
        sendBtn.addEventListener('click', () => {
            processUserMessage(input.value);
            input.value = '';
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                processUserMessage(input.value);
                input.value = '';
            }
        });
    }

    // Quick action buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('chatbot-quick-btn')) {
            const action = e.target.dataset.action;
            processUserMessage(action);
        }
    });

    // Observar cursos
    observeCourses();

    // Mostrar badge de notificación después de 3 segundos
    setTimeout(() => {
        if (!chatbotOpen) {
            const badge = document.getElementById('chatbot-badge');
            if (badge) badge.style.display = 'flex';
        }
    }, 3000);
}

document.addEventListener('DOMContentLoaded', initChatbot);
