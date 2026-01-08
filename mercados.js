document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const sideLinks = document.querySelectorAll('.side-link');
    const controlBtns = document.querySelectorAll('.control-btn');
    
    // Inicialización
    function init() {
        console.log('🚀 Página de Mercados México cargada correctamente');
        
        // Verificar que el CSS está cargado
        if (!document.querySelector('link[href="mercados.css"]')) {
            console.warn('⚠️ CSS no encontrado en head, cargando dinámicamente...');
            loadCSS();
        }
        
    
        initNavigation();
        
   
        initDashboardControls();
        
    
        initInteractivity();
       
        initRealTimeData();
        
        initBondFeatures();
        initDerivativesFeatures();
        
        updateActiveSection();
        
        addDynamicStyles();
    }
  
    function loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'mercados.css';
        document.head.appendChild(link);
        console.log('📦 CSS cargado dinámicamente');
    }
    
    function initNavigation() {
 
        sideLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                
                sideLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                smoothScrollTo(targetId);
                
                window.location.hash = targetId;
            });
        });
        
        let isScrolling = false;
        
        function handleScroll() {
            if (isScrolling) return;
            
            isScrolling = true;
            const scrollPosition = window.scrollY + 150;
            
            const sections = [
                { id: 'dashboard', element: document.getElementById('dashboard') },
                { id: 'principales', element: document.getElementById('principales') },
                { id: 'divisas', element: document.getElementById('divisas') },
                { id: 'commodities', element: document.getElementById('commodities') },
                { id: 'bonos', element: document.getElementById('bonos') },
                { id: 'futuros', element: document.getElementById('futuros') }
            ];
            
            let currentSection = 'dashboard';
            
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
    function initDashboardControls() {
        controlBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                controlBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
                const period = this.dataset.period;
                updateMarketData(period);
            });
        });
    }
    
    function updateMarketData(period) {
        console.log(`Actualizando datos para periodo: ${period}`);
        
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            card.classList.add('updating');
            setTimeout(() => {
                card.classList.remove('updating');
            }, 500);
        });
        
        const updates = getMarketDataUpdates(period);
        
        Object.keys(updates).forEach(label => {
            updateMetric(label, updates[label].value, updates[label].change, updates[label].trend);
        });
    }
    
    function getMarketDataUpdates(period) {
        const data = {
            day: {
                'S&P 500': { value: '5,615.75', change: '+0.2%', trend: 'positive' },
                'NASDAQ': { value: '18,280.45', change: '+0.5%', trend: 'positive' },
                'EUR/USD': { value: '1.0715', change: '-0.1%', trend: 'negative' },
                'Petróleo Brent': { value: '$92.80', change: '+0.7%', trend: 'positive' }
            },
            week: {
                'S&P 500': { value: '5,602.45', change: '+1.8%', trend: 'positive' },
                'NASDAQ': { value: '18,245.67', change: '+2.3%', trend: 'positive' },
                'EUR/USD': { value: '1.0720', change: '-0.6%', trend: 'negative' },
                'Petróleo Brent': { value: '$92.15', change: '+3.2%', trend: 'positive' }
            },
            month: {
                'S&P 500': { value: '5,580.30', change: '+3.5%', trend: 'positive' },
                'NASDAQ': { value: '18,120.85', change: '+4.8%', trend: 'positive' },
                'EUR/USD': { value: '1.0745', change: '-1.2%', trend: 'negative' },
                'Petróleo Brent': { value: '$90.45', change: '+5.8%', trend: 'positive' }
            },
            quarter: {
                'S&P 500': { value: '5,825.60', change: '+8.5%', trend: 'positive' },
                'NASDAQ': { value: '18,450.30', change: '+12.3%', trend: 'positive' },
                'EUR/USD': { value: '1.0650', change: '-2.8%', trend: 'negative' },
                'Petróleo Brent': { value: '$94.25', change: '+15.2%', trend: 'positive' }
            }
        };
        
        return data[period] || data.week;
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
    
    function initInteractivity() {
       
        const cards = document.querySelectorAll('.metric-card, .region-card, .forex-card, .commodity-card, .bond-card, .future-card, .option-card');
        
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
            
            card.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
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
        
        const animatedElements = document.querySelectorAll('.metric-card, .region-card, .forex-card, .commodity-card, .bond-card, .future-card, .option-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        const navLinks = document.querySelectorAll('.top-nav a, .side-link');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    function initBondFeatures() {

        const bondYields = document.querySelectorAll('.bond-yield');
        
        bondYields.forEach(yieldElement => {
            yieldElement.addEventListener('click', function() {
                
                this.classList.add('value-changing');
                setTimeout(() => {
                    this.classList.remove('value-changing');
                }, 500);
                
                
                const bondCard = this.closest('.bond-card');
                const bondType = bondCard.querySelector('.bond-type').textContent;
                const bondYield = this.textContent;
                
                console.log(`📊 Bono seleccionado: ${bondType} - Rendimiento: ${bondYield}`);
                
             
                bondCard.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    bondCard.style.animation = '';
                }, 500);
            });
        });
        
        const curvePoints = document.querySelectorAll('.curve-point');
        curvePoints.forEach(point => {
            point.addEventListener('mouseenter', function() {
               
                this.style.transform = 'translate(-50%, 50%) scale(1.3)';
                this.style.backgroundColor = 'var(--gold-secondary)';
                this.style.color = 'var(--white)';
                this.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.5)';
                
                const plazo = this.textContent;
                const rendimiento = getRendimientoByPlazo(plazo);
                showCurveTooltip(this, plazo, rendimiento);
            });
            
            point.addEventListener('mouseleave', function() {
               
                this.style.transform = 'translate(-50%, 50%) scale(1)';
                this.style.backgroundColor = 'var(--gold-primary)';
                this.style.color = '';
                this.style.boxShadow = '';
                
                hideCurveTooltip();
            });
            
            point.addEventListener('click', function() {
                const plazo = this.textContent;
                const rendimiento = getRendimientoByPlazo(plazo);
                
                console.log(`📈 Plazo: ${plazo} - Rendimiento: ${rendimiento}`);
                
                this.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
            });
        });
        
        const comparisonItems = document.querySelectorAll('.comparison-item');
        comparisonItems.forEach(item => {
            item.addEventListener('click', function() {
                
                comparisonItems.forEach(i => i.classList.remove('selected'));
                
                this.classList.add('selected');
                
             
                const country = this.querySelector('.country-name').textContent;
                const yieldValue = this.querySelector('.yield-value').textContent;
                const premium = this.querySelector('.risk-premium').textContent;
                
                console.log(`🌍 País seleccionado: ${country} - Rendimiento: ${yieldValue} - Prima: ${premium}`);
              
                this.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
            });
        });
    }
    
  
    function getRendimientoByPlazo(plazo) {
        const rendimientos = {
            '1m': '11.05%',
            '3m': '10.95%',
            '6m': '10.85%',
            '1y': '10.85%',
            '3y': '10.45%',
            '10y': '10.20%'
        };
        return rendimientos[plazo] || 'N/A';
    }
    
    
    function showCurveTooltip(element, plazo, rendimiento) {
        
        let tooltip = document.getElementById('curve-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'curve-tooltip';
            tooltip.className = 'curve-tooltip';
            document.querySelector('.curve-graphic').appendChild(tooltip);
        }
        
        
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.getBoundingClientRect();
        
        tooltip.style.left = rect.left - parentRect.left + 'px';
        tooltip.style.top = rect.top - parentRect.top - 50 + 'px';
        tooltip.innerHTML = `<strong>${plazo}</strong><br>${rendimiento}`;
        tooltip.style.display = 'block';
        tooltip.style.opacity = '1';
    }
    
    function hideCurveTooltip() {
        const tooltip = document.getElementById('curve-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 300);
        }
    }
    
   
    function initDerivativesFeatures() {
        
        const futurePrices = document.querySelectorAll('.future-price');
        
        futurePrices.forEach(priceElement => {
            priceElement.addEventListener('click', function() {
            
                this.classList.add('value-changing');
                setTimeout(() => {
                    this.classList.remove('value-changing');
                }, 500);
                
                const futureCard = this.closest('.future-card');
                const futureName = futureCard.querySelector('.future-name').textContent;
                const price = this.textContent;
                
                console.log(`⏰ Futuro seleccionado: ${futureName} - Precio: ${price}`);
                
                const contractValue = calculateContractValue(futureName, price);
                console.log(`💰 Valor del contrato: ${contractValue}`);
                
                futureCard.style.animation = 'futureGlow 0.8s ease';
                setTimeout(() => {
                    futureCard.style.animation = '';
                }, 800);
            });
        });
        
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            card.addEventListener('click', function() {
               
                this.style.animation = 'optionPulse 0.5s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
                
            
                const symbol = this.querySelector('.option-symbol').textContent;
                const type = this.querySelector('.option-type').textContent;
                const strike = this.querySelector('.option-strike-price')?.textContent || 'N/A';
                const premium = this.querySelector('.option-price').textContent;
                
                console.log(`🎯 Opción seleccionada: ${symbol} ${type} Strike: ${strike} Prima: ${premium}`);
                
            
                showOptionGreeks(symbol, type);
            });
        });
        
        const vimexValue = document.querySelector('.vimex-value');
        if (vimexValue) {
            vimex.addEventListener('click', function() {
                this.classList.add('value-changing');
                setTimeout(() => {
                    this.classList.remove('value-changing');
                }, 500);
                
                console.log('📉 VIMEX seleccionado - Mostrando análisis de volatilidad');
                
              
                showVolatilityHistory();
            });
        }
        

        const calendarMonths = document.querySelectorAll('.calendar-month');
        calendarMonths.forEach(month => {
            month.addEventListener('click', function() {
              
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
                
                const monthName = this.querySelector('h5').textContent;
                console.log(`📅 Mes seleccionado: ${monthName} - Mostrando eventos`);
                
            
                const events = this.querySelectorAll('p');
                events.forEach(event => {
                    event.style.color = 'var(--gold-primary)';
                    setTimeout(() => {
                        event.style.color = '';
                    }, 1000);
                });
            });
        });
    }
    
  
    function calculateContractValue(futureName, price) {
        let multiplier = 1;
        let contractSize = 1;
        let currency = 'MXN';
        
        if (futureName.includes('IPC')) {
            if (futureName.includes('Mini')) {
                multiplier = 1;
            } else {
                multiplier = 10;
            }
            contractSize = parseFloat(price.replace(',', ''));
        } else if (futureName.includes('USD/MXN')) {
            contractSize = 500000; 
            multiplier = parseFloat(price);
        } else if (futureName.includes('EUR/MXN')) {
            contractSize = 100000; 
            multiplier = parseFloat(price);
        } else if (futureName.includes('TIIE')) {
            contractSize = 1000000; 
            multiplier = 1;
        }
        
        const contractValue = contractSize * multiplier;
        
   
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(contractValue);
    }
    

    function showOptionGreeks(symbol, type) {
        const greeks = {
            'Delta': type.includes('CALL') ? '0.65' : '-0.45',
            'Gamma': '0.08',
            'Vega': '0.15',
            'Theta': type.includes('CALL') ? '-0.05' : '-0.04',
            'Rho': '0.03'
        };
        
        console.log(`📊 Greeks para ${symbol} ${type}:`, greeks);
    }
    
    function showVolatilityHistory() {
        const historicalData = [
            { month: 'Ene', value: 28.5 },
            { month: 'Feb', value: 25.8 },
            { month: 'Mar', value: 32.2 },
            { month: 'Abr', value: 29.7 },
            { month: 'May', value: 26.4 },
            { month: 'Jun', value: 24.8 },
            { month: 'Jul', value: 23.5 },
            { month: 'Ago', value: 25.2 },
            { month: 'Sep', value: 27.8 },
            { month: 'Oct', value: 30.1 },
            { month: 'Nov', value: 28.4 },
            { month: 'Dic', value: 22.5 }
        ];
        
        console.log('📈 Histórico VIMEX 2025:', historicalData);
    }
    

    function initRealTimeData() {
        
        setInterval(() => {
            updateBondData();
        }, 10000);
        
        
        setInterval(() => {
            updateDerivativesData();
        }, 8000);
        
     
        setInterval(() => {
            updateLiveIndicators();
        }, 5000);
        
 
        setInterval(() => {
            updateRandomPrices();
        }, 3000);
    }
    

    function updateBondData() {
        const bondElements = document.querySelectorAll('.bond-yield, .bond-change');
        
        bondElements.forEach(element => {
           
            if (Math.random() > 0.7) {
                element.classList.add('value-changing');
                setTimeout(() => {
                    element.classList.remove('value-changing');
                }, 1000);
            }
        });
    }
    
    function updateDerivativesData() {
        const futureElements = document.querySelectorAll('.future-price, .future-change');
        const optionElements = document.querySelectorAll('.option-price, .option-change');
        
        [...futureElements, ...optionElements].forEach(element => {
            
            if (Math.random() > 0.75) {
                element.classList.add('value-changing');
                setTimeout(() => {
                    element.classList.remove('value-changing');
                }, 1000);
            }
        });
    }
    
  
    function updateLiveIndicators() {
        const liveIndicators = document.querySelectorAll('.live-indicator');
        
        liveIndicators.forEach(indicator => {
          
            if (Math.random() > 0.6) {
                indicator.classList.add('value-changing');
                setTimeout(() => {
                    indicator.classList.remove('value-changing');
                }, 800);
            }
        });
    }
    
    
    function updateRandomPrices() {
        const priceElements = document.querySelectorAll('.indicator-value, .forex-value, .commodity-price');
        
        priceElements.forEach(element => {
      
            if (Math.random() > 0.8) {
                element.classList.add('value-changing');
                setTimeout(() => {
                    element.classList.remove('value-changing');
                }, 1000);
            }
        });
    }
    
    function updateActiveSection() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetSection = document.getElementById(hash);
            if (targetSection) {
                updateActiveNav(hash);
                
             
                setTimeout(() => {
                    smoothScrollTo(hash);
                }, 100);
            }
        } else {
            
            updateActiveNav('dashboard');
        }
    }
   
    window.addEventListener('hashchange', function() {
        updateActiveSection();
    });
    

    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Tooltip para curva de rendimientos */
            .curve-tooltip {
                position: absolute;
                background: var(--premium-bg);
                color: var(--white);
                padding: 0.8rem 1.2rem;
                border-radius: 10px;
                font-size: 0.9rem;
                z-index: 1000;
                display: none;
                box-shadow: 0 4px 20px rgba(0,0,0,0.25);
                border: 1px solid var(--gold-primary);
                min-width: 80px;
                text-align: center;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }
            
            .curve-tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 8px solid transparent;
                border-top-color: var(--gold-primary);
            }
            
            .curve-tooltip strong {
                color: var(--gold-secondary);
                display: block;
                margin-bottom: 0.3rem;
                font-size: 1rem;
            }
            
            /* Estilos para selección */
            .comparison-item.selected {
                background: rgba(212, 175, 55, 0.2) !important;
                border: 2px solid var(--gold-primary) !important;
                transform: translateY(-5px);
            }
            
            /* Estilos para efectos de clic */
            .metric-card:active,
            .bond-card:active,
            .future-card:active,
            .option-card:active {
                transform: scale(0.98) !important;
            }
            
            /* Indicador de carga */
            .loading-indicator {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid rgba(212, 175, 55, 0.3);
                border-radius: 50%;
                border-top-color: var(--gold-primary);
                animation: spin 1s ease-in-out infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* Estilos para mensajes temporales */
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
            
            /* Estilos para modales */
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
            }
            
            .modal-overlay.active .modal-content {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
 
    function showTempMessage(message, type = 'info', duration = 3000) {
       
        const messageEl = document.createElement('div');
        messageEl.className = 'temp-message';
        messageEl.textContent = message;
        
     
        if (type === 'success') {
            messageEl.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        } else if (type === 'error') {
            messageEl.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        } else if (type === 'warning') {
            messageEl.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
        }
        
  
        document.body.appendChild(messageEl);
        
    
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, duration);
    }
    
   
    function showModal(title, content) {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
   
        overlay.innerHTML = `
            <div class="modal-content">
                <h3 style="color: var(--primary-dark); margin-bottom: 1rem;">${title}</h3>
                <div style="color: var(--medium-gray); line-height: 1.6;">${content}</div>
                <button style="margin-top: 1.5rem; padding: 0.8rem 1.5rem; background: var(--gold-primary); color: var(--primary-dark); border: none; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%;" onclick="this.closest('.modal-overlay').classList.remove('active')">
                    Cerrar
                </button>
            </div>
        `;
        
  
        document.body.appendChild(overlay);
        
    
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
        
   
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                this.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 300);
            }
        });
    }
    
 
    init();
    
    
    window.showTempMessage = showTempMessage;
    window.showModal = showModal;
});