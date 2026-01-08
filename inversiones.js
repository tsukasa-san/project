document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const sideLinks = document.querySelectorAll('.side-link');
    const controlBtns = document.querySelectorAll('.control-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const calculateCompoundBtns = document.querySelectorAll('.calculate-btn');
    const applyRebalanceBtn = document.getElementById('apply-rebalance');
    
    // Inicialización
    function init() {
        console.log('🚀 Página de Inversiones cargada correctamente');
        
        // Verificar que el CSS está cargado
        if (!document.querySelector('link[href="inversiones.css"]')) {
            console.warn('⚠️ CSS no encontrado en head, cargando dinámicamente...');
            loadCSS();
        }
        
        initNavigation();
        initDashboardControls();
        initStrategyTabs();
        initCalculators();
        initRebalancingSimulator();
        initInteractivity();
        initScrollNavigation();
        
        updateActiveSection();
        addDynamicStyles();
    }
    
    function loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'inversiones.css';
        document.head.appendChild(link);
        console.log('📦 CSS cargado dinámicamente');
    }
    
    // FUNCIÓN CORREGIDA: Menú izquierdo funcional
    function initNavigation() {
        sideLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                
                // Remover clase active de todos los enlaces
                sideLinks.forEach(l => l.classList.remove('active'));
                
                // Agregar clase active al enlace clickeado
                this.classList.add('active');
                
                // Animar el clic
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
                // Navegar a la sección correspondiente
                navigateToSection(targetId);
            });
        });
        
        // Manejar navegación por hash en URL
        window.addEventListener('hashchange', function() {
            const hash = window.location.hash.substring(1);
            if (hash) {
                updateActiveNav(hash);
            }
        });
    }
    
    function navigateToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) return;
        
        // Remover clase active de todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Agregar clase active a la sección destino
        targetSection.classList.add('active');
        
        // Actualizar URL con hash
        window.location.hash = sectionId;
        
        // Desplazamiento suave
        const offset = 100;
        const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Actualizar navegación activa
        updateActiveNav(sectionId);
    }
    
    function updateActiveNav(activeId) {
        sideLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('active');
                
                // Efecto visual
                link.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }
    
    // Navegación automática por scroll
    function initScrollNavigation() {
        let isScrolling = false;
        
        function handleScroll() {
            if (isScrolling) return;
            
            isScrolling = true;
            const scrollPosition = window.scrollY + 100;
            
            const sections = [
                { id: 'dashboard', element: document.getElementById('dashboard') },
                { id: 'portafolio', element: document.getElementById('portafolio') },
                { id: 'estrategias', element: document.getElementById('estrategias') },
                { id: 'herramientas', element: document.getElementById('herramientas') },
                { id: 'analisis', element: document.getElementById('analisis') }
            ];
            
            let currentSection = 'dashboard';
            
            // Verificar qué sección está visible
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
        
        window.addEventListener('scroll', handleScroll);
    }
    
    // Control del dashboard
    function initDashboardControls() {
        controlBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                controlBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Efecto de clic
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
                const period = this.dataset.period;
                updateDashboardData(period);
            });
        });
    }
    
    function updateDashboardData(period) {
        console.log(`Actualizando datos para periodo: ${period}`);
        
        // Efecto visual de actualización
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            card.classList.add('updating');
            setTimeout(() => {
                card.classList.remove('updating');
            }, 500);
        });
        
        // Datos por periodo
        const updates = getDashboardDataUpdates(period);
        
        // Actualizar cada métrica
        Object.keys(updates).forEach(label => {
            updateMetric(label, updates[label].value, updates[label].change, updates[label].trend);
        });
    }
    
    function getDashboardDataUpdates(period) {
        const data = {
            week: {
                'Capitalización Global de Mercados': { value: '$88.5T', change: '+0.8%', trend: 'positive' },
                'Retorno Promedio Sector Tech': { value: '3.2%', change: '+0.5%', trend: 'positive' },
                'Volatilidad Mercados Emergentes': { value: '16.8%', change: '+1.2%', trend: 'negative' },
                'Yield Dividendo Global': { value: '1.2%', change: '+0.1%', trend: 'positive' }
            },
            month: {
                'Capitalización Global de Mercados': { value: '$89.2T', change: '+3.2%', trend: 'positive' },
                'Retorno Promedio Sector Tech': { value: '12.4%', change: '+15.8%', trend: 'positive' },
                'Volatilidad Mercados Emergentes': { value: '18.3%', change: '-2.1%', trend: 'negative' },
                'Yield Dividendo Global': { value: '4.8%', change: '+5.2%', trend: 'positive' }
            },
            quarter: {
                'Capitalización Global de Mercados': { value: '$90.1T', change: '+8.5%', trend: 'positive' },
                'Retorno Promedio Sector Tech': { value: '18.7%', change: '+22.3%', trend: 'positive' },
                'Volatilidad Mercados Emergentes': { value: '15.2%', change: '-5.8%', trend: 'negative' },
                'Yield Dividendo Global': { value: '5.1%', change: '+8.7%', trend: 'positive' }
            },
            year: {
                'Capitalización Global de Mercados': { value: '$92.8T', change: '+15.2%', trend: 'positive' },
                'Retorno Promedio Sector Tech': { value: '22.3%', change: '+35.8%', trend: 'positive' },
                'Volatilidad Mercados Emergentes': { value: '18.3%', change: '+2.5%', trend: 'negative' },
                'Yield Dividendo Global': { value: '4.8%', change: '+8.7%', trend: 'positive' }
            }
        };
        
        return data[period] || data.month;
    }
    
    function updateMetric(label, value, change, trend) {
        const metricCards = document.querySelectorAll('.metric-card');
        
        metricCards.forEach(card => {
            const metricLabel = card.querySelector('.metric-label');
            if (metricLabel && metricLabel.textContent.includes(label)) {
                const metricValue = card.querySelector('.metric-value');
                const metricTrend = card.querySelector('.metric-trend');
                
                if (metricValue) {
                    metricValue.textContent = value;
                    metricValue.classList.add('value-changing');
                    setTimeout(() => {
                        metricValue.classList.remove('value-changing');
                    }, 500);
                }
                
                if (metricTrend) {
                    metricTrend.textContent = change;
                    metricTrend.className = 'metric-trend';
                    metricTrend.classList.add(trend);
                }
            }
        });
    }
    
    // Tabs de estrategias
    function initStrategyTabs() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Remover active de todos los botones
                tabBtns.forEach(b => b.classList.remove('active'));
                
                // Agregar active al botón clickeado
                this.classList.add('active');
                
                // Efecto de clic
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
                // Mostrar contenido correspondiente
                showTabContent(tabId);
            });
        });
    }
    
    function showTabContent(tabId) {
        // Ocultar todos los contenidos
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Mostrar contenido seleccionado
        const targetContent = document.getElementById(`${tabId}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
            
            // Si es la pestaña de interés compuesto, calcular valores iniciales
            if (tabId === 'compound') {
                setTimeout(() => {
                    calculateCompoundInterest('compound');
                }, 100);
            }
        }
    }
    
    // Calculadoras
    function initCalculators() {
        // Calculadora principal de interés compuesto
        const compoundBtn = document.getElementById('calculate-compound');
        if (compoundBtn) {
            compoundBtn.addEventListener('click', function() {
                calculateCompoundInterest('compound');
            });
        }
        
        // Calculadora de herramientas
        const toolCompoundBtn = document.getElementById('tool-calculate-compound');
        if (toolCompoundBtn) {
            toolCompoundBtn.addEventListener('click', function() {
                calculateCompoundInterest('tool');
            });
        }
        
        // Calcular valores iniciales
        calculateCompoundInterest('compound');
        calculateCompoundInterest('tool');
    }
    
    function calculateCompoundInterest(type) {
        const prefix = type === 'compound' ? '' : 'tool-';
        
        const initial = parseFloat(document.getElementById(`${prefix}initial-investment`)?.value) || 0;
        const monthly = parseFloat(document.getElementById(`${prefix}monthly-contribution`)?.value) || 0;
        const rate = parseFloat(document.getElementById(`${prefix}annual-rate`)?.value) || 0;
        const years = parseFloat(document.getElementById(`${prefix}years`)?.value) || 0;
        
        // Calcular interés compuesto mensual
        const monthlyRate = rate / 100 / 12;
        const months = years * 12;
        
        // Valor futuro de la inversión inicial
        let futureValue = initial * Math.pow(1 + monthlyRate, months);
        
        // Valor futuro de aportaciones mensuales
        if (monthly > 0) {
            futureValue += monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        }
        
        // Formatear resultado
        const formattedValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(futureValue.toFixed(0));
        
        const resultElement = document.getElementById(`${prefix}compound-result`);
        if (resultElement) {
            resultElement.textContent = formattedValue;
            resultElement.classList.add('value-changing');
            setTimeout(() => {
                resultElement.classList.remove('value-changing');
            }, 500);
        }
        
        // Para la calculadora principal, mostrar detalles adicionales
        if (type === 'compound') {
            const totalContributed = initial + (monthly * 12 * years);
            const interestEarned = futureValue - totalContributed;
            const returnPercentage = ((futureValue - totalContributed) / totalContributed * 100).toFixed(1);
            
            const detailsContainer = document.querySelector('#compound-result').closest('.result-display').querySelector('.result-details');
            if (detailsContainer) {
                detailsContainer.innerHTML = `
                    <p><strong>Total Aportado:</strong> $${totalContributed.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                    <p><strong>Intereses Generados:</strong> $${interestEarned.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                    <p><strong>Retorno Total:</strong> +${returnPercentage}%</p>
                `;
            }
        }
    }
    
    // Simulador de rebalanceo
    function initRebalancingSimulator() {
        const budgetInput = document.getElementById('rebalance-budget');
        
        if (budgetInput) {
            budgetInput.addEventListener('input', calculateRebalancing);
        }
        
        if (applyRebalanceBtn) {
            applyRebalanceBtn.addEventListener('click', function() {
                const budget = parseFloat(document.getElementById('rebalance-budget').value) || 0;
                if (budget > 0) {
                    showRebalanceConfirmation(budget);
                } else {
                    showTempMessage('Por favor ingresa un presupuesto válido para el rebalanceo', 'warning');
                }
            });
        }
        
        // Calcular valores iniciales
        calculateRebalancing();
    }
    
    function calculateRebalancing() {
        const budgetInput = document.getElementById('rebalance-budget');
        if (!budgetInput) return;
        
        const budget = parseFloat(budgetInput.value) || 0;
        
        // Calcular ajustes (ejemplo simplificado)
        const stocksAdjustment = budget * -0.085; 
        const bondsAdjustment = budget * 0.085;   
        
        // Actualizar UI
        const stocksElement = document.getElementById('stocks-to-adjust');
        const bondsElement = document.getElementById('bonds-to-buy');
        
        if (stocksElement) {
            stocksElement.textContent = `$${stocksAdjustment.toLocaleString()}`;
            stocksElement.className = stocksAdjustment < 0 ? 'negative' : 'positive';
        }
        if (bondsElement) {
            bondsElement.textContent = `+$${bondsAdjustment.toLocaleString()}`;
            bondsElement.className = 'positive';
        }
    }
    
    function showRebalanceConfirmation(budget) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3 style="color: var(--gold-primary); margin-bottom: 1rem;">✅ Rebalanceo Simulado</h3>
                <p>El rebalanceo se ha aplicado exitosamente con un presupuesto de <strong>$${budget.toLocaleString()}</strong>.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--medium-gray);">
                    Esta es una simulación. En un entorno real, se ejecutarían las órdenes de compra y venta correspondientes.
                </p>
                <div class="form-actions" style="margin-top: 2rem;">
                    <button class="calculate-btn" id="confirm-rebalance">Aceptar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        const closeBtn = modal.querySelector('.close-modal');
        const confirmBtn = modal.querySelector('#confirm-rebalance');
        
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        confirmBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
                showTempMessage('Rebalanceo aplicado exitosamente', 'success');
            }, 300);
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
    }
    
    // Interactividad general
    function initInteractivity() {
        // Efectos hover para tarjetas
        const cards = document.querySelectorAll('.metric-card, .sector-card, .diversification-card, .tool-card, .technical-card, .strategy-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.15)';
                this.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });
        
        // Animaciones al hacer scroll
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
        
        const animatedElements = document.querySelectorAll('.metric-card, .sector-card, .diversification-card, .tool-card, .technical-card, .strategy-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Inputs con validación
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', function() {
                const value = parseFloat(this.value);
                if (value < 0) {
                    this.value = Math.abs(value);
                }
            });
        });
    }
    
    function updateActiveSection() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetSection = document.getElementById(hash);
            if (targetSection) {
                updateActiveNav(hash);
                
                // Mostrar sección activa
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                targetSection.classList.add('active');
            }
        } else {
            updateActiveNav('dashboard');
        }
    }
    
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Modal overlay */
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            
            .modal-overlay.active {
                opacity: 1;
                pointer-events: all;
            }
            
            .modal-content {
                background: var(--white);
                padding: 2rem;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: translateY(20px);
                transition: transform 0.3s ease;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                border: 2px solid var(--gold-primary);
            }
            
            .modal-overlay.active .modal-content {
                transform: translateY(0);
            }
            
            .close-modal {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--medium-gray);
                cursor: pointer;
                padding: 0.5rem;
                line-height: 1;
            }
            
            .close-modal:hover {
                color: var(--negative);
            }
            
            /* Mensajes temporales */
            .temp-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--premium-bg);
                color: var(--white);
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                border: 1px solid var(--gold-primary);
                z-index: 2000;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
                font-size: 0.9rem;
            }
            
            .temp-message.success {
                background: linear-gradient(135deg, var(--positive), #2ecc71);
                border-color: var(--positive);
            }
            
            .temp-message.warning {
                background: linear-gradient(135deg, var(--warning), #e67e22);
                border-color: var(--warning);
            }
            
            .temp-message.error {
                background: linear-gradient(135deg, var(--negative), #c0392b);
                border-color: var(--negative);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            /* Tooltips */
            .metric-value {
                position: relative;
                cursor: help;
            }
            
            .metric-value:hover::after {
                content: 'Haz clic en los botones del periodo para actualizar';
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: var(--premium-bg);
                color: var(--white);
                padding: 0.8rem 1rem;
                border-radius: 8px;
                font-size: 0.8rem;
                white-space: nowrap;
                margin-bottom: 0.5rem;
                z-index: 100;
                border: 1px solid var(--gold-primary);
            }
        `;
        document.head.appendChild(style);
    }
    
    function showTempMessage(message, type = 'info', duration = 3000) {
        const messageEl = document.createElement('div');
        messageEl.className = `temp-message ${type}`;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, duration);
    }
    
    // Inicializar aplicación
    init();
    
    // Hacer funciones disponibles globalmente
    window.showTempMessage = showTempMessage;
});