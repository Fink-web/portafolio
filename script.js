// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Scroll spy for active sections
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 300)) {
            current = section.getAttribute('id');
        }
    });
    
    // Highlight active nav link
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.about-text, .project-card, .skill-category, .timeline-item, .contact-info, .contact-form');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('active');
        }
    });
};

// Set all sections to active when they come into view
const animateSections = () => {
    sections.forEach(section => {
        const sectionPosition = section.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (sectionPosition < screenPosition) {
            section.classList.add('active');
        }
    });
};

window.addEventListener('scroll', () => {
    animateOnScroll();
    animateSections();
});

// Initialize animations on load
window.addEventListener('load', () => {
    animateOnScroll();
    animateSections();
    
    // Hero animations
    document.querySelector('.hero-content').style.animation = 'fadeInUp 1s ease forwards';
    document.querySelector('.hero-image').style.animation = 'fadeInUp 1s ease 0.3s forwards';
});

// Función para detectar dispositivo móvil
function esMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ===== FUNCIONES DE VALIDACIÓN DE EMAIL (NUEVAS) =====

// Función para validar formato de email más estricta
function validarEmailEstructura(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Función para verificar dominios comunes válidos
function esDominioValido(email) {
    const dominiosComunes = [
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com',
        'aol.com', 'icloud.com', 'protonmail.com', 'tutanota.com',
        'company.com', 'organization.org', 'university.edu',
        // Dominios argentinos
        'fibertel.com.ar', 'arnet.com.ar', 'speedy.com.ar', 'ciudad.com.ar',
        // Dominios corporativos comunes
        'microsoft.com', 'google.com', 'apple.com', 'amazon.com'
    ];
    
    const domain = email.toLowerCase().split('@')[1];
    
    // Verificar si es un dominio común
    if (dominiosComunes.includes(domain)) {
        return true;
    }
    
    // Verificar si parece un dominio real (tiene al menos un punto y extensión válida)
    const domainParts = domain.split('.');
    const validExtensions = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'ar', 'es', 'mx', 'co', 'cl', 'pe'];
    
    return domainParts.length >= 2 && 
           validExtensions.includes(domainParts[domainParts.length - 1]) &&
           domainParts[0].length > 1;
}

// Función para detectar emails obviamente falsos
function esEmailSospechoso(email) {
    const patronesSospechosos = [
        /test@/i,
        /fake@/i,
        /noemail@/i,
        /example@/i,
        /demo@/i,
        /prueba@/i,
        /falso@/i,
        /@test\./i,
        /@fake\./i,
        /@example\./i,
        /123@/i,
        /abc@/i,
        /@123\./i,
        /@abc\./i
    ];
    
    return patronesSospechosos.some(patron => patron.test(email));
}

// Función de validación completa
function validarEmailCompleto(email) {
    if (!email) {
        return { valido: false, mensaje: 'El email es requerido' };
    }
    
    if (!validarEmailEstructura(email)) {
        return { valido: false, mensaje: 'El formato del email no es válido' };
    }
    
    if (esEmailSospechoso(email)) {
        return { valido: false, mensaje: 'Por favor, usa tu email real para poder contactarte' };
    }
    
    if (!esDominioValido(email)) {
        return { valido: false, mensaje: 'El dominio del email parece no ser válido' };
    }
    
    return { valido: true, mensaje: 'Email válido' };
}

// ===== FIN FUNCIONES DE VALIDACIÓN =====

// ===== FUNCIONES DE EMAIL CORREGIDAS =====

// Función para detectar proveedor de correo preferido
function detectarProveedorCorreo() {
    // 1. Detectar por dominio del email ingresado
    const emailInput = document.getElementById('email');
    if (emailInput && emailInput.value) {
        const emailDomain = emailInput.value.toLowerCase().split('@')[1];
        
        if (emailDomain) {
            if (emailDomain.includes('gmail')) return 'gmail';
            if (emailDomain.includes('outlook') || emailDomain.includes('hotmail') || emailDomain.includes('live')) return 'outlook';
            if (emailDomain.includes('yahoo')) return 'yahoo';
        }
    }
    
    // 2. Por defecto Gmail (más popular)
    return 'gmail';
}

// Función para abrir el proveedor específico
function abrirProveedorCorreo(proveedor, destinatario, asunto, cuerpo) {
    const urls = {
        gmail: `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(destinatario)}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`,
        outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(destinatario)}&subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`,
        yahoo: `https://compose.mail.yahoo.com/?to=${encodeURIComponent(destinatario)}&subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
    };
    
    const url = urls[proveedor] || urls.gmail;
    console.log(`Abriendo ${proveedor}:`, url); // Debug
    window.open(url, '_blank');
}

// Función para mostrar selector de proveedor
function mostrarSelectorProveedor(destinatario, asunto, cuerpo) {
    const providers = [
        { id: 'gmail', name: 'Gmail', icon: '📧' },
        { id: 'outlook', name: 'Outlook', icon: '📮' },
        { id: 'yahoo', name: 'Yahoo Mail', icon: '📪' },
        { id: 'mailto', name: 'Cliente predeterminado', icon: '✉️' }
    ];
    
    let options = providers.map((p, index) => `${index + 1}. ${p.icon} ${p.name}`).join('\n');
    
    const choice = prompt(`Selecciona tu proveedor de correo:\n\n${options}\n\nEscribe el número (1-4):`);
    
    if (!choice) return;
    
    const choiceNum = parseInt(choice);
    
    if (choiceNum === 1) {
        abrirProveedorCorreo('gmail', destinatario, asunto, cuerpo);
    } else if (choiceNum === 2) {
        abrirProveedorCorreo('outlook', destinatario, asunto, cuerpo);
    } else if (choiceNum === 3) {
        abrirProveedorCorreo('yahoo', destinatario, asunto, cuerpo);
    } else if (choiceNum === 4) {
        const mailtoUrl = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
        window.location.href = mailtoUrl;
    } else {
        // Por defecto Gmail si la opción no es válida
        abrirProveedorCorreo('gmail', destinatario, asunto, cuerpo);
    }
}

// Función híbrida mejorada para envío de correo
function enviarCorreoInteligente(destinatario, asunto, cuerpo, mostrarSelector = false) {
    console.log('Enviando correo con:', { destinatario, asunto, mostrarSelector }); // Debug
    
    if (esMobile()) {
        // En móviles usa mailto (más confiable)
        const mailtoUrl = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
        console.log('Móvil detectado, usando mailto:', mailtoUrl); // Debug
        window.location.href = mailtoUrl;
    } else {
        // En escritorio detectar proveedor preferido
        if (mostrarSelector) {
            console.log('Mostrando selector de proveedor'); // Debug
            mostrarSelectorProveedor(destinatario, asunto, cuerpo);
        } else {
            const proveedorPreferido = detectarProveedorCorreo();
            console.log('Proveedor detectado:', proveedorPreferido); // Debug
            abrirProveedorCorreo(proveedorPreferido, destinatario, asunto, cuerpo);
        }
    }
}

// ===== FIN FUNCIONES DE EMAIL CORREGIDAS =====

// ===== FUNCIÓN SHOWSUCCESSTOAST =====

function showSuccessToast(message) {
    // Remover toasts existentes
    const existingToast = document.querySelector('.success-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Crear el toast
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(toast);
    
    // Mostrar con animación
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast && toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}

// ===== FIN FUNCIÓN SHOWSUCCESSTOAST =====

// Form submission modificado CON VALIDACIÓN DE EMAIL CORREGIDA
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Deshabilita el botón para evitar múltiples envíos
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        // Obtiene los datos del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // NUEVA VALIDACIÓN DE EMAIL ANTES DE ENVIAR
        const validacionEmail = validarEmailCompleto(email);
        if (!validacionEmail.valido) {
            showSuccessToast(`Error en el email: ${validacionEmail.mensaje}`);
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            return;
        }

        // Preparar mensaje para correo directo
        const cuerpoCorreo = `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`;

        const formData = {
            name: name,
            email: email,
            subject: subject,
            message: message
        };

        try {
            const response = await fetch("https://formspree.io/f/mqaljyjl", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showSuccessToast('¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.');
                contactForm.reset(); // Limpia el formulario
            } else {
                const data = await response.json();
                showSuccessToast(`Hubo un error: ${data.errors.map(err => err.message).join(', ')}`);
            }
        } catch (error) {
            console.error('Error en el envío:', error);
            
            // Si falla Formspree, ofrecer opciones de correo directo
            const choice = confirm('El envío automático falló.\n\n✅ OK = Detectar tu proveedor automáticamente\n❌ Cancelar = Elegir proveedor manualmente\n\n¿Proceder con detección automática?');
            
            if (choice) {
                // Detección automática
                enviarCorreoInteligente('afink6042@gmail.com', subject, cuerpoCorreo, false);
            } else {
                // Selector manual
                enviarCorreoInteligente('afink6042@gmail.com', subject, cuerpoCorreo, true);
            }
        } finally {
            // Vuelve a habilitar el botón después del envío (éxito o fracaso)
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// DETECTAR PROVEEDOR Y VALIDAR CUANDO EL USUARIO ESCRIBE SU EMAIL (MODIFICADO)
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            // Remover indicadores anteriores
            const existingIndicators = emailInput.parentNode.querySelectorAll('.email-provider-indicator, .email-validation-error');
            existingIndicators.forEach(indicator => indicator.remove());
            
            if (this.value && this.value.includes('@')) {
                // Validar email completo
                const validacion = validarEmailCompleto(this.value);
                
                if (!validacion.valido) {
                    // Mostrar error de validación
                    const errorIndicator = document.createElement('small');
                    errorIndicator.style.color = '#dc3545';
                    errorIndicator.style.fontSize = '12px';
                    errorIndicator.style.marginTop = '5px';
                    errorIndicator.style.display = 'block';
                    errorIndicator.textContent = `❌ ${validacion.mensaje}`;
                    errorIndicator.className = 'email-validation-error';
                    emailInput.parentNode.appendChild(errorIndicator);
                    
                    // Marcar el input como inválido visualmente
                    emailInput.style.borderColor = '#dc3545';
                    return;
                }
                
                // Si es válido, mostrar proveedor detectado
                const provider = detectarProveedorCorreo();
                const successIndicator = document.createElement('small');
                successIndicator.style.color = '#28a745';
                successIndicator.style.fontSize = '12px';
                successIndicator.style.marginTop = '5px';
                successIndicator.style.display = 'block';
                successIndicator.textContent = `✅ Email válido - Proveedor: ${provider.charAt(0).toUpperCase() + provider.slice(1)}`;
                successIndicator.className = 'email-provider-indicator';
                emailInput.parentNode.appendChild(successIndicator);
                
                // Restaurar borde normal
                emailInput.style.borderColor = '';
            }
        });
        
        // También validar mientras escribe (opcional)
        emailInput.addEventListener('input', function() {
            // Remover estilos de error mientras escribe
            this.style.borderColor = '';
            const errorIndicators = this.parentNode.querySelectorAll('.email-validation-error');
            errorIndicators.forEach(indicator => indicator.remove());
        });
    }
});

// Efecto flotante para el botón
const hireBtn = document.querySelector('.hire-cta .btn');
if (hireBtn) {
    hireBtn.style.transition = 'transform 0.3s ease';
    hireBtn.addEventListener('mouseenter', () => {
        hireBtn.style.transform = 'translateY(-5px)';
    });
    hireBtn.addEventListener('mouseleave', () => {
        hireBtn.style.transform = 'translateY(0)';
    });
}

// Para revelar elementos al scroll
document.addEventListener('scroll', () => {
  const elements = document.querySelectorAll('.reveal');
  elements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('reveal');
    }
  });
});

// Para menú móvil
const mobileMenuBtnSecondary = document.querySelector('.mobile-menu-btn');
if (mobileMenuBtnSecondary) {
    mobileMenuBtnSecondary.addEventListener('click', () => {
      document.querySelector('nav').classList.toggle('active');
    });
}

// === SECCIÓN DE PROYECTOS ===

// Datos de proyectos (puedes mover esto a un archivo JSON si prefieres)
const projects = [
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Plataforma de Automatización Personal",
    date: "2025 — En desarrollo",
    description: "Sistema completo para centralizar y automatizar flujos de información utilizando tecnologías como n8n, Make, IFTTT y RSSHub. Incluye desarrollo de interfaz web responsive y panel de control personalizado.",
    tech: ["HTML5", "CSS3", "JavaScript", "n8n", "Make", "IFTTT"],
    link: "#contact"
  },
  {
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Interface Web Responsiva",
    date: "2025 — Frontend",
    description: "Landing page completamente optimizada para dispositivos móviles con 95% de compatibilidad y tiempo de carga inferior a 2 segundos. Incluye animaciones CSS avanzadas y diseño UX/UI moderno.",
    tech: ["HTML5", "CSS3", "JavaScript", "UX/UI", "Responsive"],
    link: "#contact"
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Automatización de Flujos",
    date: "2025 — Optimización",
    description: "Configuración avanzada de flujos automáticos para más de 15 fuentes de información, logrando una reducción del 70% en tiempo de consumo y 40% de mejora en organización de datos.",
    tech: ["IFTTT", "Make", "Feedly", "RSSHub", "Zapier"],
    link: "#contact"
  }
];

// Variables globales
let currentSlide = 0;
const totalSlides = projects.length;

// Inicializa el slider cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  initSliderControls();
  initTouchNavigation();
  updateSlider();
});

// Renderiza todos los proyectos usando el template
function renderProjects() {
  const slidesContainer = document.getElementById('projectsSlides');
  const template = document.getElementById('projectSlideTemplate');

  if (!slidesContainer || !template) return;

  // Limpia el contenedor (por si acaso)
  slidesContainer.innerHTML = '';

  projects.forEach((project, index) => {
    const slide = template.content.cloneNode(true);
    
    // Llena los datos del slide
    const slideImage = slide.querySelector('.project-slide-image');
    slideImage.style.backgroundImage = `url('${project.image}')`;
    slideImage.setAttribute('alt', `Captura del proyecto: ${project.title}`);
    
    slide.querySelector('.project-slide-title').textContent = project.title;
    slide.querySelector('.project-slide-date').textContent = project.date;
    slide.querySelector('.project-slide-description').textContent = project.description;
    
    // MODIFICACIÓN PRINCIPAL: Configura el enlace para ir a contacto
    const projectLink = slide.querySelector('.project-slide-link');
    projectLink.href = project.link;
    projectLink.setAttribute('aria-label', `Contactar para más detalles sobre ${project.title}`);
    
    // Cambia el texto del enlace
    projectLink.querySelector('span').textContent = '¡Contáctame para saber más detalles!';
    
    // Añade evento click para cerrar modal y navegar a contacto
    projectLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Cierra el modal
      closeProjectsModal();
      
      // Espera a que se cierre el modal y luego navega
      setTimeout(() => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
          window.scrollTo({
            top: contactSection.offsetTop - 80,
            behavior: 'smooth'
          });
          
          // Añade un efecto visual al formulario de contacto
          const contactForm = document.querySelector('.contact-form');
          if (contactForm) {
            contactForm.style.animation = 'pulse 0.6s ease-in-out';
            contactForm.style.boxShadow = '0 0 30px rgba(14, 165, 233, 0.3)';
            
            // Remueve el efecto después de la animación
            setTimeout(() => {
              contactForm.style.animation = '';
              contactForm.style.boxShadow = '';
            }, 600);
          }
        }
      }, 300);
    });
    
    // Añade las tecnologías
    const techContainer = slide.querySelector('.project-slide-tech');
    project.tech.forEach(tech => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = tech;
      techContainer.appendChild(tag);
    });

    // Añade el slide al contenedor
    slidesContainer.appendChild(slide);
  });
}

// Configura los controles del slider
function initSliderControls() {
  // Indicadores (dots)
  const dotsContainer = document.querySelector('.slider-indicators');
  if (!dotsContainer) return;
  
  dotsContainer.innerHTML = ''; // Limpia dots existentes
  
  projects.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  // Inicializa navegación por barra de progreso
  initProgressBarNavigation();
  
  // Teclado
  document.addEventListener('keydown', handleKeyboardNavigation);
}

// Inicializa navegación por barra de progreso
function initProgressBarNavigation() {
  const progressBar = document.querySelector('.slider-progress-bar');
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const percentage = clickPosition / rect.width;
      const targetSlide = Math.floor(percentage * totalSlides);
      
      if (targetSlide >= 0 && targetSlide < totalSlides) {
        currentSlide = targetSlide;
        updateSlider();
      }
    });
  }
}

// Inicializa navegación táctil (swipe) para móviles
function initTouchNavigation() {
  const slidesContainer = document.getElementById('projectsSlides');
  if (!slidesContainer) return;
  
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  slidesContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  slidesContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  });

  slidesContainer.addEventListener('touchend', () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // mínimo de píxeles para considerar swipe
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        nextSlide();
      } else if (diff < 0 && currentSlide > 0) {
        previousSlide();
      }
    }
    
    isDragging = false;
  });
}

// Navegación con teclado
function handleKeyboardNavigation(e) {
  const modal = document.getElementById('projectsModal');
  if (!modal || !modal.classList.contains('active')) return;
  
  switch(e.key) {
    case 'ArrowRight': nextSlide(); break;
    case 'ArrowLeft': previousSlide(); break;
    case 'Escape': closeProjectsModal(); break;
  }
}

// Funciones del slider
function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlider();
  }
}

function previousSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlider();
  }
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateSlider();
}

// Actualiza la posición del slider y los controles
function updateSlider() {
  const slidesContainer = document.getElementById('projectsSlides');
  if (!slidesContainer) return;
  
  const translateX = -currentSlide * 100;
  slidesContainer.style.transform = `translateX(${translateX}%)`;
  
  // Actualiza dots
  document.querySelectorAll('.slider-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
  
  // Actualiza barra de progreso
  const progressBar = document.getElementById('sliderProgress');
  if (progressBar) {
    const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  }
}

// Funciones del modal
function openProjectsModal() {
  const modal = document.getElementById('projectsModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentSlide = 0; // Reset al abrir
    updateSlider();
  }
}

function closeProjectsModal() {
  const modal = document.getElementById('projectsModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Cerrar al hacer clic fuera del contenido
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('projectsModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeProjectsModal();
      }
    });
  }
});

/* PRUEBA */

// Timeline Functionality

// Filtros de timeline
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Función para filtrar elementos
    function filterTimeline(category) {
        timelineItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Event listeners para filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            btn.classList.add('active');
            
            // Filtrar timeline
            const category = btn.dataset.filter;
            filterTimeline(category);
        });
    });
});

// Datos detallados de proyectos
const projectDetails = {
    'automatizacion-2025': {
        title: 'Plataforma de Automatización Personal',
        content: `
            <div class="modal-section">
                <h3>🎯 Descripción General</h3>
                <p>Sistema integral diseñado para centralizar y automatizar la gestión de información de múltiples fuentes. La plataforma procesa automáticamente contenido de más de 15 fuentes diferentes y lo organiza en un flujo unificado.</p>
            </div>
            
            <div class="modal-section">
                <h3>🔧 Tecnologías Utilizadas</h3>
                <div class="tech-grid">
                    <div class="tech-item">
                        <strong>n8n:</strong> Flujos de automatización complejos
                    </div>
                    <div class="tech-item">
                        <strong>Make:</strong> Integraciones visuales entre servicios
                    </div>
                    <div class="tech-item">
                        <strong>IFTTT:</strong> Automatizaciones simples y triggers
                    </div>
                    <div class="tech-item">
                        <strong>RSSHub:</strong> Unificación de fuentes de contenido
                    </div>
                </div>
            </div>
            
            <div class="modal-section">
                <h3>📈 Logros Específicos</h3>
                <ul>
                    <li><strong>15+ fuentes</strong> centralizadas en un solo flujo</li>
                    <li><strong>60% reducción</strong> en tiempo de procesamiento manual</li>
                    <li><strong>Validación automática</strong> de estructura de datos</li>
                    <li><strong>Sistema de respaldo</strong> para APIs inconsistentes</li>
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>🧠 Principales Desafíos Superados</h3>
                <div class="challenge-item">
                    <strong>Problema:</strong> APIs con formatos inconsistentes<br>
                    <strong>Solución:</strong> Creé reglas de transformación y validación personalizadas que normalizan los datos antes del procesamiento.
                </div>
                <div class="challenge-item">
                    <strong>Problema:</strong> Fallos de conexión esporádicos<br>
                    <strong>Solución:</strong> Implementé sistemas de reintento automático y notificaciones de estado.
                </div>
            </div>
            
            <div class="modal-section">
                <h3>💡 Aprendizajes Clave</h3>
                <p>Este proyecto me enseñó la importancia de <strong>validar la estructura de datos</strong> antes de crear integraciones complejas. También desarrollé habilidades en manejo de errores y creación de flujos resilientes.</p>
            </div>
        `
    },
    
    'portafolio-2025': {
        title: 'Desarrollo de Portafolio Web Responsivo',
        content: `
            <div class="modal-section">
                <h3>🎯 Descripción General</h3>
                <p>Desarrollo completo de un sitio web personal optimizado para todos los dispositivos, con enfoque especial en experiencia móvil y velocidad de carga. El sitio está diseñado para destacar habilidades técnicas de manera visual e interactiva.</p>
            </div>
            
            <div class="modal-section">
                <h3>🔧 Stack Técnico</h3>
                <div class="tech-grid">
                    <div class="tech-item">
                        <strong>HTML5:</strong> Estructura semántica y accesible
                    </div>
                    <div class="tech-item">
                        <strong>CSS3:</strong> Diseño responsivo con Flexbox/Grid
                    </div>
                    <div class="tech-item">
                        <strong>JavaScript:</strong> Interactividad y animaciones
                    </div>
                    <div class="tech-item">
                        <strong>Responsive Design:</strong> Mobile-first approach
                    </div>
                </div>
            </div>
            
            <div class="modal-section">
                <h3>📱 Logros de Performance</h3>
                <ul>
                    <li><strong>95% compatibilidad móvil</strong> en pruebas cross-device</li>
                    <li><strong>Tiempo de carga < 2 segundos</strong> en conexiones estándar</li>
                    <li><strong>100% responsive</strong> desde 320px hasta 4K</li>
                    <li><strong>Optimización SEO</strong> con meta tags y estructura semántica</li>
                    <li><strong>Accesibilidad WCAG</strong> con navegación por teclado</li>
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>🧠 Desafíos Técnicos</h3>
                <div class="challenge-item">
                    <strong>Problema:</strong> Conflictos de CSS entre navegadores<br>
                    <strong>Solución:</strong> Implementé prefijos vendor y testing sistemático en Chrome, Firefox, Safari y Edge.
                </div>
                <div class="challenge-item">
                    <strong>Problema:</strong> Optimización de imágenes para móviles<br>
                    <strong>Solución:</strong> Uso de formatos WebP con fallbacks y lazy loading.
                </div>
            </div>
            
            <div class="modal-section">
                <h3>💡 Aprendizajes</h3>
                <p>El enfoque <strong>mobile-first</strong> simplifica enormemente el proceso de desarrollo. Diseñar primero para pantallas pequeñas y luego expandir es mucho más eficiente que el enfoque tradicional.</p>
            </div>
        `
    },
    
    'ia-2023-2024': {
        title: 'Inmersión en Inteligencia Artificial',
        content: `
            <div class="modal-section">
                <h3>🎯 Desarrollo Autodidacta</h3>
                <p>Proceso intensivo de aprendizaje en IA generativa, enfocado en aplicaciones prácticas para automatización y optimización de procesos. Me especialicé en prompt engineering estratégico e integración de IA con sistemas existentes.</p>
            </div>
            
            <div class="modal-section">
                <h3>🤖 Herramientas Dominadas</h3>
                <div class="tech-grid">
                    <div class="tech-item">
                        <strong>ChatGPT:</strong> Resolución de problemas complejos y code assistance
                    </div>
                    <div class="tech-item">
                        <strong>Claude:</strong> Análisis de documentos y razonamiento profundo
                    </div>
                    <div class="tech-item">
                        <strong>Gemini:</strong> Procesamiento multimodal y análisis visual
                    </div>
                    <div class="tech-item">
                        <strong>DeepSeek:</strong> Análisis técnico y optimización de código
                    </div>
                </div>
            </div>
            
            <div class="modal-section">
                <h3>🚀 Técnicas Desarrolladas</h3>
                <ul>
                    <li><strong>Chain-of-Thought Prompting:</strong> Para problemas complejos que requieren razonamiento paso a paso</li>
                    <li><strong>Few-Shot Learning:</strong> Optimización de respuestas con ejemplos específicos</li>
                    <li><strong>Template Systems:</strong> Prompts reutilizables para tareas recurrentes</li>
                    <li><strong>Context Management:</strong> Manejo eficiente de conversaciones largas</li>
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>📊 Impacto Cuantificable</h3>
                <div class="challenge-item">
                    <strong>Automatización mejorada:</strong> Integré IA en mis flujos, reduciendo 60% el tiempo de procesamiento de información compleja.
                </div>
                <div class="challenge-item">
                    <strong>Debugging acelerado:</strong> Uso de IA para análisis de errores redujo tiempo de resolución en 70%.
                </div>
            </div>
            
            <div class="modal-section">
                <h3>💡 Filosofía de Uso</h3>
                <p>La IA no reemplaza el pensamiento crítico, lo <strong>amplifica</strong>. Mi enfoque se centra en hacer las preguntas correctas y validar resultados, no en depender ciegamente de las respuestas.</p>
            </div>
        `
    },
    
    'bachiller-2019-2024': {
        title: 'Bachiller en Ciencias Sociales',
        content: `
            <div class="modal-section">
                <h3>🎓 Formación Académica</h3>
                <p>Educación secundaria especializada en Ciencias Sociales que desarrolló mi capacidad de <strong>análisis crítico</strong>, <strong>investigación metodológica</strong> y <strong>comunicación efectiva</strong>. Esta base humanística complementa perfectamente mis habilidades técnicas.</p>
            </div>
            
            <div class="modal-section">
                <h3>🧠 Competencias Desarrolladas</h3>
                <div class="tech-grid">
                    <div class="tech-item">
                        <strong>Análisis Crítico:</strong> Evaluación objetiva de información y fuentes
                    </div>
                    <div class="tech-item">
                        <strong>Metodología de Investigación:</strong> Procesos sistemáticos de indagación
                    </div>
                    <div class="tech-item">
                        <strong>Comunicación Escrita:</strong> Redacción clara y estructurada
                    </div>
                    <div class="tech-item">
                        <strong>Trabajo Colaborativo:</strong> Proyectos grupales y presentaciones
                    </div>
                </div>
            </div>
            
            <div class="modal-section">
                <h3>🔄 Transferencia a lo Técnico</h3>
                <ul>
                    <li><strong>Debugging:</strong> El pensamiento crítico me ayuda a analizar problemas de código sistemáticamente</li>
                    <li><strong>Documentación:</strong> Habilidades de redacción para crear guías técnicas claras</li>
                    <li><strong>Investigación:</strong> Capacidad de encontrar y evaluar recursos técnicos confiables</li>
                    <li><strong>Comunicación:</strong> Explicar conceptos técnicos de manera accesible</li>
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>💡 Aprendizaje Clave</h3>
                <p>Descubrí que las <strong>metodologías de análisis académico</strong> son perfectamente aplicables a la resolución de problemas técnicos. La misma estructura lógica funciona para debugging y arquitectura de sistemas.</p>
            </div>
        `
    },
    
    'web-autodidacta': {
        title: 'Desarrollo Web (Autodidacta)',
        content: `
            <div class="modal-section">
                <h3>🎯 Proceso de Aprendizaje</h3>
                <p>Aprendizaje autónomo y estructurado de desarrollo web moderno, enfocado en <strong>proyectos prácticos</strong> más que en teoría pura. Mi metodología combina documentación oficial, proyectos reales y experimentación constante.</p>
            </div>
            
            <div class="modal-section">
                <h3>📚 Fuentes de Aprendizaje</h3>
                <ul>
                    <li><strong>MDN Web Docs:</strong> Mi referencia principal para HTML, CSS y JavaScript</li>
                    <li><strong>Proyectos prácticos:</strong> Aprender construyendo sitios reales</li>
                    <li><strong>Comunidad dev:</strong> Stack Overflow, GitHub, y foros especializados</li>
                    <li><strong>Experimentación:</strong> Probar nuevas técnicas en proyectos personales</li>
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>🛠️ Stack Actual</h3>
                <div class="tech-grid">
                    <div class="tech-item">
                        <strong>HTML5:</strong> Estructura semántica, accesibilidad, SEO
                    </div>
                    <div class="tech-item">
                        <strong>CSS3:</strong> Flexbox, Grid, animaciones, responsive design
                    </div>
                    <div class="tech-item">
                        <strong>JavaScript:</strong> DOM manipulation, eventos, APIs básicas
                    </div>
                    <div class="tech-item">
                        <strong>Git:</strong> Control de versiones y colaboración
                    </div>
                </div>
            </div>
            
            <div class="modal-section">
                <h3>🎯 Próximos Objetivos</h3>
                <ul>
                    <li><strong>React:</strong> Desarrollo de aplicaciones interactivas</li>
                    <li><strong>Node.js:</strong> Backend básico y APIs</li>
                    <li><strong>Bases de datos:</strong> MongoDB y operaciones CRUD</li>
                    <li><strong>Deployment:</strong> Netlify, Vercel, y procesos CI/CD</li>
                </ul>
            </div>
        `
    },
    
    'automatizacion-autodidacta': {
        title: 'Automatización de Procesos (Autodidacta)',
        content: `
            <div class="modal-section">
                <h3>🤖 Mi Especialización Principal</h3>
                <p>Desarrollo autodidacta intensivo en herramientas no-code/low-code para automatización. Esta es el área donde más tiempo he invertido y donde me siento más cómodo resolviendo problemas complejos.</p>
            </div>
            
            <div class="modal-section">
                <h3>🛠️ Herramientas Dominadas</h3>
                <div class="tech-grid">
                    <div class="tech-item">
                        <strong>n8n:</strong> Mi herramienta favorita - flujos complejos y custom functions
                    </div>
                    <div class="tech-item">
                        <strong>Make:</strong> Integraciones visuales y procesos empresariales
                    </div>
                    <div class="tech-item">
                        <strong>IFTTT:</strong> Automatizaciones simples y triggers móviles
                    </div>
                    <div class="tech-item">
                        <strong>Zapier:</strong> Conectores empresariales y flujos de marketing
                    </div>
                </div>
            </div>
            
            <div class="modal-section">
                <h3>🏆 Casos de Uso Reales</h3>
                <ul>
                    <li><strong>Agregación de contenido:</strong> Sistema que consolida información de 15+ fuentes automáticamente</li>
                    <li><strong>Notificaciones inteligentes:</strong> Filtros personalizados que solo envían información relevante</li>
                    <li><strong>Procesamiento de datos:</strong> Transformación automática de formatos inconsistentes</li>
                    <li><strong>Backups automáticos:</strong> Respaldo de información crítica en múltiples ubicaciones</li>
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>💡 Mi Ventaja Competitiva</h3>
                <p>No solo sé usar estas herramientas - entiendo cómo <strong>combinarlas estratégicamente</strong> para crear sistemas robustos. Puedo identificar qué herramienta es mejor para cada parte de un flujo complejo.</p>
            </div>
        `
    },
    
    'denver-english': {
        title: 'Denver English Institute',
        content: `
            <div class="modal-section">
                <h3>🌍 Formación en Inglés Técnico</h3>
                <p>Curso enfocado en desarrollar <strong>comprensión lectora</strong> y habilidades de comunicación básica en inglés, con especial énfasis en mi capacidad para leer y entender documentación técnica sin traducir.</p>
            </div>
            
            <div class="modal-section">
                <h3>📖 Competencias Desarrolladas</h3>
                <div class="tech-grid">
                    <div class="tech-item">
                        <strong>Comprensión Lectora:</strong> Lectura fluida de documentación técnica
                    </div>
                    <div class="tech-item">
                        <strong>Vocabulario Técnico:</strong> Terminología específica de programación y tecnología
                    </div>
                    <div class="tech-item">
                        <strong>Comunicación Funcional:</strong> Intercambio básico en contextos profesionales
                    </div>
                </div>
            </div>
            
            <div class="modal-section">
                <h3>🎯 Aplicación Práctica</h3>
                <ul>
                    <li><strong>Documentación oficial:</strong> Leo docs de APIs, frameworks y herramientas directamente en inglés</li>
                    <li><strong>Recursos de aprendizaje:</strong> Acceso a tutoriales y cursos internacionales</li>
                    <li><strong>Troubleshooting:</strong> Búsqueda eficiente de soluciones en Stack Overflow y foros</li>
                    <li><strong>Actualización constante:</strong> Seguimiento de trends tecnológicos en fuentes originales</li>
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>📈 Evolución Continua</h3>
                <p>Aunque mi nivel conversacional es básico, mi <strong>comprensión técnica en inglés</strong> me permite acceder a recursos de primera fuente y mantenerme actualizado con las últimas tecnologías sin barreras de idioma.</p>
            </div>
        `
    }
};

// Función para abrir modal de proyecto
function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (projectDetails[projectId] && modal && modalTitle && modalContent) {
        modalTitle.textContent = projectDetails[projectId].title;
        modalContent.innerHTML = projectDetails[projectId].content;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }
}

// Función para cerrar modal
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaurar scroll del body
    }
}

// Cerrar modal al hacer clic fuera de él
document.addEventListener('click', function(e) {
    const modal = document.getElementById('projectModal');
    if (modal && e.target === modal) {
        closeProjectModal();
    }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// Funciones para botones de acción
function contactAboutProject(projectType) {
    const messages = {
        'automatizacion': 'Hola! Me interesa conocer más sobre tu experiencia en automatización de procesos. ¿Podrías contarme más detalles sobre tus proyectos?',
        'portafolio': 'Hola! Vi tu portafolio web y me impresiona el desarrollo responsivo. ¿Podrías mostrarme el proceso de desarrollo?',
        'ia-skills': 'Hola! Me interesa mucho tu experiencia con IA y prompt engineering. ¿Podrías contarme cómo aplicás estas habilidades?',
        'web-learning': 'Hola! Me llamó la atención tu proceso de aprendizaje autodidacta en desarrollo web. ¿Podrías compartir tu metodología?',
        'automatizacion-learning': 'Hola! Estoy muy interesado en tu expertise en automatización. ¿Podrías mostrarme algunos ejemplos prácticos?'
    };
    
    const message = messages[projectType] || 'Hola! Me interesa conocer más sobre tu experiencia. ¿Podrías contarme más detalles?';
    const emailSubject = 'Consulta sobre tu experiencia profesional';
    
    enviarCorreoInteligente('afink6042@gmail.com', emailSubject, message);
}

function requestDemo(demoType) {
    const messages = {
        'automatizacion': 'Hola! Me gustaría ver una demostración de tu plataforma de automatización. ¿Sería posible agendar una breve presentación?',
        'automatizacion-demo': 'Hola! Me interesa ver ejemplos concretos de tus automatizaciones. ¿Podrías mostrarme algunos casos de uso reales?'
    };
    
    const message = messages[demoType] || 'Hola! Me gustaría ver una demostración de tu trabajo. ¿Sería posible agendar una presentación?';
    const emailSubject = 'Solicitud de demostración';
    
    enviarCorreoInteligente('afink6042@gmail.com', emailSubject, message);
}

// Animación de entrada para elementos de timeline
function animateTimelineItems() {
    const items = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Inicializar animaciones cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    animateTimelineItems();
});

// Función para smooth scroll a timeline desde otros elementos
function scrollToTimeline() {
    const timeline = document.getElementById('timeline');
    if (timeline) {
        timeline.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

/* PRUEBA CORRECCIÓN */

// CORRECCIÓN PARA TIMELINE - AGREGAR AL FINAL DEL JS

// Mejorar la función de filtrado
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Función mejorada para filtrar elementos
    function filterTimeline(category) {
        timelineItems.forEach((item, index) => {
            const itemCategory = item.dataset.category;
            
            if (category === 'all' || itemCategory === category) {
                // Mostrar elemento
                item.classList.remove('hidden');
                
                // Animación escalonada
                setTimeout(() => {
                    if (!item.classList.contains('hidden')) {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }
                }, index * 100);
                
            } else {
                // Ocultar elemento inmediatamente
                item.style.opacity = '0';
                item.style.transform = 'translateX(-30px)';
                
                // Agregar clase hidden después de la animación
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 200);
            }
        });
    }

    // Event listeners mejorados para filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            btn.classList.add('active');
            
            // Obtener categoría y filtrar
            const category = btn.dataset.filter;
            filterTimeline(category);
        });
    });

    // Inicializar con todos los elementos visibles
    filterTimeline('all');
});

// Función adicional para forzar reflow si es necesario
function forceTimelineReflow() {
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        timeline.style.display = 'none';
        timeline.offsetHeight; // Forzar reflow
        timeline.style.display = '';
    }
}

// Observador para detectar problemas de renderizado
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const item = entry.target;
        if (entry.isIntersecting && !item.classList.contains('hidden')) {
            // Asegurar que elementos visibles estén correctamente mostrados
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: '50px'
});

// Aplicar observador a todos los elementos de timeline
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
});

// Función de limpieza para elementos problemáticos (ejecutar si persisten problemas)
function cleanupHiddenElements() {
    const hiddenItems = document.querySelectorAll('.timeline-item.hidden');
    hiddenItems.forEach(item => {
        item.style.cssText = `
            opacity: 0 !important;
            visibility: hidden !important;
            position: absolute !important;
            left: -9999px !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        `;
    });
}

// Función específica para el mailto del footer
function enviarCorreoFooter(event) {
    if (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto
    }
    
    // Datos predefinidos para el correo desde footer
    const destinatario = 'afink6042@gmail.com';
    const asunto = 'Contacto desde tu portafolio web';
    const cuerpo = `Hola Ariel,

Me puse en contacto contigo a través de tu portafolio web.

Me interesa conocer más sobre tus servicios de:
[ ] Automatización de procesos
[ ] Desarrollo web
[ ] Consultoría en IA

Por favor, contáctame cuando tengas disponibilidad.

Saludos cordiales.`;
    
    // Usar la función inteligente que ya tienes
    enviarCorreoInteligente(destinatario, asunto, cuerpo, false);
}