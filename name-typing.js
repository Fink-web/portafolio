// Versión simple para producción
const nameElement = document.getElementById('nameTyping');
const yourName = "Ariel Alejandro Fink"; // 👈 Cambia esto

function typeWriterName(text, element, speed = 120) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    // Iniciar con delay
    setTimeout(type, 800);
}

// Auto-iniciar
window.addEventListener('load', () => {
    typeWriterName(yourName, nameElement);
});