// --- CONFIGURACIÓN DE CONEXIÓN AITech ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxwO7KYMS93UaLusJTY0VIMY3B80Ir6BZXwbdBACO5_AbSAUIKMVNX4P-7i71ew2Dil/exec';

// Cursos de respaldo (se muestran si falla el Sheet o mientras carga)
const backupCourses = [
    {
        titulo: "Usa Scratch con IA para tus estudiantes",
        descripcion: "Aprende a integrar bloques de inteligencia artificial en Scratch para crear proyectos educativos interactivos.",
        imagen: "logoaitech educacion.webp",
        precio: "$29.99"
    },
    {
        titulo: "Enseña a hacer aplicaciones con Gemini",
        description: "Descubre cómo guiar a tus estudiantes en la creación de sus propias apps utilizando Google Gemini.",
        imagen: "logoaitech educacion.webp",
        precio: "$39.99"
    },
    {
        titulo: "Crea videojuegos con IA",
        descripcion: "Workshop intensivo para diseñar mecánicas de juego y personajes utilizando herramientas de IA generativa.",
        imagen: "logoaitech educacion.webp",
        precio: "$45.00"
    },
    {
        titulo: "Crear contenido educativo con NotebookLM",
        descripcion: "Domina la herramienta de Google para organizar información y crear material didáctico inteligente.",
        imagen: "logoaitech educacion.webp",
        precio: "$35.00"
    }
];

// Elementos del DOM
const coursesContainer = document.getElementById('courses-container');
const modal = document.getElementById('enrollment-modal');
const closeModal = document.querySelector('.close-modal');
const enrollmentForm = document.getElementById('enrollment-form');
const selectedCourseName = document.getElementById('selected-course-name');
const courseInput = document.getElementById('course-input');

// Elementos de Video
const videoPresentation = document.getElementById('video-presentation');
const videoNewCourse = document.getElementById('video-new-course');

/**
 * 1. CARGA DINÁMICA DESDE GOOGLE SHEETS
 */
async function loadDataFromSheets() {
    try {
        console.log("Intentando conectar con AITech API...");

        // Timeout de 5 segundos para la conexión
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(GOOGLE_SCRIPT_URL, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Respuesta no satisfactoria');

        const data = await response.json();
        console.log("Datos de AITech cargados con éxito:", data);

        if (data.cursos && data.cursos.length > 0) {
            renderCourses(data.cursos);
        } else {
            console.warn("Sheet vacío, usando respaldo.");
            renderCourses(backupCourses);
        }

        // Actualizar Videos
        if (data.config) {
            if (data.config.VideoPresentacion) {
                videoPresentation.querySelector('source').src = data.config.VideoPresentacion;
                videoPresentation.load();
            }
            if (data.config.VideoNuevo) {
                videoNewCourse.querySelector('source').src = data.config.VideoNuevo;
                videoNewCourse.load();
            }
        }

    } catch (error) {
        console.error('Error de conexión con Sheets:', error);
        console.log("Mostrando cursos de respaldo...");
        renderCourses(backupCourses);
    }
}

/**
 * 2. RENDERIZAR CURSOS EN LA WEB
 */
function renderCourses(courses) {
    coursesContainer.innerHTML = '';

    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <div class="course-img">
                <img src="${course.imagen || 'logoaitech educacion.webp'}" alt="${course.titulo}" onerror="this.src='logoaitech educacion.webp'">
            </div>
            <h3 style="color: var(--primary);">${course.titulo}</h3>
            <p>${course.descripcion || course.description}</p>
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; color: var(--secondary); font-size: 1.2rem;">${course.precio}</span>
                <button class="btn btn-primary" onclick="openEnrollment('${course.titulo}')" style="padding: 10px 20px; font-size: 0.8rem;">INSCRIBIRME</button>
            </div>
        `;
        coursesContainer.appendChild(card);
    });
}

/**
 * 3. MANEJO DEL MODAL
 */
window.openEnrollment = function (courseTitle) {
    selectedCourseName.innerText = courseTitle;
    courseInput.value = courseTitle;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

closeModal.onclick = () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

/**
 * 4. ENVÍO DE FORMULARIO
 */
enrollmentForm.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = enrollmentForm.querySelector('button');
    submitBtn.innerText = 'PROCESANDO...';
    submitBtn.disabled = true;

    const formData = new FormData(enrollmentForm);
    const data = Object.fromEntries(formData.entries());

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(data)
        });

        alert('¡Solicitud enviada! En breve te llegará un correo de confirmación y Hernán te contactará.');
        enrollmentForm.reset();
        closeModal.onclick();
    } catch (error) {
        alert('Error al enviar. Por favor verifica tu conexión.');
    } finally {
        submitBtn.innerText = 'ENVIAR SOLICITUD Y PAGAR';
        submitBtn.disabled = false;
    }
};

document.addEventListener('DOMContentLoaded', loadDataFromSheets);
