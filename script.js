// Données du tableau
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

// Configuration des couleurs par enchantement
const enchantClasses = {
    '.0': 'enchant-0',
    '.1': 'enchant-1',
    '.2': 'enchant-2',
    '.3': 'enchant-3'
};

// État de l'application
let currentPrices = {};
let selectedCity = 'Thetford';
let selectedServer = 'Europe';

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    attachEventListeners();
    fetchAllPrices();
    
    // Ajouter la légende des enchantements
    addEnchantLegend();
});

// Ajouter la légende
function addEnchantLegend() {
    const infoPanel = document.querySelector('.info-panel');
    if (infoPanel) {
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

// Rendre le tableau HTML
function renderTable() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    
    woodData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = `tier-${item.tier}`;
        
        // Ajouter la classe d'enchantement à la cellule enchant
        const enchantClass = enchantClasses[item.enchant] || '';
        
        // Prix actuels ou vides
        const logPrice = currentPrices[item.itemId]?.log || '';
        const plankPrice = currentPrices[item.itemId]?.plank || '';
        const totalCost = logPrice ? logPrice * item.quantity : '';
        const profit = (logPrice && plankPrice) ? plankPrice - totalCost : '';
        const margin = (logPrice && plankPrice && totalCost > 0) ? ((profit / totalCost) * 100).toFixed(1) : '';
        
        row.innerHTML = `
            <td><strong>${item.tier}</strong></td>
            <td class="${enchantClass}"><strong>${item.enchant}</strong></td>
            <td>${item.quantity}</td>
            <td><input type="number" class="price-input" data-index="${index}" data-type="log" value="${logPrice || ''}" placeholder="0" step="1"></td>
            <td class="total-cost" data-index="${index}">${totalCost ? totalCost.toLocaleString() : '-'}</td>
            <td><input type="number" class="price-input" data-index="${index}" data-type="plank" value="${plankPrice || ''}" placeholder="0" step="1"></td>
            <td class="margin ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}" data-index="${index}">${margin ? margin + '%' : '-'}</td>
            <td class="profit ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}" data-index="${index}">${profit ? profit.toLocaleString() : '-'}</td>
            <td><button class="btn-small update-row" data-index="${index}">↺</button></td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Attacher les événements aux inputs
    document.querySelectorAll('.price-input').forEach(input => {
        input.addEventListener('change', updateCalculations);
    });
    
    document.querySelectorAll('.update-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            updateSingleRow(index);
        });
    });
    
    updateTotalProfit();
}

// Mettre à jour les calculs pour une ligne
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
    
    // Recalculer la ligne
    const logPrice = currentPrices[key]?.log || 0;
    const plankPrice = currentPrices[key]?.plank || 0;
    const totalCost = logPrice * item.quantity;
    const profit = plankPrice - totalCost;
    const margin = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : '';
    
    // Mettre à jour les cellules
    document.querySelector(`.total-cost[data-index="${index}"]`).textContent = totalCost ? totalCost.toLocaleString() : '-';
    
    const marginCell = document.querySelector(`.margin[data-index="${index}"]`);
    marginCell.textContent = margin ? margin + '%' : '-';
    marginCell.className = `margin ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}`;
    
    const profitCell = document.querySelector(`.profit[data-index="${index}"]`);
    profitCell.textContent = profit ? profit.toLocaleString() : '-';
    profitCell.className = `profit ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}`;
    
    updateTotalProfit();
}

// Mettre à jour une ligne spécifique avec l'API
async function updateSingleRow(index) {
    const item = woodData[index];
    const itemIds = [CONFIG.itemIds[item.itemId].log, CONFIG.itemIds[item.itemId].plank];
    
    showLoading();
    
    try {
        const prices = await fetchPricesForItems(itemIds);
        
        if (prices && prices.length > 0) {
            // Traiter les prix retournés
            const logPriceData = prices.find(p => p.item_id === CONFIG.itemIds[item.itemId].log);
            const plankPriceData = prices.find(p => p.item_id === CONFIG.itemIds[item.itemId].plank);
            
            if (logPriceData) {
                const sellPriceMin = Math.min(...logPriceData.sell_price_min.map(p => p.Price));
                document.querySelector(`input[data-index="${index}"][data-type="log"]`).value = sellPriceMin || 0;
                currentPrices[item.itemId] = currentPrices[item.itemId] || {};
                currentPrices[item.itemId].log = sellPriceMin || 0;
            }
            
            if (plankPriceData) {
                const sellPriceMin = Math.min(...plankPriceData.sell_price_min.map(p => p.Price));
                document.querySelector(`input[data-index="${index}"][data-type="plank"]`).value = sellPriceMin || 0;
                if (!currentPrices[item.itemId]) currentPrices[item.itemId] = {};
                currentPrices[item.itemId].plank = sellPriceMin || 0;
            }
            
            // Forcer le recalcul
            const logInput = document.querySelector(`input[data-index="${index}"][data-type="log"]`);
            const plankInput = document.querySelector(`input[data-index="${index}"][data-type="plank"]`);
            
            if (logInput) logInput.dispatchEvent(new Event('change'));
            if (plankInput) plankInput.dispatchEvent(new Event('change'));
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Erreur lors de la récupération des prix');
    } finally {
        hideLoading();
    }
}

// Récupérer tous les prix depuis l'API
async function fetchAllPrices() {
    showLoading();
    
    // Construire la liste de tous les items uniques
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
        const prices = await fetchPricesForItems(allItemIds);
        
        // Organiser les prix par item
        prices.forEach(priceData => {
            const itemInfo = itemMap[priceData.item_id];
            if (itemInfo) {
                // Prendre le prix minimum de vente (sell order)
                const sellPriceMin = Math.min(...priceData.sell_price_min.map(p => p.Price));
                
                if (!currentPrices[itemInfo.itemId]) {
                    currentPrices[itemInfo.itemId] = {};
                }
                
                currentPrices[itemInfo.itemId][itemInfo.type] = sellPriceMin || 0;
            }
        });
        
        // Mettre à jour l'affichage
        woodData.forEach((item, index) => {
            if (currentPrices[item.itemId]) {
                if (currentPrices[item.itemId].log) {
                    const logInput = document.querySelector(`input[data-index="${index}"][data-type="log"]`);
                    if (logInput) logInput.value = currentPrices[item.itemId].log;
                }
                if (currentPrices[item.itemId].plank) {
                    const plankInput = document.querySelector(`input[data-index="${index}"][data-type="plank"]`);
                    if (plankInput) plankInput.value = currentPrices[item.itemId].plank;
                }
            }
        });
        
        // Forcer le recalcul de toutes les lignes
        document.querySelectorAll('.price-input').forEach(input => {
            input.dispatchEvent(new Event('change'));
        });
        
        // Mettre à jour l'heure
        document.getElementById('updateTime').textContent = new Date().toLocaleTimeString('fr-FR');
        
    } catch (error) {
        console.error('Erreur fetchAllPrices:', error);
        alert('Erreur lors de la récupération des prix. Veuillez réessayer.');
    } finally {
        hideLoading();
    }
}

// Appel API générique
async function fetchPricesForItems(itemIds) {
    const itemsParam = itemIds.join(',');
    const cityParam = CONFIG.cities[selectedCity] || 'Thetford';
    const url = `${CONFIG.apiBaseUrl}${itemsParam}?locations=${cityParam}&qualities=1`;
    
    console.log('Fetching:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
}

// Mettre à jour le total des profits
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
    
    document.getElementById('total-profit').textContent = total.toLocaleString();
}

// UI Helpers
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Attacher les événements
function attachEventListeners() {
    document.getElementById('refreshPrices').addEventListener('click', fetchAllPrices);
    document.getElementById('city').addEventListener('change', (e) => {
        selectedCity = e.target.value;
        fetchAllPrices();
    });
    document.getElementById('server').addEventListener('change', (e) => {
        selectedServer = e.target.value;
        fetchAllPrices();
    });
}