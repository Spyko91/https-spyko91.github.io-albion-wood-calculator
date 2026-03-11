// Configuration du calculateur de bois Albion Online
const CONFIG = {
    // Mapping des ressources pour l'API Albion Data Project
    itemIds: {
        // Bois brut (log)
        'T2_WOOD': { log: 'T2_WOOD', plank: 'T2_PLANKS' },
        'T3_WOOD': { log: 'T3_WOOD', plank: 'T3_PLANKS' },
        'T4_WOOD': { log: 'T4_WOOD', plank: 'T4_PLANKS' },
        'T4_WOOD_LEVEL1': { log: 'T4_WOOD_LEVEL1', plank: 'T4_PLANKS_LEVEL1' },
        'T4_WOOD_LEVEL2': { log: 'T4_WOOD_LEVEL2', plank: 'T4_PLANKS_LEVEL2' },
        'T4_WOOD_LEVEL3': { log: 'T4_WOOD_LEVEL3', plank: 'T4_PLANKS_LEVEL3' },
        'T5_WOOD': { log: 'T5_WOOD', plank: 'T5_PLANKS' },
        'T5_WOOD_LEVEL1': { log: 'T5_WOOD_LEVEL1', plank: 'T5_PLANKS_LEVEL1' },
        'T5_WOOD_LEVEL2': { log: 'T5_WOOD_LEVEL2', plank: 'T5_PLANKS_LEVEL2' },
        'T5_WOOD_LEVEL3': { log: 'T5_WOOD_LEVEL3', plank: 'T5_PLANKS_LEVEL3' },
        'T6_WOOD': { log: 'T6_WOOD', plank: 'T6_PLANKS' },
        'T6_WOOD_LEVEL1': { log: 'T6_WOOD_LEVEL1', plank: 'T6_PLANKS_LEVEL1' },
        'T6_WOOD_LEVEL2': { log: 'T6_WOOD_LEVEL2', plank: 'T6_PLANKS_LEVEL2' },
        'T6_WOOD_LEVEL3': { log: 'T6_WOOD_LEVEL3', plank: 'T6_PLANKS_LEVEL3' },
        'T7_WOOD': { log: 'T7_WOOD', plank: 'T7_PLANKS' },
        'T7_WOOD_LEVEL1': { log: 'T7_WOOD_LEVEL1', plank: 'T7_PLANKS_LEVEL1' },
        'T7_WOOD_LEVEL2': { log: 'T7_WOOD_LEVEL2', plank: 'T7_PLANKS_LEVEL2' },
        'T7_WOOD_LEVEL3': { log: 'T7_WOOD_LEVEL3', plank: 'T7_PLANKS_LEVEL3' },
        'T8_WOOD': { log: 'T8_WOOD', plank: 'T8_PLANKS' },
        'T8_WOOD_LEVEL1': { log: 'T8_WOOD_LEVEL1', plank: 'T8_PLANKS_LEVEL1' },
        'T8_WOOD_LEVEL2': { log: 'T8_WOOD_LEVEL2', plank: 'T8_PLANKS_LEVEL2' },
        'T8_WOOD_LEVEL3': { log: 'T8_WOOD_LEVEL3', plank: 'T8_PLANKS_LEVEL3' }
    },
    
    // Quantités nécessaires pour le raffinage (logs → planks)
    // Basé sur les données du jeu
    refiningQuantities: {
        'T2': 1,
        'T3': 2,
        'T4': 2,
        'T5': 3,
        'T6': 4,
        'T7': 5,
        'T8': 5
    },
    
    // API Endpoint
    apiBaseUrl: 'https://europe.albion-online-data.com/api/v2/stats/prices/',
    
    // Mapping des villes pour l'API
    cities: {
        'Thetford': 'Thetford',
        'Lymhurst': 'Lymhurst',
        'Bridgewatch': 'Bridgewatch',
        'Martlock': 'Martlock',
        'Fort Sterling': 'Fort Sterling',
        'Caerleon': 'Caerleon',
        'Brecilien': 'Brecilien'
    },
    
    // Mapping des serveurs
    servers: {
        'West': 'america',
        'East': 'asia',
        'Europe': 'europe'
    },
    
    // Taxes par défaut (en %)
    marketTax: 2.5, // Taxe de vente sur le marché
    setupFee: 50 // Frais fixe d'installation (optionnel)
};