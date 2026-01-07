
document.addEventListener('DOMContentLoaded', function() {
  
    const sideLinks = document.querySelectorAll('.side-link');
    const sections = [
        { id: 'inicio', element: document.getElementById('inicio') },
        { id: 'tendencias', element: document.getElementById('tendencias') },
        { id: 'indicadores', element: document.getElementById('indicadores') },
        { id: 'noticias', element: document.getElementById('noticias') }
    ];
    
    let isScrolling = false;

    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            updateActiveNav(targetId);
        }
    }

    function updateActiveNav(activeId) {
        sideLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('active');
                
             
                link.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }

    function handleScroll() {
        if (isScrolling) return;
        
        isScrolling = true;
        const scrollPosition = window.scrollY + 150;
        
        let currentSection = 'inicio';
        sections.forEach(section => {
            if (section.element) {
                const sectionTop = section.element.offsetTop;
                const sectionHeight = section.element.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.id;
                }
            }
        });
        
        updateActiveNav(currentSection);
        
        setTimeout(() => {
            isScrolling = false;
        }, 100);
    }
    

    function initializeHoverEffects() {
        const cards = document.querySelectorAll('.highlight-card, .indicator-card, .news-card, .feature-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 12px 30px rgba(212, 175, 55, 0.15)';
                this.style.transition = 'all 0.3s ease';
                
    
                this.style.borderColor = 'var(--gold-primary)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
                this.style.borderColor = '';
            });
        });
    }

    function animateIndicators() {
        const indicatorValues = document.querySelectorAll('.indicator-card .indicator-value');
        
        indicatorValues.forEach((value, index) => {
            const finalText = value.textContent;
            const finalValue = parseFloat(finalText);
            
            if (!isNaN(finalValue)) {
                let currentValue = 0;
                const increment = finalValue / 30;
                const duration = 1500;
                const stepTime = duration / 30;
                
          
                value.textContent = '0.0%';
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        value.textContent = finalText;
                        clearInterval(timer);
                    } else {
                        value.textContent = currentValue.toFixed(1) + '%';
                    }
                }, stepTime);
            }
        });
    }
    

    function initializeEventListeners() {
    
        sideLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                smoothScrollTo(targetId);
            });
        });
        
  
        window.addEventListener('scroll', handleScroll);
    }
    

    function initializeInteractiveComponents() {
  
        const economicData = document.querySelectorAll('.indicator-value');
        economicData.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.title = 'Valor actualizado en tiempo real';
            });
        });
        
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        
        const animatedElements = document.querySelectorAll('.feature-card, .highlight-card, .indicator-card, .news-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    

    function init() {
        initializeEventListeners();
        initializeHoverEffects();
        initializeInteractiveComponents();
        
        
        setTimeout(() => {
            animateIndicators();
        }, 800);
        
     
        updateActiveNav('inicio');
       
        console.log('🚀 Portal Económico Premium cargado correctamente');
        console.log('✨ Efectos visuales básicos activados');
        console.log('📊 Sistema de navegación inteligente funcionando');
        console.log('🎯 Animaciones simplificadas para mejor rendimiento');
    }

    init();
});