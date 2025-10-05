// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation clicks
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                });
            }
        });
    });

    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const service = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
            // Create WhatsApp message
            const whatsappMessage = `Hola! Mi nombre es ${name}.
            
📧 Email: ${email}
📱 Teléfono: ${phone}
🩺 Servicio de interés: ${service}
💬 Mensaje: ${message}
            
Me gustaría obtener más información sobre sus servicios de lipólisis a domicilio.`;
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/+573102719284?text=${encodedMessage}`;
            
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Show success message
            alert('Redirigiendo a WhatsApp para enviar tu consulta...');
            
            // Reset form
            this.reset();
        });
    }

    // Header scroll effect
    //const header = document.querySelector('.header');
    //let lastScrollTop = 0;
    
    //window.addEventListener('scroll', function() {
    //    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
    //    if (scrollTop > 100) {
    //        header.style.background = 'rgba(102, 126, 234, 0.95)';
    //       header.style.backdropFilter = 'blur(10px)';
    //   } else {
    //       header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    //        header.style.backdropFilter = 'none';
    //    }
        
    //    lastScrollTop = scrollTop;
    //});

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards and result cards
    const animatedElements = document.querySelectorAll('.service-card, .result-card, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // WhatsApp floating button click tracking
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', function() {
            // Track click (could be connected to analytics)
            console.log('WhatsApp floating button clicked');
        });
    }

    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add loading state to buttons
    const whatsappButtons = document.querySelectorAll('[href*="wa.me"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fab fa-whatsapp"></i> Abriendo WhatsApp...';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.opacity = '1';
            }, 2000);
        });
    });
});

// Utility function to format phone numbers
function formatPhoneNumber(phone) {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add Colombia country code if not present
    if (cleaned.length === 10 && !cleaned.startsWith('57')) {
        return '57' + cleaned;
    }
    
    return cleaned;
}

const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    const inputs = this.querySelectorAll("input, textarea");
    const success = document.querySelector(".form-feedback.success");
    const error = document.querySelector(".form-feedback.error");

    inputs.forEach(input => {
    const errorMsg = input.nextElementSibling;

    // El campo "mensaje" es opcional, pero si se escribe algo, debe tener al menos 10 caracteres
    if (input.id === "mensaje" && input.value.trim() === "") {
        input.classList.remove("invalid");
        if (errorMsg) errorMsg.style.display = "none";
        return;
    }

    if (!input.checkValidity()) {
        input.classList.add("invalid");
        if (errorMsg) errorMsg.style.display = "block";
        isValid = false;
    } else {
        input.classList.remove("invalid");
        if (errorMsg) errorMsg.style.display = "none";
    }
    });

    if (isValid) {
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim() || "(sin mensaje)";

    const phoneNumber = "573102719284"; // 👈 CAMBIA este número por el tuyo
    const text = `Hola, soy ${nombre}.%0A📧 Correo: ${correo}%0A📱 Teléfono: ${telefono}%0A💬 Mensaje: ${mensaje}`;
    const url = `https://wa.me/${phoneNumber}?text=${text}`;

    success.style.display = "block";
    error.style.display = "none";

    // pequeña pausa visual antes de redirigir
    setTimeout(() => {
        window.open(url, "_blank");
        form.reset();
        success.style.display = "none";
    }, 80);
    } else {
    success.style.display = "none";
    error.style.display = "block";
    }
});

// WhatsApp link generator
function generateWhatsAppLink(phone, message) {
    const formattedPhone = formatPhoneNumber(phone);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/+${formattedPhone}?text=${encodedMessage}`;
}