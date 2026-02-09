// --- CONFIGURACIÓN DE CONEXIÓN AITech ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxwO7KYMS93UaLusJTY0VIMY3B80Ir6BZXwbdBACO5_AbSAUIKMVNX4P-7i71ew2Dil/exec';

// Cursos de respaldo (se muestran si falla el Sheet)
const backupCourses = [
    { titulo: "AITech: Futuro de la IA", descripcion: "Cargando catálogo actualizado...", imagen: "logoaitech educacion.webp", precio: "Consultar" }
];

const coursesContainer = document.getElementById('courses-container');
const modal = document.getElementById('enrollment-modal');
const closeModal = document.querySelector('.close-modal');
const enrollmentForm = document.getElementById('enrollment-form');
const selectedCourseName = document.getElementById('selected-course-name');
const courseInput = document.getElementById('course-input');

// Elementos de Tarjeta Modal
const cardModal = document.getElementById('card-modal');
const btnSaberMas = document.getElementById('btn-saber-mas');
const closeCardModal = document.querySelector('.close-card-modal');

async function loadDataFromSheets() {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL + '?t=' + new Date().getTime()); // Evitar cache
        const data = await response.json();

        if (data.cursos && data.cursos.length > 0) {
            renderCourses(data.cursos);
        } else {
            renderCourses(backupCourses);
        }

        // Actualizar Videos
        if (data.config) {
            const vPres = document.getElementById('video-presentation');
            const vNew = document.getElementById('video-new-course');
            if (data.config.VideoPresentacion) {
                vPres.querySelector('source').src = data.config.VideoPresentacion;
                vPres.load();
            }
            if (data.config.VideoNuevo) {
                vNew.querySelector('source').src = data.config.VideoNuevo;
                vNew.load();
            }
        }
    } catch (error) {
        console.error('Error:', error);
        renderCourses(backupCourses);
    }
}

function renderCourses(courses) {
    coursesContainer.innerHTML = '';
    courses.forEach(course => {
        // Normalizar los nombres de las propiedades (por si tienen tildes o mayúsculas en el Sheet)
        const titulo = course.titulo || course.titulos || "Sin título";
        const desc = course.descripcion || course.description || "Sin descripción";
        const img = course.imagen || course.image || "logoaitech educacion.webp";
        const precio = course.precio || course.price || "N/A";

        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <div class="course-img">
                <img src="${img}" alt="${titulo}" onerror="this.src='logoaitech educacion.webp'">
            </div>
            <h3 style="color: var(--primary);">${titulo}</h3>
            <p>${desc}</p>
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; color: var(--secondary); font-size: 1.2rem;">${precio}</span>
                <button class="btn btn-primary" onclick="openEnrollment('${titulo}')" style="padding: 10px 20px; font-size: 0.8rem;">INSCRIBIRME</button>
            </div>
        `;
        coursesContainer.appendChild(card);
    });
}

window.openEnrollment = function (title) {
    selectedCourseName.innerText = title;
    courseInput.value = title;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

closeModal.onclick = () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Lógica para Tarjeta Modal
if (btnSaberMas) {
    btnSaberMas.onclick = () => {
        cardModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };
}

if (closeCardModal) {
    closeCardModal.onclick = () => {
        cardModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
}

window.onclick = (event) => {
    if (event.target == modal) closeModal.onclick();
    if (event.target == cardModal) closeCardModal.onclick();
};

enrollmentForm.onsubmit = async (e) => {
    e.preventDefault();
    const btn = enrollmentForm.querySelector('button');
    btn.innerText = 'ENVIANDO...';
    btn.disabled = true;

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(Object.fromEntries(new FormData(enrollmentForm).entries()))
        });
        alert('¡Registro enviado! Hernán validará tu pago por Nequi para darte acceso.');
        enrollmentForm.reset();
        closeModal.onclick();
    } catch (e) {
        alert('Error al enviar. Intenta de nuevo.');
    } finally {
        btn.innerText = 'ENVIAR INSCRIPCIÓN';
        btn.disabled = false;
    }
};

document.addEventListener('DOMContentLoaded', loadDataFromSheets);
