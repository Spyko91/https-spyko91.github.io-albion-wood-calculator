// ============================================
// ÉTAT DE L'APPLICATION
// ============================================
let currentPrices = {};
let selectedCity = 'Thetford';
let selectedResource = 'wood';
let currentResourceData = RESOURCES.wood;
let useApi = false;

// Mapping des conversions pour l'API (brut → raffiné)
const REFINED_MAP = {
    'WOOD': 'PLANKS',
    'ROCK': 'BLOCK',
    'ORE': 'METALBAR',
    'HIDE': 'LEATHER',
    'FIBER': 'CLOTH'
};

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation...');
    
    // Charger les prix sauvegardés d'abord
    loadSavedPrices();
    
    showStatus('Chargement...', 'info');
    
    loadResource('wood');
    attachEventListeners();
    
    // Essayer de charger depuis l'API d'abord
    fetchAllPricesFromAPI();
});

// ============================================
// SAUVEGARDE LOCALE
// ============================================
function loadSavedPrices() {
    try {
        const saved = localStorage.getItem('albionPrices');
        if (saved) {
            const parsed = JSON.parse(saved);
            currentPrices = parsed;
            console.log('📦 Prix chargés depuis la sauvegarde locale');
        }
    } catch (e) {
        console.log('Erreur chargement sauvegarde:', e);
    }
}

function savePrices() {
    try {
        localStorage.setItem('albionPrices', JSON.stringify(currentPrices));
        console.log('💾 Prix sauvegardés localement');
        
        const saveIndicator = document.getElementById('save-indicator');
        if (saveIndicator) {
            saveIndicator.style.opacity = '1';
            setTimeout(() => {
                saveIndicator.style.opacity = '0';
            }, 1000);
        }
    } catch (e) {
        console.log('Erreur sauvegarde:', e);
    }
}

// ============================================
// CONSTRUCTION DE LA LISTE COMPLÈTE DES ITEMS
// ============================================
function getAllItemsByResource(resourceKey) {
    const resource = RESOURCES[resourceKey];
    return resource.items.map(item => item.itemId);
}

function getAllRawItems() {
    let allItems = [];
    Object.keys(RESOURCES).forEach(resourceKey => {
        RESOURCES[resourceKey].items.forEach(item => {
            if (!allItems.includes(item.itemId)) {
                allItems.push(item.itemId);
            }
        });
    });
    return allItems;
}

function getRefinedId(rawId) {
    // Remplacer le suffixe selon le type de ressource
    for (const [key, value] of Object.entries(REFINED_MAP)) {
        if (rawId.includes(key)) {
            return rawId.replace(key, value);
        }
    }
    return rawId; // Si pas de correspondance
}

// ============================================
// CHARGEMENT DES PRIX DEPUIS L'API
// ============================================
async function fetchAllPricesFromAPI() {
    showLoading(true);
    showStatus('📡 Connexion à l\'API Albion...', 'info');
    
    const proxyUrl = 'https://cors-anywhere.com/';
    
    // Récupérer tous les items bruts
    const allRawItems = getAllRawItems();
    
    // Diviser en lots de 30 pour éviter les URL trop longues
    const chunkSize = 30;
    const rawChunks = [];
    for (let i = 0; i < allRawItems.length; i += chunkSize) {
        rawChunks.push(allRawItems.slice(i, i + chunkSize));
    }
    
    try {
        let totalPrices = 0;
        
        // Traiter chaque lot d'items bruts
        for (const chunk of rawChunks) {
            const rawUrl = `https://europe.albion-online-data.com/api/v2/stats/prices/${chunk.join(',')}.json?locations=${selectedCity}&qualities=1`;
            const rawResponse = await fetch(proxyUrl + rawUrl, {
                headers: { 'Origin': window.location.origin }
            });
            
            if (rawResponse.ok) {
                const rawData = await rawResponse.json();
                
                rawData.forEach(item => {
                    if (item && item.sell_price_min && item.sell_price_min.length > 0) {
                        const itemId = item.item_id;
                        const price = Math.min(...item.sell_price_min.map(p => p.Price));
                        
                        if (!currentPrices[itemId]) currentPrices[itemId] = {};
                        currentPrices[itemId].raw = price;
                        totalPrices++;
                    }
                });
            }
        }
        
        // Récupérer tous les items raffinés
        const allRefinedItems = allRawItems.map(id => getRefinedId(id));
        const refinedChunks = [];
        for (let i = 0; i < allRefinedItems.length; i += chunkSize) {
            refinedChunks.push(allRefinedItems.slice(i, i + chunkSize));
        }
        
        // Traiter chaque lot d'items raffinés
        for (const chunk of refinedChunks) {
            const refinedUrl = `https://europe.albion-online-data.com/api/v2/stats/prices/${chunk.join(',')}.json?locations=${selectedCity}&qualities=1`;
            const refinedResponse = await fetch(proxyUrl + refinedUrl, {
                headers: { 'Origin': window.location.origin }
            });
            
            if (refinedResponse.ok) {
                const refinedData = await refinedResponse.json();
                
                refinedData.forEach(item => {
                    if (item && item.sell_price_min && item.sell_price_min.length > 0) {
                        const itemId = item.item_id;
                        const price = Math.min(...item.sell_price_min.map(p => p.Price));
                        
                        // Trouver l'ID de base correspondant
                        let baseId = itemId;
                        for (const [key, value] of Object.entries(REFINED_MAP)) {
                            if (itemId.includes(value)) {
                                baseId = itemId.replace(value, key);
                                break;
                            }
                        }
                        
                        if (!currentPrices[baseId]) currentPrices[baseId] = {};
                        currentPrices[baseId].refined = price;
                        totalPrices++;
                    }
                });
            }
        }
        
        if (totalPrices > 0) {
            savePrices();
            renderResourceTable();
            
            const updateTime = document.getElementById('updateTime');
            if (updateTime) {
                updateTime.textContent = new Date().toLocaleString('fr-FR') + ' (API)';
            }
            
            showStatus(`✓ ${totalPrices} prix chargés depuis l'API`, 'success');
            useApi = true;
        } else {
            throw new Error('Aucun prix récupéré');
        }
        
    } catch (error) {
        console.error('Erreur API:', error);
        showStatus('⚠️ API inaccessible - Chargement fichier local', 'warning');
        loadPricesFromFile();
    } finally {
        showLoading(false);
        clearStatusAfterDelay();
    }
}

// ============================================
// CHARGEMENT DES PRIX DEPUIS LE FICHIER JSON
// ============================================
async function loadPricesFromFile() {
    try {
        const response = await fetch('prices.json');
        const data = await response.json();
        
        if (data && data.prices) {
            Object.keys(data.prices).forEach(key => {
                if (!currentPrices[key] || !useApi) {
                    currentPrices[key] = data.prices[key];
                }
            });
            
            renderResourceTable();
            
            const updateTime = document.getElementById('updateTime');
            if (updateTime) {
                updateTime.textContent = data.lastUpdate || new Date().toLocaleString('fr-FR');
            }
            
            showStatus(`✓ Prix chargés (fichier local)`, 'success');
            clearStatusAfterDelay();
        }
    } catch (error) {
        console.error('Erreur chargement prices.json:', error);
        showStatus('❌ Erreur chargement - Utilisation sauvegarde', 'error');
        
        if (Object.keys(currentPrices).length === 0) {
            loadFallbackPrices();
        } else {
            renderResourceTable();
        }
    }
}

// ============================================
// PRIX DE SECOURS
// ============================================
function loadFallbackPrices() {
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
    savePrices();
}

// ============================================
// TEST API EUROPE (pour diagnostic)
// ============================================
async function testEuropeAPI() {
    try {
        showStatus('🧪 Test API Europe...', 'info');
        
        const baseUrl = 'https://europe.albion-online-data.com/api/v2/stats/prices/T4_WOOD.json?locations=Thetford&qualities=1';
        const proxyUrl = 'https://cors-anywhere.com/' + baseUrl;
        
        const response = await fetch(proxyUrl, {
            headers: { 'Origin': window.location.origin }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Données API:', data);
            
            if (data && data.length > 0 && data[0].sell_price_min) {
                const prixAchat = Math.min(...data[0].sell_price_min.map(p => p.Price));
                alert(`✅ API OK !\nPrix T4 Bois: ${prixAchat} silver`);
                showStatus('✓ Test réussi', 'success');
            }
        } else {
            alert('❌ Échec test API');
        }
    } catch (error) {
        console.error('❌ Erreur test:', error);
        alert('❌ Erreur de connexion');
    } finally {
        clearStatusAfterDelay();
    }
}

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
                <td><input type="number" class="price-input raw-price" data-resource="${selectedResource}" data-index="${index}" value="${rawPrice || ''}" placeholder="0" min="0" step="1"></td>
                <td class="total-cost" data-resource="${selectedResource}" data-index="${index}">${totalCost ? totalCost.toLocaleString() : '-'}</td>
                <td><input type="number" class="price-input refined-price" data-resource="${selectedResource}" data-index="${index}" value="${refinedPrice || ''}" placeholder="0" min="0" step="1"></td>
                <td class="margin ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}" data-resource="${selectedResource}" data-index="${index}">${margin ? margin + '%' : '-'}</td>
                <td class="profit ${profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : ''}" data-resource="${selectedResource}" data-index="${index}">${profit ? profit.toLocaleString() : '-'}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="6" class="total-label">TOTAL PROFIT (${currentResourceData.name}):</td>
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
    
    updateTotalProfit();
}

// ============================================
// CLASSES CSS POUR ENCHANTEMENTS
// ============================================
function getEnchantClass(enchant) {
    const classes = {
        '.0': 'enchant-0',
        '.1': 'enchant-1',
        '.2': 'enchant-2',
        '.3': 'enchant-3',
        '.4': 'enchant-4'
    };
    return classes[enchant] || '';
}

// ============================================
// MISE À JOUR DES CALCULS
// ============================================
function updateCalculations() {
    const resource = this.dataset.resource;
    const index = parseInt(this.dataset.index);
    const type = this.classList.contains('raw-price') ? 'raw' : 'refined';
    const value = parseFloat(this.value) || 0;
    
    const item = RESOURCES[resource].items[index];
    const key = item.itemId;
    
    if (!currentPrices[key]) currentPrices[key] = {};
    currentPrices[key][type] = value;
    
    // Sauvegarder après chaque modification
    savePrices();
    
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

// ============================================
// MISE À JOUR DU TOTAL
// ============================================
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

// ============================================
// AFFICHAGE DES STATUTS
// ============================================
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

function clearStatusAfterDelay() {
    let start = null;
    const duration = 3000;
    
    function fadeOut(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        
        if (elapsed < duration) {
            requestAnimationFrame(fadeOut);
        } else {
            showStatus('', 'info');
        }
    }
    requestAnimationFrame(fadeOut);
}

// ============================================
// GESTION DES ONGLETS
// ============================================
function updateTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.resource === selectedResource);
    });
}

// ============================================
// ÉVÉNEMENTS
// ============================================
function attachEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => loadResource(e.target.dataset.resource));
    });
    
    document.getElementById('refreshPrices').addEventListener('click', () => {
        fetchAllPricesFromAPI();
    });
    
    document.getElementById('city').addEventListener('change', (e) => {
        selectedCity = e.target.value;
        fetchAllPricesFromAPI();
    });
}
