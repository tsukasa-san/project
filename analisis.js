document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Módulo de Análisis Financiero cargado');


    const sideLinks = document.querySelectorAll('.side-link');
    const contentSubsections = document.querySelectorAll('.content-subsection');
    const controlBtns = document.querySelectorAll('.control-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Inicialización
    function init() {
        initNavigation();
        initDashboardControls();
        initTabs();
        initCalculators();
        initChart();
        initInteractiveElements();
        updateActiveSection();
        addRealTimeUpdates();
    }

    // Navegación entre secciones
    function initNavigation() {
        sideLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                
                // Actualizar navegación
                sideLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
               
                contentSubsections.forEach(section => {
                    section.classList.remove('active');
                });
                
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
               
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
           
                window.location.hash = targetId;
            });
        });

       
        window.addEventListener('hashchange', updateActiveSection);
    }

    // Controles del dashboard
    function initDashboardControls() {
        controlBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const period = this.dataset.period || this.dataset.timeframe;
                
                controlBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
         
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
            
                updateDashboardData(period);
            });
        });
    }

    // Sistema de pestañas
    function initTabs() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
              
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
               
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // Inicializar calculadoras
    function initCalculators() {
        initPositionSizingCalculator();
        initBacktestSimulator();
        initRiskRewardCalculator();
        initSavingsLawCalculator();
        initTechnicalIndicators();
    }

    // Calculadora de Position Sizing
    function initPositionSizingCalculator() {
        const calculateBtn = document.getElementById('calculate-position');
        if (!calculateBtn) return;

        calculateBtn.addEventListener('click', function() {
            const accountCapital = parseFloat(document.getElementById('account-capital').value) || 0;
            const riskPerTrade = parseFloat(document.getElementById('risk-per-trade').value) || 0;
            const entryPrice = parseFloat(document.getElementById('entry-price').value) || 0;
            const stopLoss = parseFloat(document.getElementById('stop-loss').value) || 0;

          
            if (accountCapital <= 0 || riskPerTrade <= 0 || entryPrice <= 0 || stopLoss <= 0) {
                showMessage('Por favor ingresa valores válidos en todos los campos', 'error');
                return;
            }

            if (stopLoss >= entryPrice) {
                showMessage('El Stop Loss debe ser menor al precio de entrada', 'error');
                return;
            }

           
            const riskPerShare = entryPrice - stopLoss;
            const totalRiskAllowed = accountCapital * (riskPerTrade / 100);
            const positionShares = Math.floor(totalRiskAllowed / riskPerShare);
            const positionValue = positionShares * entryPrice;
            const capitalPercentage = (positionValue / accountCapital) * 100;

       
            document.getElementById('risk-per-share').textContent = `$${riskPerShare.toFixed(2)}`;
            document.getElementById('total-risk').textContent = `$${totalRiskAllowed.toFixed(2)}`;
            document.getElementById('position-shares').textContent = `${positionShares.toFixed(0)} acciones`;
            document.getElementById('position-value').textContent = `$${positionValue.toFixed(2)}`;
            document.getElementById('capital-percentage').textContent = `${capitalPercentage.toFixed(1)}%`;

           
            animateResults('.position-results .result-item');
            
            showMessage('Cálculo completado exitosamente', 'success');
        });
    }

    // Simulador de Backtesting
    function initBacktestSimulator() {
        const runBtn = document.getElementById('run-backtest');
        if (!runBtn) return;

        runBtn.addEventListener('click', function() {
            const strategyType = document.getElementById('strategy-type').value;
            const initialCapital = parseFloat(document.getElementById('initial-capital').value) || 50000;
            
          
            let results = {
                breakout: { return: 18.5, drawdown: 8.2, sharpe: 1.42, wins: 58, expectation: 1.25 },
                'mean-reversion': { return: 12.8, drawdown: 6.5, sharpe: 1.15, wins: 62, expectation: 0.95 },
                'trend-following': { return: 22.3, drawdown: 12.5, sharpe: 1.28, wins: 52, expectation: 1.45 },
                'swing-trading': { return: 15.7, drawdown: 7.8, sharpe: 1.35, wins: 55, expectation: 1.12 }
            };

            const result = results[strategyType] || results.breakout;

           
            document.getElementById('backtest-return').textContent = `+${result.return}%`;
            document.getElementById('max-drawdown').textContent = `-${result.drawdown}%`;
            document.getElementById('sharpe-ratio').textContent = result.sharpe.toFixed(2);
            document.getElementById('winning-trades').textContent = `${result.wins}%`;
            document.getElementById('mathematical-expectation').textContent = `+${result.expectation}`;

            
            updateResultColors();
            
            
            animateResults('.backtest-results .result-item');
            
            showMessage(`Backtest de estrategia "${getStrategyName(strategyType)}" completado`, 'success');
        });

        function getStrategyName(type) {
            const names = {
                'breakout': 'Breakout',
                'mean-reversion': 'Mean Reversion',
                'trend-following': 'Trend Following',
                'swing-trading': 'Swing Trading'
            };
            return names[type] || 'Estrategia';
        }
    }

    // Calculadora Risk/Reward
    function initRiskRewardCalculator() {
        const calculateBtn = document.getElementById('calculate-rr');
        if (!calculateBtn) return;

        calculateBtn.addEventListener('click', function() {
            const entry = parseFloat(document.getElementById('rr-entry-price').value) || 0;
            const stopLoss = parseFloat(document.getElementById('rr-sl-price').value) || 0;
            const takeProfit1 = parseFloat(document.getElementById('rr-tp1-price').value) || 0;
            const takeProfit2 = parseFloat(document.getElementById('rr-tp2-price').value) || 0;
            const successProb = parseFloat(document.getElementById('success-probability').value) || 0;

            
            if (entry <= 0 || stopLoss <= 0 || takeProfit1 <= 0 || successProb <= 0) {
                showMessage('Ingresa valores válidos en los campos requeridos', 'error');
                return;
            }

            if (stopLoss >= entry) {
                showMessage('Stop Loss debe ser menor al precio de entrada', 'error');
                return;
            }

            if (takeProfit1 <= entry) {
                showMessage('Take Profit 1 debe ser mayor al precio de entrada', 'error');
                return;
            }

            
            const riskPerShare = entry - stopLoss;
            const profitTP1 = takeProfit1 - entry;
            const profitTP2 = takeProfit2 > entry ? takeProfit2 - entry : 0;
            
            const rrRatio1 = (profitTP1 / riskPerShare).toFixed(1);
            const rrRatio2 = takeProfit2 > entry ? (profitTP2 / riskPerShare).toFixed(2) : 0;
            
           
            const winAmount = (profitTP1 + (profitTP2 || 0)) / (takeProfit2 > entry ? 2 : 1);
            const lossAmount = riskPerShare;
            const expectation = ((successProb / 100) * winAmount - ((100 - successProb) / 100) * lossAmount).toFixed(2);
            
        
            let recommendation = 'Operación no viable';
            let recommendationClass = 'negative';
            
            if (parseFloat(expectation) > 0) {
                recommendation = 'Operación viable';
                recommendationClass = 'positive';
            } else if (parseFloat(expectation) > -0.5) {
                recommendation = 'Operación marginal';
                recommendationClass = 'neutral';
            }

        
            document.getElementById('rr-risk-per-share').textContent = `$${riskPerShare.toFixed(2)}`;
            document.getElementById('rr-profit-tp1').textContent = `$${profitTP1.toFixed(2)} (1:${rrRatio1})`;
            document.getElementById('rr-profit-tp2').textContent = takeProfit2 > entry ? 
                `$${profitTP2.toFixed(2)} (1:${rrRatio2})` : 'N/A';
            document.getElementById('rr-expectation').textContent = `$${expectation}`;
            
            const rrRecommendation = document.getElementById('rr-recommendation');
            rrRecommendation.textContent = recommendation;
            rrRecommendation.className = recommendationClass;

            
            animateResults('.rr-results .result-item');
            
            showMessage('Cálculo Risk/Reward completado', 'success');
        });
    }

    // Calculadora Ley del Ahorro
    function initSavingsLawCalculator() {
        const calculateBtn = document.getElementById('calculate-savings');
        if (!calculateBtn) return;

        calculateBtn.addEventListener('click', function() {
            const initialCapital = parseFloat(document.getElementById('initial-capital').value) || 0;
            const monthlySavings = parseFloat(document.getElementById('monthly-savings').value) || 0;
            const annualReturn = parseFloat(document.getElementById('annual-return').value) || 0;
            const years = parseFloat(document.getElementById('savings-years').value) || 0;
            const inflation = parseFloat(document.getElementById('inflation-rate').value) || 0;

          
            if (years <= 0 || annualReturn <= 0) {
                showMessage('Ingresa un número de años y rentabilidad válidos', 'error');
                return;
            }

          
            const monthlyRate = annualReturn / 100 / 12;
            const months = years * 12;
            
         
            let futureValue = initialCapital * Math.pow(1 + monthlyRate, months);
            
            if (monthlySavings > 0) {
                futureValue += monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            }
            
            const totalInvested = initialCapital + (monthlySavings * months);
            
            const interestEarned = futureValue - totalInvested;
            
            const inflationFactor = Math.pow(1 + inflation / 100, years);
            const realValue = futureValue / inflationFactor;
            
            const totalGrowth = ((futureValue / totalInvested - 1) * 100);
            const realGrowth = ((realValue / totalInvested - 1) * 100);

            document.getElementById('total-savings').textContent = `$${Math.round(futureValue).toLocaleString()}`;
            document.getElementById('real-savings').textContent = `$${Math.round(realValue).toLocaleString()}`;
            document.getElementById('total-invested').textContent = `$${Math.round(totalInvested).toLocaleString()}`;
            document.getElementById('total-earned').textContent = `$${Math.round(interestEarned).toLocaleString()}`;
            document.getElementById('savings-growth').textContent = `${totalGrowth.toFixed(1)}%`;

            animateSavingsResults();
            
            showMessage('Proyección de ahorro calculada exitosamente', 'success');
        });
    }

    function initTechnicalIndicators() {
      
        const applyMaBtn = document.querySelector('.apply-ma');
        if (applyMaBtn) {
            applyMaBtn.addEventListener('click', function() {
                const maFast = document.querySelector('.ma-fast').value;
                const maMedium = document.querySelector('.ma-medium').value;
                const maSlow = document.querySelector('.ma-slow').value;
                
                showMessage(`Medias Móviles aplicadas: ${maFast}d, ${maMedium}d, ${maSlow}d`, 'success');
                updateTechnicalChart('ma', { fast: maFast, medium: maMedium, slow: maSlow });
            });
        }

        // RSI
        const applyRsiBtn = document.querySelector('.apply-rsi');
        if (applyRsiBtn) {
            applyRsiBtn.addEventListener('click', function() {
                const period = document.querySelector('.rsi-period').value;
                const overbought = document.querySelector('.rsi-overbought').value;
                const oversold = document.querySelector('.rsi-oversold').value;
                
                showMessage(`RSI aplicado: Período ${period}d, Niveles ${overbought}/${oversold}`, 'success');
                updateTechnicalChart('rsi', { period, overbought, oversold });
            });
        }

        // MACD
        const applyMacdBtn = document.querySelector('.apply-macd');
        if (applyMacdBtn) {
            applyMacdBtn.addEventListener('click', function() {
                const fast = document.querySelector('.macd-fast').value;
                const slow = document.querySelector('.macd-slow').value;
                const signal = document.querySelector('.macd-signal').value;
                
                showMessage(`MACD aplicado: ${fast}/${slow}/${signal}`, 'success');
                updateTechnicalChart('macd', { fast, slow, signal });
            });
        }
    }

    // Inicializar gráfico
    function initChart() {
        const chartCanvas = document.getElementById('ipc-chart');
        if (!chartCanvas) return;

        try {
            const ctx = chartCanvas.getContext('2d');
            
            const data = {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'IPC México',
                    data: [54000, 54500, 54800, 55200, 56000, 56500, 57000, 57500, 58000, 58200, 58450, 58800],
                    borderColor: '#D4AF37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Media Móvil 20d',
                    data: [53800, 54200, 54500, 54800, 55200, 55600, 56000, 56400, 56800, 57200, 57600, 58000],
                    borderColor: '#27ae60',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    fill: false
                }, {
                    label: 'Media Móvil 50d',
                    data: [53000, 53500, 53800, 54200, 54600, 55000, 55400, 55800, 56200, 56600, 57000, 57400],
                    borderColor: '#3498db',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    fill: false
                }]
            };

            const chart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString() + ' pts';
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'nearest'
                    }
                }
            });

            // Guardar referencia al gráfico
            window.ipcChart = chart;
            
        } catch (error) {
            console.error('Error inicializando gráfico:', error);
            chartCanvas.innerHTML = '<p style="color: #e74c3c; text-align: center; padding: 2rem;">Error cargando gráfico. Recarga la página.</p>';
        }
    }

    // Actualizar gráfico técnico
    function updateTechnicalChart(indicator, params) {
        if (!window.ipcChart) return;

        const chart = window.ipcChart;
        
        chart.canvas.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.3)';
        setTimeout(() => {
            chart.canvas.style.boxShadow = 'none';
        }, 1000);
        
        console.log(`Indicador ${indicator} actualizado:`, params);
    }

    // Elementos interactivos
    function initInteractiveElements() {
       // Tooltips
        const tooltips = document.querySelectorAll('.indicator-tooltip');
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('mouseenter', function() {
                const tooltipText = this.querySelector('.tooltip-text');
                if (tooltipText) {
                    tooltipText.style.opacity = '1';
                    tooltipText.style.visibility = 'visible';
                }
            });
            
            tooltip.addEventListener('mouseleave', function() {
                const tooltipText = this.querySelector('.tooltip-text');
                if (tooltipText) {
                    tooltipText.style.opacity = '0';
                    tooltipText.style.visibility = 'hidden';
                }
            });
        });

        // Efectos hover en tarjetas
        const cards = document.querySelectorAll('.metric-card, .tool-card, .signal-card, .valuation-card, .sentiment-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });

        // Botones de acción
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
    }

    // Actualizar datos del dashboard
    function updateDashboardData(period) {
        console.log(`Actualizando dashboard para periodo: ${period}`);
        
        const metrics = document.querySelectorAll('.metric-card');
        metrics.forEach(card => {
            card.classList.add('updating');
            
            const valueElement = card.querySelector('.metric-value');
            const trendElement = card.querySelector('.metric-trend');
            
            if (valueElement && trendElement) {
                const currentValue = parseFloat(valueElement.textContent.replace(/[^0-9.-]+/g, ""));
                const randomChange = (Math.random() * 2 - 1) * (currentValue * 0.02); // ±2%
                const newValue = currentValue + randomChange;
                
                setTimeout(() => {
                    valueElement.textContent = formatValue(newValue, valueElement.textContent);
                    valueElement.classList.add('value-changing');
                    
                    const trendClass = randomChange >= 0 ? 'positive' : 'negative';
                    const trendSymbol = randomChange >= 0 ? '▲' : '▼';
                    const trendPercent = Math.abs((randomChange / currentValue) * 100).toFixed(2);
                    
                    trendElement.textContent = `${trendSymbol} ${trendPercent}%`;
                    trendElement.className = 'metric-trend ' + trendClass;
                    
                    setTimeout(() => {
                        valueElement.classList.remove('value-changing');
                    }, 500);
                }, 300);
            }
            
            setTimeout(() => {
                card.classList.remove('updating');
            }, 1000);
        });
        
        updateChartTimeframe(period);
    }

    // Actualizar timeframe del gráfico
    function updateChartTimeframe(timeframe) {
        if (!window.ipcChart) return;
        
        const chart = window.ipcChart;
        const timeframes = {
            '1d': ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'],
            '1w': ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
            '1m': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            '3m': ['Mes 1', 'Mes 2', 'Mes 3'],
            '1y': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            '5y': ['2021', '2022', '2023', '2024', '2025']
        };
        
        const labels = timeframes[timeframe] || timeframes['1m'];
        chart.data.labels = labels;
        
        // Actualizar datos según timeframe
        const baseData = [54000, 54500, 54800, 55200, 56000, 56500, 57000, 57500, 58000, 58200, 58450, 58800];
        const slicedData = baseData.slice(0, labels.length);
        
        chart.data.datasets[0].data = slicedData;
        chart.update();
        
        chart.canvas.style.animation = 'chartUpdate 0.5s ease';
        setTimeout(() => {
            chart.canvas.style.animation = '';
        }, 500);
    }

    // Actualizar colores de resultados
    function updateResultColors() {
        const returnElement = document.getElementById('backtest-return');
        const drawdownElement = document.getElementById('max-drawdown');
        
        if (returnElement) {
            const returnValue = parseFloat(returnElement.textContent);
            returnElement.className = returnValue >= 0 ? 'positive' : 'negative';
        }
        
        if (drawdownElement) {
            drawdownElement.className = 'negative'; // Drawdown siempre es negativo
        }
    }

    // Animar resultados
    function animateResults(selector) {
        const results = document.querySelectorAll(selector);
        results.forEach((result, index) => {
            result.style.opacity = '0';
            result.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                result.style.transition = 'all 0.3s ease';
                result.style.opacity = '1';
                result.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    // Animar resultados de ahorro
    function animateSavingsResults() {
        const savingsCards = document.querySelectorAll('.savings-result-card');
        savingsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
                
                const valueElement = card.querySelector('.savings-result-value');
                if (valueElement) {
                    const finalValue = parseFloat(valueElement.textContent.replace(/[^0-9.-]+/g, ""));
                    animateCount(valueElement, 0, finalValue, 1500);
                }
            }, index * 200);
        });
    }

    // Animación de conteo
    function animateCount(element, start, end, duration) {
        const startTime = performance.now();
        const valueDiff = end - start;
        
        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = start + (valueDiff * easeOut);
            
            element.textContent = formatCurrency(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        }
        
        requestAnimationFrame(updateCount);
    }

    // Formatear valores
    function formatValue(value, originalText) {
        if (originalText.includes('$')) {
            return `$${Math.round(value).toLocaleString()}`;
        } else if (originalText.includes('%')) {
            return `${value.toFixed(2)}%`;
        } else if (originalText.includes('pts') || originalText.length > 6) {
            return Math.round(value).toLocaleString();
        } else {
            return value.toFixed(2);
        }
    }
    function formatCurrency(value) {
        return `$${Math.round(value).toLocaleString()}`;
    }

    function showMessage(message, type = 'info') {
      
        let messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            messageContainer.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 2000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 350px;
            `;
            document.body.appendChild(messageContainer);
        }

       
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            background: ${type === 'success' ? 'var(--positive)' : 
                        type === 'error' ? 'var(--negative)' : 
                        'var(--gold-primary)'};
            color: var(--primary-dark);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
            font-weight: 500;
        `;

        messageContainer.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }, 5000);
    }

    // Actualizar sección activa
    function updateActiveSection() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetSection = document.getElementById(hash);
            if (targetSection) {
                
                contentSubsections.forEach(section => {
                    section.classList.remove('active');
                });
                
                targetSection.classList.add('active');
                
                sideLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${hash}`) {
                        link.classList.add('active');
                    }
                });
                
                setTimeout(() => {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        } else {
       
            const dashboard = document.getElementById('dashboard-analisis');
            if (dashboard) {
                contentSubsections.forEach(section => section.classList.remove('active'));
                dashboard.classList.add('active');
                sideLinks.forEach(link => link.classList.remove('active'));
                sideLinks[0].classList.add('active');
            }
        }
    }

    // Actualizaciones en tiempo real
    function addRealTimeUpdates() {
        
        setInterval(() => {
            updateLiveIndicators();
        }, 30000);

        
        setInterval(() => {
            simulateMarketChanges();
        }, 60000);
    }

    // Actualizar indicadores en vivo
    function updateLiveIndicators() {
        const indicators = document.querySelectorAll('.live-indicator');
        indicators.forEach(indicator => {
            const valueElement = indicator.querySelector('.indicator-value');
            const changeElement = indicator.querySelector('.indicator-change');
            
            if (valueElement && changeElement) {
             
                const currentValue = parseFloat(valueElement.textContent.replace(/[^0-9.-]+/g, ""));
                const change = (Math.random() - 0.5) * (currentValue * 0.005); // ±0.5%
                const newValue = currentValue + change;
                
                valueElement.classList.add('value-changing');
                changeElement.classList.add('value-changing');
                
                setTimeout(() => {
                    valueElement.textContent = formatValue(newValue, valueElement.textContent);
                    
                    const changePercent = (change / currentValue * 100).toFixed(2);
                    const isPositive = change >= 0;
                    
                    changeElement.textContent = `${isPositive ? '▲' : '▼'} ${Math.abs(changePercent)}%`;
                    changeElement.className = `indicator-change ${isPositive ? 'positive' : 'negative'}`;
                    
                    setTimeout(() => {
                        valueElement.classList.remove('value-changing');
                        changeElement.classList.remove('value-changing');
                    }, 300);
                }, 200);
            }
        });
    }

    // Simular cambios de mercado
    function simulateMarketChanges() {
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
           
            if (Math.random() < 0.3) {
                const trendElement = card.querySelector('.metric-trend');
                if (trendElement) {
                    trendElement.style.animation = 'pulse 0.5s ease';
                    setTimeout(() => {
                        trendElement.style.animation = '';
                    }, 500);
                }
            }
        });
    }

    // Añadir estilos dinámicos
    function addDynamicStyles() {
        const styles = `
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
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes chartUpdate {
                0% { opacity: 0.8; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            
            .value-changing {
                animation: pulse 0.5s ease;
            }
            
            .updating {
                position: relative;
                overflow: hidden;
            }
            
            .updating::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
                animation: loading 1s infinite;
            }
            
            @keyframes loading {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            .message {
                cursor: pointer;
            }
            
            .message:hover {
                opacity: 0.9;
                transform: translateY(-2px);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    init();
    addDynamicStyles();

    window.updateDashboardData = updateDashboardData;
    window.showMessage = showMessage;
});