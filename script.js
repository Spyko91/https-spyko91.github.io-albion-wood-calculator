// Configuration et données pour Albion Wood Calculator
// Version avec correction CORS et multiples sources

// ==================== CONFIGURATION ====================
const CONFIG = {
    // Liste de proxies CORS (pour contourner les blocages)
    corsProxies: [
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/',
        'https://proxy.cors.sh/',
        '' // Direct (pour test)
    ],
    
    // Différents endpoints API (au cas où)
    apiEndpoints: [
        'https://www.albion-online-data.com/api/v2/stats/prices/',
        'https://europe.albion-online-data.com/api/v2/stats/prices/',
        'https://west.albion-online-data.com/api/v2/stats/prices/'
    ],
    
    // Villes disponibles
    cities: {
        'Thetford': 'Thetford',
        'Lymhurst': 'Lymhurst',
        'Bridgewatch': 'Bridgewatch',
        'Martlock': 'Martlock',
        'Fort Sterling': 'Fort Sterling',
        'Caerleon': 'Caerleon',
        'Brecilien': 'Brecilien'
    },
    
    // Mapping des IDs d'items (format corrigé pour l'API)
    itemIds: {
        'T2_WOOD': { log: 'T2_WOOD', plank: 'T2_PLANKS' },
        'T3_WOOD': { log: 'T3_WOOD', plank: 'T3_PLANKS' },
        'T4_WOOD': { log: 'T4_WOOD', plank: 'T4_PLANKS' },
        'T4_WOOD_LEVEL1': { log: 'T4_WOOD@1', plank: 'T4_PLANKS@1' },
        'T4_WOOD_LEVEL2': { log: 'T4_WOOD@2', plank: 'T4_PLANKS@2' },
        'T4_WOOD_LEVEL3': { log: 'T4_WOOD@3', plank: 'T4_PLANKS@3' },
        'T5_WOOD': { log: 'T5_WOOD', plank: 'T5_PLANKS' },
        'T5_WOOD_LEVEL1': { log: 'T5_WOOD@1', plank: 'T5_PLANKS@1' },
        'T5_WOOD_LEVEL2': { log: 'T5_WOOD@2', plank: 'T5_PLANKS@2' },
        'T5_WOOD_LEVEL3': { log: 'T5_WOOD@3', plank: 'T5_PLANKS@3' },
        'T6_WOOD': { log: 'T6_WOOD', plank: 'T6_PLANKS' },
        'T6_WOOD_LEVEL1': { log: 'T6_WOOD@1', plank: 'T6_PLANKS@1' },
        'T6_WOOD_LEVEL2': { log: 'T6_WOOD@2', plank: 'T6_PLANKS@2' },
        'T6_WOOD_LEVEL3': { log: 'T6_WOOD@3', plank: 'T6_PLANKS@3' },
        'T7_WOOD': { log: 'T7_WOOD', plank: 'T7_PLANKS' },
        'T7_WOOD_LEVEL1': { log: 'T7_WOOD@1', plank: 'T7_PLANKS@1' },
        'T7_WOOD_LEVEL2': { log: 'T7_WOOD@2', plank: 'T7_PLANKS@2' },
        'T7_WOOD_LEVEL3': { log: 'T7_WOOD@3', plank: 'T7_PLANKS@3' },
        'T8_WOOD': { log: 'T8_WOOD', plank: 'T8_PLANKS' },
        'T8_WOOD_LEVEL1': { log: 'T8_WOOD@1', plank: 'T8_PLANKS@1' },
        'T8_WOOD_LEVEL2': { log: 'T8_WOOD@2', plank: 'T8_PLANKS@2' },
        'T8_WOOD_LEVEL3': { log: 'T8_WOOD@3', plank: 'T8_PLANKS@3' }
    }
};

// ==================== DONNÉES DU BOIS ====================
const woodData = [
    // T2
    { tier: 'T2', enchant: '.0', itemId: 'T2_WOOD', quantity: 1 },
    // T3
    { tier: 'T3', enchant: '.0', itemId: 'T3_WOOD', quantity: 2 },
    // T4
    { tier: 'T4', enchant: '.0', itemId: 'T4_WOOD', quantity: 2 },
    { tier: 'T4', enchant: '.1', itemId: 'T4_WOOD_LEVEL1', quantity: 2 },
    { tier: 'T4', enchant: '.2', itemId: 'T4_WOOD_LEVEL2', quantity: 2 },
    { tier: 'T4', enchant: '.3', itemId: 'T4_WOOD_LEVEL3', quantity: 2 },
    // T5
    { tier: 'T5', enchant: '.0', itemId: 'T5_WOOD', quantity: 3 },
    { tier: 'T5', enchant: '.1', itemId: 'T5_WOOD_LEVEL1', quantity: 3 },
    { tier: 'T5', enchant: '.2', itemId: 'T5_WOOD_LEVEL2', quantity: 3 },
    { tier: 'T5', enchant: '.3', itemId: 'T5_WOOD_LEVEL3', quantity: 3 },
    // T6
    { tier: 'T6', enchant: '.0', itemId: 'T6_WOOD', quantity: 4 },
    { tier: 'T6', enchant: '.1', itemId: 'T6_WOOD_LEVEL1', quantity: 4 },
    { tier: 'T6', enchant: '.2', itemId: 'T6_WOOD_LEVEL2', quantity: 4 },
    { tier: 'T6', enchant: '.3', itemId: 'T6_WOOD_LEVEL3', quantity: 4 },
    // T7
    { tier: 'T7', enchant: '.0', itemId: 'T7_WOOD', quantity: 5 },
    { tier: 'T7', enchant: '.1', itemId: 'T7_WOOD_LEVEL1', quantity: 5 },
    { tier: 'T7', enchant: '.2', itemId: 'T7_WOOD_LEVEL2', quantity: 5 },
    { tier: 'T7', enchant: '.3', itemId: 'T7_WOOD_LEVEL3', quantity: 5 },
    // T8
    { tier: 'T8', enchant: '.0', itemId: 'T8_WOOD', quantity: 5 },
    { tier: 'T8', enchant: '.1', itemId: 'T8_WOOD_LEVEL1', quantity: 5 },
    { tier: 'T8', enchant: '.2', itemId: 'T8_WOOD_LEVEL2', quantity: 5 },
    { tier: 'T8', enchant: '.3', itemId: 'T8_WOOD_LEVEL3', quantity: 5 }
];

// ==================== PRIX DE SECOURS ====================
const FALLBACK_PRICES = {
    'T2_WOOD': { log: 149, plank: 298 },
    'T3_WOOD': { log: 299, plank: 897 },
    'T4_WOOD': { log: 848, plank: 2544 },
    'T4_WOOD_LEVEL1': { log: 2544, plank: 7632 },
    'T4_WOOD_LEVEL2': { log: 7632, plank: 22896 },
    'T4_WOOD_LEVEL3': { log: 22896, plank: 68688 },
    'T5_WOOD': { log: 2544, plank: 7632 },
    'T5_WOOD_LEVEL1': { log: 7632, plank: 22896 },
    'T5_WOOD_LEVEL2': { log: 22896, plank: 68688 },
    'T5_WOOD_LEVEL3': { log: 68688, plank: 206064 },
    'T6_WOOD': { log: 7632, plank: 22896 },
    'T6_WOOD_LEVEL1': { log: 22896, plank: 68688 },
    'T6_WOOD_LEVEL2': { log: 68688, plank: 206064 },
    'T6_WOOD_LEVEL3': { log: 206064, plank: 618192 },
    'T7_WOOD': { log: 22896, plank: 68688 },
    'T7_WOOD_LEVEL1': { log: 68688, plank: 206064 },
    'T7_WOOD_LEVEL2': { log: 206064, plank: 618192 },
    'T7_WOOD_LEVEL3': { log: 618192, plank: 1854576 },
    'T8_WOOD': { log: 68688, plank: 206064 },
    'T8_WOOD_LEVEL1': { log: 206064, plank: 618192 },
    'T8_WOOD_LEVEL2': { log: 618192, plank: 1854576 },
    'T8_WOOD_LEVEL3': { log: 1854576, plank: 5563728 }
};

// ==================== CLASSES CSS ====================
const enchantClasses = {
    '.0': 'enchant-0',
    '.1': 'enchant-1',
    '.2': 'enchant-2',
    '.3': 'enchant-3'
};

// ==================== ÉTAT DE L'APPLICATION ====================
let currentPrices = {};
let selectedCity = 'Thetford';
let useFallback = false;
let apiStatus = {
    lastAttempt: null,
    success: false,
    message: ''
};

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation du calculateur de bois...');
    
    // Afficher un message d'attente
    showStatus('Initialisation...', 'info');
    
    // Rendre le tableau
    renderTable();
    
    // Attacher les événements
    attachEventListeners();
    
    // Ajouter la légende
    addEnchantLegend();
    
    // Charger les prix
    initializePrices();
});

// ==================== INITIALISATION DES PRIX ====================
async function initializePrices() {
    showLoading(true);
    showStatus('Tentative de connexion à l\'API Albion...', 'info');
    
    try {
        // Essayer de charger les prix depuis l'API
        await fetchAllPrices();
        useFallback = false;
        showStatus('✓ Prix chargés depuis l\'API Albion', 'success');
    } catch (error) {
        console.warn('⚠️ API inaccessible, utilisation des prix de secours:', error);
        useFallback = true;
        loadFallbackPrices();
        showStatus('⚠️ API momentanément indisponible - Prix de référence affichés', 'warning');
    } finally {
        showLoading(false);
    }
}

// ==================== AFFICHAGE DES STATUTS ====================
function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('api-status') || createStatusDiv();
    statusDiv.textContent = message;
    statusDiv.className = `api-status ${type}`;
    
    // Styles pour les messages de statut
    const style = document.createElement('style');
    style.textContent = `
        .api-status {
            padding: 12px 16px;
            border-radius: 8px;
            margin: 15px 0;
            font-weight: 500;
            text-align: center;
            animation: slideIn 0.3s ease;
        }
        .api-status.info {
            background: #2b3b4b;
            border-left: 4px solid #3b9eff;
            color: #b0e0ff;
        }
        .api-status.success {
            background: #1e3a2a;
            border-left: 4px solid #4caf50;
            color: #a5d6a5;
        }
        .api-status.warning {
            background: #4a3a1a;
            border-left: 4px solid #ffc107;
            color: #ffd966;
        }
        .api-status.error {
            background: #4a1e1e;
            border-left: 4px solid #f44336;
            color: #ffaaaa;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

function createStatusDiv() {
    const header = document.querySelector('header');
    const statusDiv = document.createElement('div');
    statusDiv.id = 'api-status';
    header.appendChild(statusDiv);
    return statusDiv;
}

// ==================== CHARGEMENT DES PRIX DE SECOURS ====================
function loadFallbackPrices() {
    showLoading(true);
    
    setTimeout(() => {
        woodData.forEach(item => {
            const fallback = FALLBACK_PRICES[item.itemId];
            if (fallback) {
                if (!currentPrices[item.itemId]) currentPrices[item.itemId] = {};
                currentPrices[item.itemId].log = fallback.log;
                currentPrices[item.itemId].plank = fallback.plank;
            }
        });
        
        // Mettre à jour l'affichage
        updateAllInputsFromCurrentPrices();
        
        const updateTime = document.getElementById('updateTime');
        if (updateTime) {
            updateTime.textContent = new Date().toLocaleTimeString('fr-FR') + ' (prix de référence)';
        }
        
        showLoading(false);
    }, 500);
}

// ==================== RENDU DU TABLEAU ====================
function renderTable() {
    const tbody = document.getElementById('table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    woodData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = `tier-${item.tier}`;
        
        const enchantClass = enchantClasses[item.enchant] || '';
        
        const logPrice = currentPrices[item.itemId]?.log || '';
        const plankPrice = currentPrices[item.itemId]?.plank || '';
        const totalCost = logPrice ? logPrice * item.quantity : '';
        const profit = (logPrice && plankPrice) ? plankPrice - totalCost : '';
        const margin = (logPrice && plankPrice && totalCost > 0) ? ((profit / totalCost) * 100).toFixed(1) : '';
        
        row.innerHTML = `
            <td><strong>${item.tier}</strong></td>
            <td class="${enchantClass}"><strong>${item.enchant}</strong></td>
            <td>${item.quantity}</td>
            <td><input type="number" class="price-input" data-index="${index}" data-type="log" value="${logPrice || ''}" placeholder="0" step="1" min="0"></td>
            <td class="total-cost" data-index="${index}">${totalCost ? totalCost.toLocaleString() : '-'}</td>
            <td><input type="number" class="price-input" data-index="${index}" data-type="plank" value="${plankPrice || ''}" placeholder="0" step="1" min="0"></td>
            <td class="margin ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}" data-index="${index}">${margin ? margin + '%' : '-'}</td>
            <td class="profit ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}" data-index="${index}">${profit ? profit.toLocaleString() : '-'}</td>
            <td><button class="btn-small update-row" data-index="${index}" ${useFallback ? 'disabled' : ''}>↺</button></td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Attacher les événements
    document.querySelectorAll('.price-input').forEach(input => {
        input.addEventListener('change', updateCalculations);
    });
    
    document.querySelectorAll('.update-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            if (useFallback) {
                showStatus('Mode démo : modification manuelle uniquement', 'warning');
                setTimeout(() => showStatus('', 'info'), 3000);
            } else {
                updateSingleRow(index);
            }
        });
    });
    
    updateTotalProfit();
}

// ==================== MISE À JOUR DES CALCULS ====================
function updateCalculations() {
    const index = this.dataset.index;
    const type = this.dataset.type;
    const value = parseFloat(this.value) || 0;
    
    const item = woodData[index];
    const key = item.itemId;
    
    if (!currentPrices[key]) {
        currentPrices[key] = {};
    }
    
    currentPrices[key][type] = value;
    
    const logPrice = currentPrices[key]?.log || 0;
    const plankPrice = currentPrices[key]?.plank || 0;
    const totalCost = logPrice * item.quantity;
    const profit = plankPrice - totalCost;
    const margin = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : '';
    
    const totalCostCell = document.querySelector(`.total-cost[data-index="${index}"]`);
    if (totalCostCell) {
        totalCostCell.textContent = totalCost ? totalCost.toLocaleString() : '-';
    }
    
    const marginCell = document.querySelector(`.margin[data-index="${index}"]`);
    if (marginCell) {
        marginCell.textContent = margin ? margin + '%' : '-';
        marginCell.className = `margin ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}`;
    }
    
    const profitCell = document.querySelector(`.profit[data-index="${index}"]`);
    if (profitCell) {
        profitCell.textContent = profit ? profit.toLocaleString() : '-';
        profitCell.className = `profit ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}`;
    }
    
    updateTotalProfit();
}

// ==================== MISE À JOUR D'UNE LIGNE ====================
async function updateSingleRow(index) {
    const item = woodData[index];
    const ids = CONFIG.itemIds[item.itemId];
    if (!ids) return;
    
    const itemIds = [ids.log, ids.plank];
    
    showLoading(true);
    showStatus(`Récupération des prix pour ${item.tier}${item.enchant}...`, 'info');
    
    try {
        const prices = await fetchPricesWithRetry(itemIds);
        
        if (prices && prices.length > 0) {
            let updated = false;
            
            const logPriceData = prices.find(p => p.item_id === ids.log);
            const plankPriceData = prices.find(p => p.item_id === ids.plank);
            
            if (logPriceData && logPriceData.sell_price_min && logPriceData.sell_price_min.length > 0) {
                const sellPriceMin = Math.min(...logPriceData.sell_price_min.map(p => p.Price));
                const logInput = document.querySelector(`input[data-index="${index}"][data-type="log"]`);
                if (logInput) {
                    logInput.value = sellPriceMin || 0;
                    updated = true;
                }
                if (!currentPrices[item.itemId]) currentPrices[item.itemId] = {};
                currentPrices[item.itemId].log = sellPriceMin || 0;
            }
            
            if (plankPriceData && plankPriceData.sell_price_min && plankPriceData.sell_price_min.length > 0) {
                const sellPriceMin = Math.min(...plankPriceData.sell_price_min.map(p => p.Price));
                const plankInput = document.querySelector(`input[data-index="${index}"][data-type="plank"]`);
                if (plankInput) {
                    plankInput.value = sellPriceMin || 0;
                    updated = true;
                }
                if (!currentPrices[item.itemId]) currentPrices[item.itemId] = {};
                currentPrices[item.itemId].plank = sellPriceMin || 0;
            }
            
            if (updated) {
                const logInput = document.querySelector(`input[data-index="${index}"][data-type="log"]`);
                const plankInput = document.querySelector(`input[data-index="${index}"][data-type="plank"]`);
                
                if (logInput) logInput.dispatchEvent(new Event('change'));
                if (plankInput) plankInput.dispatchEvent(new Event('change'));
                
                showStatus(`✓ Prix mis à jour pour ${item.tier}${item.enchant}`, 'success');
                setTimeout(() => showStatus('', 'info'), 2000);
            }
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        showStatus(`❌ Erreur: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

// ==================== RÉCUPÉRATION DE TOUS LES PRIX ====================
async function fetchAllPrices() {
    showLoading(true);
    showStatus('Connexion à l\'API Albion...', 'info');
    
    // Construire la liste des IDs uniques
    const allItemIds = [];
    const itemMap = {};
    
    woodData.forEach(item => {
        const ids = CONFIG.itemIds[item.itemId];
        if (ids) {
            if (!allItemIds.includes(ids.log)) {
                allItemIds.push(ids.log);
                itemMap[ids.log] = { itemId: item.itemId, type: 'log' };
            }
            if (!allItemIds.includes(ids.plank)) {
                allItemIds.push(ids.plank);
                itemMap[ids.plank] = { itemId: item.itemId, type: 'plank' };
            }
        }
    });
    
    try {
        const prices = await fetchPricesWithRetry(allItemIds);
        
        if (prices && prices.length > 0) {
            let count = 0;
            
            prices.forEach(priceData => {
                const itemInfo = itemMap[priceData.item_id];
                if (itemInfo && priceData.sell_price_min && priceData.sell_price_min.length > 0) {
                    const sellPriceMin = Math.min(...priceData.sell_price_min.map(p => p.Price));
                    
                    if (!currentPrices[itemInfo.itemId]) {
                        currentPrices[itemInfo.itemId] = {};
                    }
                    
                    currentPrices[itemInfo.itemId][itemInfo.type] = sellPriceMin || 0;
                    count++;
                }
            });
            
            // Mettre à jour tous les inputs
            updateAllInputsFromCurrentPrices();
            
            const updateTime = document.getElementById('updateTime');
            if (updateTime) {
                updateTime.textContent = new Date().toLocaleTimeString('fr-FR');
            }
            
            showStatus(`✓ ${count} prix récupérés avec succès`, 'success');
            setTimeout(() => showStatus('', 'info'), 3000);
            
            return prices;
        } else {
            throw new Error('Aucune donnée reçue');
        }
    } catch (error) {
        console.error('Erreur fetchAllPrices:', error);
        showStatus(`❌ Échec de connexion à l'API: ${error.message}`, 'error');
        throw error;
    } finally {
        showLoading(false);
    }
}

// ==================== REQUÊTE API AVEC RETRY ET PROXY ====================
async function fetchPricesWithRetry(itemIds, maxRetries = 3) {
    const itemsParam = itemIds.join(',');
    const cityParam = CONFIG.cities[selectedCity] || 'Thetford';
    
    let lastError = null;
    
    // Essayer différentes combinaisons proxy/endpoint
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        for (const proxy of CONFIG.corsProxies) {
            for (const endpoint of CONFIG.apiEndpoints) {
                try {
                    const apiUrl = `${endpoint}${itemsParam}?locations=${cityParam}&qualities=1`;
                    const finalUrl = proxy ? proxy + encodeURIComponent(apiUrl) : apiUrl;
                    
                    console.log(`Tentative ${attempt + 1}:`, finalUrl);
                    
                    const response = await fetch(finalUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        },
                        mode: 'cors',
                        cache: 'no-cache'
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.length > 0) {
                            return data;
                        }
                    }
                } catch (e) {
                    lastError = e;
                    console.log('Échec avec:', proxy, endpoint, e.message);
                }
            }
        }
        
        // Attendre un peu avant de réessayer
        if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    throw new Error('Impossible de contacter l\'API après plusieurs tentatives');
}

// ==================== MISE À JOUR DE TOUS LES INPUTS ====================
function updateAllInputsFromCurrentPrices() {
    woodData.forEach((item, index) => {
        if (currentPrices[item.itemId]) {
            const logInput = document.querySelector(`input[data-index="${index}"][data-type="log"]`);
            if (logInput && currentPrices[item.itemId].log) {
                logInput.value = currentPrices[item.itemId].log;
            }
            
            const plankInput = document.querySelector(`input[data-index="${index}"][data-type="plank"]`);
            if (plankInput && currentPrices[item.itemId].plank) {
                plankInput.value = currentPrices[item.itemId].plank;
            }
        }
    });
    
    // Recalculer toutes les lignes
    document.querySelectorAll('.price-input').forEach(input => {
        input.dispatchEvent(new Event('change'));
    });
}

// ==================== TOTAL DES PROFITS ====================
function updateTotalProfit() {
    let total = 0;
    
    woodData.forEach((item, index) => {
        const profitCell = document.querySelector(`.profit[data-index="${index}"]`);
        if (profitCell) {
            const profitText = profitCell.textContent.replace(/\s/g, '');
            if (profitText !== '-') {
                const profit = parseFloat(profitText) || 0;
                if (profit > 0) total += profit;
            }
        }
    });
    
    const totalElement = document.getElementById('total-profit');
    if (totalElement) {
        totalElement.textContent = total.toLocaleString();
    }
}

// ==================== UTILITAIRES UI ====================
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

function showLoadingSpinner() {
    showLoading(true);
}

function hideLoadingSpinner() {
    showLoading(false);
}

// ==================== LÉGENDE DES ENCHANTEMENTS ====================
function addEnchantLegend() {
    const infoPanel = document.querySelector('.info-panel');
    if (infoPanel) {
        // Vérifier si la légende existe déjà
        if (document.querySelector('.enchant-legend')) return;
        
        const legend = document.createElement('div');
        legend.className = 'enchant-legend';
        legend.innerHTML = `
            <div class="legend-item">
                <div class="legend-color enchant-0-bg"></div>
                <span>.0 - Normal</span>
            </div>
            <div class="legend-item">
                <div class="legend-color enchant-1-bg"></div>
                <span>.1 - Peu commun</span>
            </div>
            <div class="legend-item">
                <div class="legend-color enchant-2-bg"></div>
                <span>.2 - Rare</span>
            </div>
            <div class="legend-item">
                <div class="legend-color enchant-3-bg"></div>
                <span>.3 - Exceptionnel</span>
            </div>
        `;
        infoPanel.appendChild(legend);
    }
}

// ==================== ÉVÉNEMENTS ====================
function attachEventListeners() {
    const refreshBtn = document.getElementById('refreshPrices');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            if (useFallback) {
                // Essayer de se reconnecter à l'API
                useFallback = false;
                showStatus('Tentative de reconnexion à l\'API...', 'info');
                try {
                    await fetchAllPrices();
                    showStatus('✓ Reconnexion réussie !', 'success');
                } catch (error) {
                    useFallback = true;
                    showStatus('⚠️ API toujours inaccessible - Mode démo actif', 'warning');
                }
            } else {
                await fetchAllPrices();
            }
        });
    }
    
    const citySelect = document.getElementById('city');
    if (citySelect) {
        citySelect.addEventListener('change', (e) => {
            selectedCity = e.target.value;
            if (!useFallback) {
                fetchAllPrices().catch(() => {
                    useFallback = true;
                    loadFallbackPrices();
                });
            }
        });
    }
}
