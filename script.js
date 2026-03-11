// ============================================
// ÉTAT DE L'APPLICATION
// ============================================
let currentPrices = {};
let selectedCity = 'Thetford';
let selectedResource = 'wood';
let useFallback = false;
let currentResourceData = RESOURCES.wood;
let apiAttempts = 0;

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation...');
    showStatus('Initialisation...', 'info');
    loadResource('wood');
    attachEventListeners();
    initializePrices();
});

// ============================================
// CHARGEMENT D'UNE RESSOURCE
// ============================================
function loadResource(resourceKey) {
    selectedResource = resourceKey;
    currentResourceData = RESOURCES[resourceKey];
    document.querySelector('h1').innerHTML = `${currentResourceData.icon} Calculateur de ${currentResourceData.name} - Albion Online`;
    
    const citySelect = document.getElementById('city');
    if (citySelect) {
        const defaultCity = currentResourceData.city;
        const option = Array.from(citySelect.options).find(opt => opt.value === defaultCity);
        if (option) {
            citySelect.value = defaultCity;
            selectedCity = defaultCity;
        }
    }
    
    renderResourceTable();
    updateTabs();
}

// ============================================
// RENDU DU TABLEAU
// ============================================
function renderResourceTable() {
    const container = document.getElementById('table-container');
    if (!container) return;
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Tier</th>
                    <th>Enchant</th>
                    <th>Qté</th>
                    <th>Prix achat<br>(${currentResourceData.rawName})</th>
                    <th>Prix total</th>
                    <th>Prix vente<br>(${currentResourceData.refinedName})</th>
                    <th>Marge</th>
                    <th>Profit</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="resource-table-body">
    `;
    
    currentResourceData.items.forEach((item, index) => {
        const rawPrice = currentPrices[item.itemId]?.raw || '';
        const refinedPrice = currentPrices[item.itemId]?.refined || '';
        const totalCost = rawPrice ? rawPrice * item.quantity : '';
        const profit = (rawPrice && refinedPrice) ? refinedPrice - totalCost : '';
        const margin = (rawPrice && refinedPrice && totalCost > 0) ? ((profit / totalCost) * 100).toFixed(1) : '';
        const enchantClass = getEnchantClass(item.enchant);
        
        html += `
            <tr class="tier-${item.tier}">
                <td><strong>${item.tier}</strong></td>
                <td class="${enchantClass}"><strong>${item.enchant}</strong></td>
                <td>${item.quantity}</td>
                <td><input type="number" class="price-input raw-price" data-resource="${selectedResource}" data-index="${index}" value="${rawPrice || ''}" placeholder="0" min="0"></td>
                <td class="total-cost" data-resource="${selectedResource}" data-index="${index}">${totalCost ? totalCost.toLocaleString() : '-'}</td>
                <td><input type="number" class="price-input refined-price" data-resource="${selectedResource}" data-index="${index}" value="${refinedPrice || ''}" placeholder="0" min="0"></td>
                <td class="margin ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}" data-resource="${selectedResource}" data-index="${index}">${margin ? margin + '%' : '-'}</td>
                <td class="profit ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}" data-resource="${selectedResource}" data-index="${index}">${profit ? profit.toLocaleString() : '-'}</td>
                <td><button class="btn-small update-row" data-resource="${selectedResource}" data-index="${index}" ${useFallback ? 'disabled' : ''}>↺</button></td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="7" class="total-label">TOTAL PROFIT (${currentResourceData.name}):</td>
                    <td id="total-profit" class="total-value">0</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
    `;
    
    container.innerHTML = html;
    
    document.querySelectorAll('.price-input').forEach(input => {
        input.addEventListener('change', updateCalculations);
    });
    
    document.querySelectorAll('.update-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const resource = e.target.dataset.resource;
            const index = e.target.dataset.index;
            if (useFallback) {
                showStatus('Mode manuel uniquement', 'warning');
            } else {
                updateSingleRow(resource, index);
            }
        });
    });
    
    updateTotalProfit();
}

// ============================================
// UTILITAIRES
// ============================================
function getEnchantClass(enchant) {
    const classes = { '.0': 'enchant-0', '.1': 'enchant-1', '.2': 'enchant-2', '.3': 'enchant-3', '.4': 'enchant-4' };
    return classes[enchant] || '';
}

function updateCalculations() {
    const resource = this.dataset.resource;
    const index = parseInt(this.dataset.index);
    const type = this.classList.contains('raw-price') ? 'raw' : 'refined';
    const value = parseFloat(this.value) || 0;
    
    const item = RESOURCES[resource].items[index];
    const key = item.itemId;
    
    if (!currentPrices[key]) currentPrices[key] = {};
    currentPrices[key][type] = value;
    
    const rawPrice = currentPrices[key]?.raw || 0;
    const refinedPrice = currentPrices[key]?.refined || 0;
    const totalCost = rawPrice * item.quantity;
    const profit = refinedPrice - totalCost;
    const margin = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : '';
    
    const totalCostCell = document.querySelector(`.total-cost[data-resource="${resource}"][data-index="${index}"]`);
    if (totalCostCell) totalCostCell.textContent = totalCost ? totalCost.toLocaleString() : '-';
    
    const marginCell = document.querySelector(`.margin[data-resource="${resource}"][data-index="${index}"]`);
    if (marginCell) {
        marginCell.textContent = margin ? margin + '%' : '-';
        marginCell.className = `margin ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}`;
    }
    
    const profitCell = document.querySelector(`.profit[data-resource="${resource}"][data-index="${index}"]`);
    if (profitCell) {
        profitCell.textContent = profit ? profit.toLocaleString() : '-';
        profitCell.className = `profit ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}`;
    }
    
    updateTotalProfit();
}

function updateTotalProfit() {
    let total = 0;
    currentResourceData.items.forEach((item, index) => {
        const profitCell = document.querySelector(`.profit[data-resource="${selectedResource}"][data-index="${index}"]`);
        if (profitCell) {
            const profitText = profitCell.textContent.replace(/\s/g, '');
            if (profitText !== '-') {
                const profit = parseFloat(profitText) || 0;
                if (profit > 0) total += profit;
            }
        }
    });
    const totalElement = document.getElementById('total-profit');
    if (totalElement) totalElement.textContent = total.toLocaleString();
}

function getApiItemId(baseId, type) {
    if (type === 'raw') return baseId;
    return baseId.replace('WOOD', 'PLANKS').replace('ROCK', 'BLOCK').replace('ORE', 'METALBAR').replace('HIDE', 'LEATHER').replace('FIBER', 'CLOTH');
}

// ============================================
// GESTION API - VERSION SIMPLIFIÉE
// ============================================
function loadFallbackPrices() {
    useFallback = true;
    showLoading(true);
    
    setTimeout(() => {
        Object.keys(RESOURCES).forEach(resourceKey => {
            RESOURCES[resourceKey].items.forEach(item => {
                const fallback = FALLBACK_PRICES[item.itemId];
                if (fallback) {
                    if (!currentPrices[item.itemId]) currentPrices[item.itemId] = {};
                    currentPrices[item.itemId].raw = fallback.raw;
                    currentPrices[item.itemId].refined = fallback.refined;
                }
            });
        });
        
        renderResourceTable();
        document.getElementById('updateTime').textContent = new Date().toLocaleTimeString('fr-FR') + ' (prix de référence)';
        showStatus('⚠️ Mode démo - Prix de référence', 'warning');
        showLoading(false);
    }, 500);
}

async function fetchAllPrices() {
    showLoading(true);
    showStatus('Connexion API...', 'info');
    
    // Collecter les IDs (limité)
    const allIds = [];
    const idMap = {};
    let count = 0;
    
    Object.keys(RESOURCES).forEach(resourceKey => {
        RESOURCES[resourceKey].items.forEach(item => {
            if (count < 20) {
                const rawId = getApiItemId(item.itemId, 'raw');
                const refinedId = getApiItemId(item.itemId, 'refined');
                if (!allIds.includes(rawId)) { allIds.push(rawId); idMap[rawId] = { itemId: item.itemId, type: 'raw' }; }
                if (!allIds.includes(refinedId)) { allIds.push(refinedId); idMap[refinedId] = { itemId: item.itemId, type: 'refined' }; }
                count++;
            }
        });
    });
    
    // Proxies qui fonctionnent
    const proxies = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url='
    ];
    
    const endpoints = ['https://www.albion-online-data.com/api/v2/stats/prices/'];
    
    for (const proxy of proxies) {
        for (const endpoint of endpoints) {
            try {
                const itemsParam = allIds.join(',');
                const cityParam = API_CONFIG.cities[selectedCity] || 'Thetford';
                let apiUrl = `${endpoint}${itemsParam}?locations=${cityParam}&qualities=1`;
                
                if (proxy) {
                    apiUrl = proxy + encodeURIComponent(apiUrl);
                }
                
                console.log('Tentative:', apiUrl);
                
                const response = await fetch(apiUrl, {
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        let priceCount = 0;
                        data.forEach(priceData => {
                            const itemInfo = idMap[priceData.item_id];
                            if (itemInfo && priceData.sell_price_min?.length > 0) {
                                const price = Math.min(...priceData.sell_price_min.map(p => p.Price));
                                if (price > 0) {
                                    if (!currentPrices[itemInfo.itemId]) currentPrices[itemInfo.itemId] = {};
                                    currentPrices[itemInfo.itemId][itemInfo.type] = price;
                                    priceCount++;
                                }
                            }
                        });
                        
                        if (priceCount > 0) {
                            renderResourceTable();
                            document.getElementById('updateTime').textContent = new Date().toLocaleTimeString('fr-FR');
                            useFallback = false;
                            showStatus(`✓ ${priceCount} prix récupérés`, 'success');
                            setTimeout(() => showStatus('', 'info'), 3000);
                            showLoading(false);
                            return;
                        }
                    }
                }
            } catch (e) {
                console.log('Échec proxy:', proxy, e.message);
            }
        }
    }
    
    // Si tout échoue
    showStatus('❌ API inaccessible - Mode démo', 'error');
    loadFallbackPrices();
    showLoading(false);
}

async function updateSingleRow(resource, index) {
    const item = RESOURCES[resource].items[index];
    const itemIds = [getApiItemId(item.itemId, 'raw'), getApiItemId(item.itemId, 'refined')];
    
    showLoading(true);
    showStatus(`Récupération...`, 'info');
    
    const proxies = ['https://cors-anywhere.herokuapp.com/', 'https://api.allorigins.win/raw?url='];
    
    for (const proxy of proxies) {
        try {
            const itemsParam = itemIds.join(',');
            const cityParam = API_CONFIG.cities[selectedCity] || 'Thetford';
            let apiUrl = `https://www.albion-online-data.com/api/v2/stats/prices/${itemsParam}?locations=${cityParam}&qualities=1`;
            
            if (proxy) {
                apiUrl = proxy + encodeURIComponent(apiUrl);
            }
            
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                let updated = false;
                
                const rawData = data.find(p => p.item_id === getApiItemId(item.itemId, 'raw'));
                const refinedData = data.find(p => p.item_id === getApiItemId(item.itemId, 'refined'));
                
                if (rawData?.sell_price_min?.length > 0) {
                    const price = Math.min(...rawData.sell_price_min.map(p => p.Price));
                    document.querySelector(`.raw-price[data-resource="${resource}"][data-index="${index}"]`).value = price;
                    if (!currentPrices[item.itemId]) currentPrices[item.itemId] = {};
                    currentPrices[item.itemId].raw = price;
                    updated = true;
                }
                
                if (refinedData?.sell_price_min?.length > 0) {
                    const price = Math.min(...refinedData.sell_price_min.map(p => p.Price));
                    document.querySelector(`.refined-price[data-resource="${resource}"][data-index="${index}"]`).value = price;
                    if (!currentPrices[item.itemId]) currentPrices[item.itemId] = {};
                    currentPrices[item.itemId].refined = price;
                    updated = true;
                }
                
                if (updated) {
                    document.querySelector(`.raw-price[data-resource="${resource}"][data-index="${index}"]`).dispatchEvent(new Event('change'));
                    showStatus('✓ Mis à jour', 'success');
                    showLoading(false);
                    return;
                }
            }
        } catch (e) {
            console.log('Échec');
        }
    }
    
    showStatus('❌ Échec', 'error');
    showLoading(false);
}

async function initializePrices() {
    showLoading(true);
    await fetchAllPrices();
}

function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('api-status');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = `api-status ${type}`;
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = show ? 'block' : 'none';
}

function updateTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.resource === selectedResource);
    });
}

function attachEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => loadResource(e.target.dataset.resource));
    });
    
    document.getElementById('refreshPrices').addEventListener('click', () => {
        apiAttempts = 0;
        fetchAllPrices();
    });
    
    document.getElementById('city').addEventListener('change', (e) => {
        selectedCity = e.target.value;
        if (!useFallback) fetchAllPrices();
    });
}
