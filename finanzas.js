document.addEventListener('DOMContentLoaded', function() {
    
    const sideLinks = document.querySelectorAll('.side-link');
    const controlBtns = document.querySelectorAll('.control-btn');
    const addBudgetBtn = document.getElementById('add-budget-category');
    const resetBudgetBtn = document.getElementById('reset-budget');
    const addGoalBtn = document.getElementById('add-savings-goal');
    const budgetModal = document.getElementById('budget-modal');
    const goalModal = document.getElementById('goal-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const budgetContainer = document.getElementById('budget-container');
    const goalsContainer = document.getElementById('goals-container');
    const calculateLawBtn = document.getElementById('calculate-law');
    const calculateDebtAdvancedBtn = document.getElementById('calculate-debt-advanced');
    const calculateSavingsAdvancedBtn = document.getElementById('calculate-savings-advanced');
    const strategySelectBtns = document.querySelectorAll('.strategy-select-btn');
    
    let budgetCategories = JSON.parse(localStorage.getItem('budgetCategories')) || [];
    let savingsGoals = JSON.parse(localStorage.getItem('savingsGoals')) || [];
    let userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {
        debtStrategy: 'avalanche',
        savingsPercentage: 20
    };
    
    initPage();
    
    function initPage() {
        initNavigation();
        initDashboardControls();
        initModals();
        initAdvancedCalculators();
        initDebtStrategies();
        loadUserData();
        initAdvancedInteractivity();
        initToastSystem();
        
        console.log('🚀 Sistema de Finanzas Personales México cargado');
        console.log('📊 Datos actualizados: Diciembre 2025');
        console.log('🇲🇽 Configurado para economía mexicana');
    }

    function initNavigation() {
        sideLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                sideLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                showSectionWithAnimation(targetId);
                
                window.history.pushState({}, '', `#${targetId}`);
            });
        });
        
        window.addEventListener('hashchange', function() {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const targetLink = document.querySelector(`.side-link[href="#${hash}"]`);
                if (targetLink) {
                    sideLinks.forEach(l => l.classList.remove('active'));
                    targetLink.classList.add('active');
                    showSectionWithAnimation(hash);
                }
            }
        });
        
        const initialHash = window.location.hash.substring(1);
        if (initialHash) {
            const targetLink = document.querySelector(`.side-link[href="#${initialHash}"]`);
            if (targetLink) {
                sideLinks.forEach(l => l.classList.remove('active'));
                targetLink.classList.add('active');
                showSectionWithAnimation(initialHash);
            }
        }
    }
    
    function showSectionWithAnimation(sectionId) {
        const currentSection = document.querySelector('.content-section.active');
        const targetSection = document.getElementById(sectionId);
        
        if (!targetSection) return;
        
        if (currentSection && currentSection !== targetSection) {
            currentSection.style.opacity = '0';
            currentSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                currentSection.classList.remove('active');
                
                targetSection.classList.add('active');
                targetSection.style.opacity = '0';
                targetSection.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                }, 50);
            }, 300);
        } else if (!currentSection) {
            targetSection.classList.add('active');
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function initDashboardControls() {
        controlBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                controlBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                updateDashboardData(this.dataset.period);
            });
        });
    }
    
    function updateDashboardData(period) {
        const metrics = document.querySelectorAll('.metric-value');
        const trends = document.querySelectorAll('.metric-trend');
        
        const data = {
            week: {
                wealth: '$48,200',
                wealthTrend: '+2%',
                income: '$8,850',
                incomeTrend: '+1%',
                debt: '$11,500',
                debtTrend: '-5%',
                goals: '72%',
                goalsTrend: '+8%'
            },
            month: {
                wealth: '$48,750',
                wealthTrend: '+12%',
                income: '$8,850',
                incomeTrend: '+8%',
                debt: '$11,500',
                debtTrend: '-18%',
                goals: '85%',
                goalsTrend: '+25%'
            },
            year: {
                wealth: '$52,100',
                wealthTrend: '+28%',
                income: '$106,200',
                incomeTrend: '+12%',
                debt: '$8,900',
                debtTrend: '-42%',
                goals: '92%',
                goalsTrend: '+45%'
            }
        };
        
        const periodData = data[period] || data.month;

        animateMetricUpdate(metrics[0], periodData.wealth);
        animateTrendUpdate(trends[0], periodData.wealthTrend, 'positive');
        
        animateMetricUpdate(metrics[1], periodData.income);
        animateTrendUpdate(trends[1], periodData.incomeTrend, 'positive');
        
        animateMetricUpdate(metrics[2], periodData.debt);
        animateTrendUpdate(trends[2], periodData.debtTrend, 'negative');
        
        animateMetricUpdate(metrics[3], periodData.goals);
        animateTrendUpdate(trends[3], periodData.goalsTrend, 'positive');
        
        const gaugeText = document.querySelector('.gauge-text');
        const gaugeCircle = document.querySelector('.gauge-circle');
        if (gaugeText && gaugeCircle) {
            const percentage = parseInt(periodData.goals);
            gaugeText.textContent = periodData.goals;
            gaugeCircle.style.background = 
                `conic-gradient(var(--gold-primary) 0% ${percentage}%, var(--lighter-gray) ${percentage}% 100%)`;
        }
        
        updateFlowData(periodData);
    }
    
    function animateMetricUpdate(element, newValue) {
        element.style.transform = 'scale(1.1)';
        element.style.color = 'var(--gold-primary)';
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            setTimeout(() => {
                element.style.color = '';
            }, 500);
        }, 150);
    }
    
    function animateTrendUpdate(element, newValue, trendType) {
        element.textContent = newValue;
        element.className = `metric-trend ${trendType}`;
        element.style.animation = 'pulse 0.5s ease';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
    
    function updateFlowData(periodData) {
        const flowValues = document.querySelectorAll('.flow-value');
        if (flowValues.length >= 4) {
            const flowData = {
                week: ['$8,850', '$5,200', '$1,800', '$1,850'],
                month: ['$8,850', '$5,450', '$2,000', '$1,400'],
                year: ['$106,200', '$65,400', '$21,200', '$19,600']
            };
            
            const currentPeriod = document.querySelector('.control-btn.active').dataset.period;
            const currentFlowData = flowData[currentPeriod] || flowData.month;
            
            flowValues.forEach((value, index) => {
                value.textContent = currentFlowData[index];
                value.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    value.style.transform = 'scale(1)';
                }, 150);
            });
        }
    }
    
    function loadUserData() {
        loadBudgetCategories();
        loadSavingsGoals();
        updateBudgetSummary();
    }
    
    function loadBudgetCategories() {
        budgetContainer.innerHTML = '';
        
        const defaultCategories = [
            { id: 'default-1', name: 'Vivienda', budget: 3500, type: 'necesidad', icon: '🏠', spent: 2975 },
            { id: 'default-2', name: 'Alimentación', budget: 2200, type: 'necesidad', icon: '🍎', spent: 1980 },
            { id: 'default-3', name: 'Transporte', budget: 1200, type: 'necesidad', icon: '🚗', spent: 960 },
            { id: 'default-4', name: 'Salud', budget: 800, type: 'necesidad', icon: '🏥', spent: 320 },
            { id: 'default-5', name: 'Entretenimiento', budget: 800, type: 'deseo', icon: '🎮', spent: 240 }
        ];

        const allCategories = [...defaultCategories, ...budgetCategories];
        
        allCategories.forEach(category => {
            addBudgetCategoryToDOM(category);
        });
    }
    
    function addBudgetCategoryToDOM(category) {
        const budgetCategory = document.createElement('div');
        budgetCategory.className = 'budget-category';
        budgetCategory.dataset.id = category.id;
        
        const spentPercentage = Math.min(100, Math.round((category.spent / category.budget) * 100));
        const remaining = category.budget - category.spent;
        
        budgetCategory.innerHTML = `
            <div class="budget-category-header">
                <h4>${category.icon} ${category.name}</h4>
                ${!category.id.startsWith('default-') ? '<button class="action-icon delete-category">🗑️</button>' : ''}
            </div>
            <div class="budget-bar">
                <div class="budget-fill" style="width: ${spentPercentage}%"></div>
            </div>
            <div class="budget-details">
                <span>Presupuesto: $${category.budget.toLocaleString()}</span>
                <span>Gastado: $${category.spent.toLocaleString()}</span>
                <span>Restante: $${remaining.toLocaleString()}</span>
            </div>
        `;
        
        budgetContainer.appendChild(budgetCategory);
        
        if (!category.id.startsWith('default-')) {
            budgetCategory.querySelector('.delete-category').addEventListener('click', function() {
                showDeleteConfirmation(category.name, () => {
                    deleteBudgetCategory(category.id);
                });
            });
        }
        
        budgetCategory.addEventListener('click', function(e) {
            if (!e.target.classList.contains('delete-category')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    }
    
    function deleteBudgetCategory(categoryId) {
        budgetCategories = budgetCategories.filter(cat => cat.id !== categoryId);
        localStorage.setItem('budgetCategories', JSON.stringify(budgetCategories));
        loadBudgetCategories();
        updateBudgetSummary();
        showToast('🗑️ Categoría eliminada exitosamente', 'info');
    }
    
    function updateBudgetSummary() {
        const totalBudget = 8500;
        let totalSpent = 0;
        
        document.querySelectorAll('.budget-category').forEach(category => {
            const spentText = category.querySelector('.budget-details span:nth-child(2)').textContent;
            const spent = parseFloat(spentText.replace('Gastado: $', '').replace(/,/g, ''));
            totalSpent += spent;
        });
        
        const remaining = totalBudget - totalSpent;
        const usedPercentage = Math.round((totalSpent / totalBudget) * 100);
        
        const totalSpentElement = document.getElementById('total-spent');
        const totalRemainingElement = document.getElementById('total-remaining');
        const budgetUsedElement = document.getElementById('budget-used');
        
        if (totalSpentElement) {
            totalSpentElement.textContent = `$${totalSpent.toLocaleString()}`;
            totalSpentElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                totalSpentElement.style.transform = 'scale(1)';
            }, 150);
        }
        
        if (totalRemainingElement) {
            totalRemainingElement.textContent = `$${remaining.toLocaleString()}`;
            totalRemainingElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                totalRemainingElement.style.transform = 'scale(1)';
            }, 150);
        }
        
        if (budgetUsedElement) {
            budgetUsedElement.textContent = `${usedPercentage}%`;
            budgetUsedElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                budgetUsedElement.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    function loadSavingsGoals() {
        goalsContainer.innerHTML = '';
        
        const defaultGoals = [
            {
                id: 'default-1',
                name: 'Fondo de Emergencia',
                description: '6 meses de gastos para imprevistos',
                target: 150000,
                current: 97500,
                monthly: 5000
            },
            {
                id: 'default-2', 
                name: 'Auto Nuevo',
                description: 'Enganche para automóvil económico',
                target: 80000,
                current: 32000,
                monthly: 4000
            },
            {
                id: 'default-3',
                name: 'Enganche Casa',
                description: '20% para enganche de vivienda',
                target: 400000,
                current: 100000,
                monthly: 8000
            }
        ];
        
        const allGoals = [...defaultGoals, ...savingsGoals];
        
        allGoals.forEach(goal => {
            addSavingsGoalToDOM(goal);
        });
    }
    
    function addSavingsGoalToDOM(goal) {
        const goalCard = document.createElement('div');
        goalCard.className = 'savings-goal-card';
        goalCard.dataset.id = goal.id;
        
        const progressPercentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
        const monthsRemaining = Math.ceil((goal.target - goal.current) / goal.monthly);
        
        goalCard.innerHTML = `
            <h4>${goal.name}</h4>
            <p>${goal.description}</p>
            <div class="goal-progress-detailed">
                <span>$${goal.current.toLocaleString()} / $${goal.target.toLocaleString()}</span>
                <div class="progress-bar-detailed">
                    <div class="progress-fill-detailed" style="width: ${progressPercentage}%"></div>
                </div>
                <div class="goal-stats">
                    <span>Progreso: ${progressPercentage}%</span>
                    <span>Tiempo restante: ${monthsRemaining} meses</span>
                </div>
            </div>
            <div class="goal-actions-detailed">
                <button class="action-btn primary small add-to-goal">
                    <span class="btn-icon">💰</span>
                    Agregar $500
                </button>
                ${!goal.id.startsWith('default-') ? 
                    '<button class="action-btn secondary small delete-goal">Eliminar</button>' : 
                    ''
                }
            </div>
        `;
        
        goalsContainer.appendChild(goalCard);
        
        goalCard.querySelector('.add-to-goal').addEventListener('click', function() {
            addToSavingsGoal(goal.id, 500);
        });
        
        if (!goal.id.startsWith('default-')) {
            goalCard.querySelector('.delete-goal').addEventListener('click', function() {
                showDeleteConfirmation(goal.name, () => {
                    deleteSavingsGoal(goal.id);
                });
            });
        }
        
        goalCard.addEventListener('click', function(e) {
            if (!e.target.closest('.goal-actions-detailed')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    }
    
    function addToSavingsGoal(goalId, amount) {
        const allGoals = [...getDefaultGoals(), ...savingsGoals];
        const goal = allGoals.find(g => g.id === goalId);
        
        if (goal) {
            const originalAmount = goal.current;
            goal.current += amount;
            
            if (goal.current > goal.target) {
                goal.current = goal.target;
                showToast('🎉 ¡Meta alcanzada!', 'success');
            }
            
            const goalCard = document.querySelector(`.savings-goal-card[data-id="${goalId}"]`);
            if (goalCard) {
                const progressPercentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
                const progressFill = goalCard.querySelector('.progress-fill-detailed');
                const progressText = goalCard.querySelector('.goal-progress-detailed span:first-child');
                const progressStats = goalCard.querySelectorAll('.goal-stats span');

                progressFill.style.width = `${progressPercentage}%`;
                progressText.textContent = `$${goal.current.toLocaleString()} / $${goal.target.toLocaleString()}`;
                progressStats[0].textContent = `Progreso: ${progressPercentage}%`;
                
                const monthsRemaining = Math.ceil((goal.target - goal.current) / goal.monthly);
                progressStats[1].textContent = `Tiempo restante: ${monthsRemaining} meses`;
        
                goalCard.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    goalCard.style.animation = '';
                }, 500);
                
                if (goal.current > originalAmount) {
                    const amountAdded = goal.current - originalAmount;
                    showToast(`💰 Agregado $${amountAdded.toLocaleString()} a "${goal.name}"`, 'success');
                }
            }
            
            if (!goalId.startsWith('default-')) {
                localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
            }
        }
    }
    
    function deleteSavingsGoal(goalId) {
        savingsGoals = savingsGoals.filter(goal => goal.id !== goalId);
        localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
        loadSavingsGoals();
        showToast('🗑️ Meta eliminada exitosamente', 'info');
    }
    
    function getDefaultGoals() {
        return [
            { id: 'default-1', name: 'Fondo de Emergencia', target: 150000, current: 97500, monthly: 5000 },
            { id: 'default-2', name: 'Auto Nuevo', target: 80000, current: 32000, monthly: 4000 },
            { id: 'default-3', name: 'Enganche Casa', target: 400000, current: 100000, monthly: 8000 }
        ];
    }
    
    function initAdvancedCalculators() {
        if (calculateLawBtn) {
            calculateLawBtn.addEventListener('click', calculateLawOfSavings);
        }
        
        const savingsSlider = document.getElementById('savings-percentage');
        const savingsValue = document.getElementById('savings-percentage-value');
        
        if (savingsSlider && savingsValue) {
            savingsSlider.addEventListener('input', function() {
                savingsValue.textContent = `${this.value}%`;
                userPreferences.savingsPercentage = this.value;
                localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
                calculateLawOfSavings();
            });
        }
        
        if (calculateDebtAdvancedBtn) {
            calculateDebtAdvancedBtn.addEventListener('click', calculateDebtAdvanced);
        }
        
        if (calculateSavingsAdvancedBtn) {
            calculateSavingsAdvancedBtn.addEventListener('click', calculateSavingsAdvanced);
        }
        
        const inputs = document.querySelectorAll('.calculator-input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = 'var(--gold-primary)';
                setTimeout(() => {
                    if (document.activeElement !== this) {
                        this.style.borderColor = '';
                    }
                }, 1000);
            });
        });
        
        calculateLawOfSavings();
        calculateDebtAdvanced();
        calculateSavingsAdvanced();
    }
    
    function calculateLawOfSavings() {
        const monthlyIncome = parseFloat(document.getElementById('monthly-income-law').value) || 0;
        const savingsPercentage = parseFloat(document.getElementById('savings-percentage').value) || 0;
        const returnRate = parseFloat(document.getElementById('return-rate').value) || 0;
        const investmentYears = parseFloat(document.getElementById('investment-years').value) || 0;
        
        if (monthlyIncome <= 0 || investmentYears <= 0) {
            showToast('⚠️ Ingresa valores válidos para calcular', 'warning');
            return;
        }
        
        const monthlySavings = monthlyIncome * (savingsPercentage / 100);
        const totalSavings = monthlySavings * 12 * investmentYears;
        
        const monthlyRate = returnRate / 100 / 12;
        const months = investmentYears * 12;
        
        let futureValue = 0;
        if (monthlyRate > 0) {
            futureValue = monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        } else {
            futureValue = totalSavings;
        }
        
        const interestEarned = futureValue - totalSavings;
        
        animateResultUpdate('total-savings-law', `$${Math.round(totalSavings).toLocaleString()}`);
        animateResultUpdate('future-value-law', `$${Math.round(futureValue).toLocaleString()}`);
        animateResultUpdate('interest-earned-law', `$${Math.round(interestEarned).toLocaleString()}`);
        
        showLawInsights(monthlySavings, futureValue, interestEarned, investmentYears);
    }
    
    function animateResultUpdate(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.transform = 'scale(1.1)';
            element.style.color = 'var(--gold-primary)';
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
                setTimeout(() => {
                    element.style.color = '';
                }, 500);
            }, 150);
        }
    }
    
    function showLawInsights(monthlySavings, futureValue, interestEarned, years) {
        const insightsContainer = document.querySelector('.law-insights');
        if (!insightsContainer) return;
        
        const interestPercentage = Math.round((interestEarned / futureValue) * 100);
        const monthlyIncome = parseFloat(document.getElementById('monthly-income-law').value) || 0;
        
        const insights = [
            `Ahorrando $${monthlySavings.toLocaleString()} mensuales (${Math.round((monthlySavings/monthlyIncome)*100)}% de tu ingreso), en ${years} años tendrás $${Math.round(futureValue).toLocaleString()}`,
            `El interés compuesto generará $${Math.round(interestEarned).toLocaleString()} - eso representa el ${interestPercentage}% de tu patrimonio final`,
            `Cada año que empieces antes puede aumentar tu patrimonio final en aproximadamente ${Math.round(interestPercentage/years)}%`
        ];
        
        const insightElements = insightsContainer.querySelectorAll('.insight-card p');
        insightElements.forEach((element, index) => {
            if (insights[index]) {
                element.textContent = insights[index];
                element.parentElement.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    element.parentElement.style.animation = '';
                }, 500);
            }
        });
    }
    
    function calculateDebtAdvanced() {
        const totalDebt = parseFloat(document.getElementById('total-debt-advanced').value) || 0;
        const interestRate = parseFloat(document.getElementById('interest-rate-advanced').value) || 0;
        const monthlyPayment = parseFloat(document.getElementById('monthly-payment-advanced').value) || 0;
        const extraPayment = parseFloat(document.getElementById('extra-payment').value) || 0;
        
        if (totalDebt <= 0 || monthlyPayment <= 0) {
            showToast('⚠️ Ingresa valores válidos para calcular', 'warning');
            return;
        }
        
        const totalMonthlyPayment = monthlyPayment + extraPayment;
        const monthlyRate = interestRate / 100 / 12;
        
        const strategy = userPreferences.debtStrategy;
        const result = calculateDebtPayoff(totalDebt, monthlyRate, totalMonthlyPayment, strategy);
        
        document.getElementById('payoff-time-advanced').textContent = `${result.years} años`;
        document.getElementById('total-interest-advanced').textContent = `$${Math.round(result.totalInterest).toLocaleString()}`;
        
        const minPaymentResult = calculateDebtPayoff(totalDebt, monthlyRate, monthlyPayment, strategy);
        const interestSavings = minPaymentResult.totalInterest - result.totalInterest;
        
        document.getElementById('interest-savings').textContent = `$${Math.round(interestSavings).toLocaleString()}`;
        
        const progressBar = document.querySelector('.timeline-progress');
        if (progressBar) {
            const progressPercentage = Math.min(100, (result.months / (result.months + 12)) * 100);
            progressBar.style.width = `${progressPercentage}%`;
            progressBar.style.transition = 'width 1s ease';
        }
        
        animateDebtResults();
    }
    
    function calculateDebtPayoff(debt, monthlyRate, monthlyPayment, strategy) {
        let remainingDebt = debt;
        let months = 0;
        let totalInterest = 0;
        
        while (remainingDebt > 0 && months < 600) {
            const interest = remainingDebt * monthlyRate;
            const principal = monthlyPayment - interest;
            
            if (principal <= 0) {
                months = 600;
                break;
            }
            
            remainingDebt -= principal;
            totalInterest += interest;
            months++;
            
            if (remainingDebt < 0) {
                totalInterest -= (remainingDebt * -1);
                break;
            }
        }
        
        return {
            years: (months / 12).toFixed(1),
            months: months,
            totalInterest: totalInterest
        };
    }
    
    function animateDebtResults() {
        const results = document.querySelectorAll('.timeline-stat span:last-child');
        results.forEach(result => {
            result.style.transform = 'scale(1.1)';
            result.style.color = 'var(--gold-primary)';
            setTimeout(() => {
                result.style.transform = 'scale(1)';
                setTimeout(() => {
                    result.style.color = '';
                }, 500);
            }, 150);
        });
    }
    
    function calculateSavingsAdvanced() {
        const savingsTarget = parseFloat(document.getElementById('savings-target-advanced').value) || 0;
        const savingsMonths = parseFloat(document.getElementById('savings-months-advanced').value) || 0;
        const savingsRate = parseFloat(document.getElementById('savings-rate-advanced').value) || 0;
        
        if (savingsTarget <= 0 || savingsMonths <= 0) {
            showToast('⚠️ Ingresa valores válidos para calcular', 'warning');
            return;
        }
        
        const monthlyRate = savingsRate / 100 / 12;
        
        let monthlySavings, totalSaved, interestEarned;
        
        if (monthlyRate === 0) {
            monthlySavings = savingsTarget / savingsMonths;
            totalSaved = monthlySavings * savingsMonths;
            interestEarned = 0;
        } else {
            monthlySavings = savingsTarget * monthlyRate / (Math.pow(1 + monthlyRate, savingsMonths) - 1);
            totalSaved = monthlySavings * savingsMonths;
            interestEarned = savingsTarget - totalSaved;
        }
        
        document.getElementById('monthly-savings-advanced').textContent = `$${monthlySavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('total-saved-advanced').textContent = `$${Math.round(totalSaved).toLocaleString()}`;
        document.getElementById('interest-earned-advanced').textContent = `$${Math.round(interestEarned).toLocaleString()}`;
        
        animateSavingsResults();
    }
    
    function animateSavingsResults() {
        const results = document.querySelectorAll('.result-item span:last-child');
        results.forEach(result => {
            result.style.transform = 'scale(1.1)';
            result.style.color = 'var(--gold-primary)';
            setTimeout(() => {
                result.style.transform = 'scale(1)';
                setTimeout(() => {
                    result.style.color = 'var(--gold-light)';
                }, 500);
            }, 150);
        });
    }

    function initDebtStrategies() {
        strategySelectBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const strategy = this.dataset.strategy;
                
                strategySelectBtns.forEach(b => {
                    b.classList.remove('active');
                    b.textContent = 'Seleccionar';
                    b.style.transform = 'scale(1)';
                });
                
                this.classList.add('active');
                this.textContent = 'Seleccionado ✓';
                this.style.transform = 'scale(1.05)';
                
                userPreferences.debtStrategy = strategy;
                localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    
                calculateDebtAdvanced();
                
                showToast(`⚡ Estrategia "${strategy === 'snowball' ? 'Bola de Nieve' : 'Avalancha'}" seleccionada`, 'success');
            });
        });
    }
    
    function initModals() {
        if (addBudgetBtn) {
            addBudgetBtn.addEventListener('click', () => showModal(budgetModal));
        }
        
        if (resetBudgetBtn) {
            resetBudgetBtn.addEventListener('click', () => {
                showConfirmation(
                    '¿Reiniciar presupuesto mensual?',
                    'Esta acción restablecerá todos los gastos a cero para el nuevo mes.',
                    resetBudget
                );
            });
        }
        
        if (addGoalBtn) {
            addGoalBtn.addEventListener('click', () => showModal(goalModal));
        }
        
        closeModals.forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                hideModal(modal);
            });
        });
        
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                hideModal(e.target);
            }
        });
        
        initForms();
    }
    
    function showModal(modal) {
        if (!modal) return;
        
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal(modal) {
        if (!modal) return;
        
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    function showConfirmation(title, message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <div class="modal-body">
                    <p>${message}</p>
                    <div class="form-actions">
                        <button class="cancel-btn">Cancelar</button>
                        <button class="submit-btn confirm-btn">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        showModal(modal);
        
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            hideModal(modal);
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        modal.querySelector('.confirm-btn').addEventListener('click', () => {
            onConfirm();
            hideModal(modal);
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
    }
    
    function showDeleteConfirmation(itemName, onConfirm) {
        showConfirmation(
            'Eliminar Elemento',
            `¿Estás seguro de que quieres eliminar "${itemName}"? Esta acción no se puede deshacer.`,
            onConfirm
        );
    }
    
    function initForms() {
        const budgetForm = document.getElementById('new-budget-form');
        if (budgetForm) {
            budgetForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const categoryName = document.getElementById('category-name').value;
                const categoryBudget = parseFloat(document.getElementById('category-budget').value);
                const expenseType = document.getElementById('expense-type').value;
                
                if (!categoryName || categoryBudget <= 0) {
                    showToast('⚠️ Ingresa valores válidos', 'warning');
                    return;
                }
                
                const newCategory = {
                    id: `custom-${Date.now()}`,
                    name: categoryName,
                    budget: categoryBudget,
                    type: expenseType,
                    icon: getCategoryIcon(expenseType),
                    spent: 0
                };
                
                budgetCategories.push(newCategory);
                localStorage.setItem('budgetCategories', JSON.stringify(budgetCategories));
                
                addBudgetCategoryToDOM(newCategory);
                updateBudgetSummary();
                hideModal(budgetModal);
                budgetForm.reset();
                
                showToast('✅ Categoría agregada exitosamente', 'success');
            });
        }
        
        const goalForm = document.getElementById('new-goal-form');
        if (goalForm) {
            goalForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const goalName = document.getElementById('goal-name').value;
                const goalTarget = parseFloat(document.getElementById('goal-target').value);
                const goalMonths = parseInt(document.getElementById('goal-months').value);
                const goalMonthly = parseFloat(document.getElementById('goal-monthly').value);
                
                if (!goalName || goalTarget <= 0 || goalMonths <= 0 || goalMonthly <= 0) {
                    showToast('⚠️ Ingresa valores válidos', 'warning');
                    return;
                }
                
                const newGoal = {
                    id: `custom-${Date.now()}`,
                    name: goalName,
                    description: 'Meta personal de ahorro',
                    target: goalTarget,
                    current: 0,
                    monthly: goalMonthly
                };
                
                savingsGoals.push(newGoal);
                localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
                
                addSavingsGoalToDOM(newGoal);
                hideModal(goalModal);
                goalForm.reset();
                
                showToast('🎯 Meta de ahorro creada exitosamente', 'success');
            });
        }
    }
    
    function getCategoryIcon(type) {
        const iconMap = {
            'necesidad': '🏠',
            'deseo': '🎮',
            'ahorro': '💰'
        };
        return iconMap[type] || '📊';
    }
    
    function resetBudget() {
        budgetCategories.forEach(category => {
            category.spent = 0;
        });
        localStorage.setItem('budgetCategories', JSON.stringify(budgetCategories));
        loadBudgetCategories();
        updateBudgetSummary();
        showToast('🔄 Presupuesto reiniciado para el nuevo mes', 'success');
    }
    
    function initAdvancedInteractivity() {
        initHoverEffects();
        initScrollAnimations();
        initTooltips();
    }
    
    function initHoverEffects() {
        const interactiveElements = document.querySelectorAll(
            '.metric-card, .overview-card, .budget-category, .savings-goal-card, ' +
            '.strategy-option, .module-card, .tool-card-advanced, .result-card, .insight-card'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 12px 30px rgba(212, 175, 55, 0.15)';
                this.style.zIndex = '10';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
                this.style.zIndex = '';
            });
        });
    }
    
    function initScrollAnimations() {
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
        
        const animatedElements = document.querySelectorAll(
            '.metric-card, .overview-card, .budget-category, .savings-goal-card, ' +
            '.strategy-option, .module-card, .tool-card-advanced, .result-card, .insight-card'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltipText;
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--premium-bg);
                    color: var(--white);
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    z-index: 1000;
                    white-space: nowrap;
                    pointer-events: none;
                    transform: translateY(-100%) translateX(-50%);
                    left: 50%;
                    top: -10px;
                    border: 1px solid var(--gold-primary);
                `;
                
                this.appendChild(tooltip);
            });
            
            element.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.tooltip');
                if (tooltip) {
                    this.removeChild(tooltip);
                }
            });
        });
    }
    
    function initToastSystem() {
        window.showToast = function(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: var(--white);
                z-index: 3000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                border: 1px solid var(--gold-primary);
            `;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        };
    }
    
    function simulateRealTimeUpdates() {
        setInterval(() => {
            if (Math.random() > 0.7) {
                const metricCards = document.querySelectorAll('.metric-card');
                const randomCard = metricCards[Math.floor(Math.random() * metricCards.length)];
                
                if (randomCard) {
                    randomCard.style.animation = 'pulse 0.5s ease';
                    setTimeout(() => {
                        randomCard.style.animation = '';
                    }, 500);
                }
            }
        }, 10000);
    }
    
    simulateRealTimeUpdates();
    
    console.log('✅ Sistema de Finanzas Personales inicializado correctamente');
    console.log('💾 Datos cargados del localStorage:', {
        budgetCategories: budgetCategories.length,
        savingsGoals: savingsGoals.length,
        userPreferences
    });
});