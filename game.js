let rent = 0;
let expenses = 0;
let totalWealth = 0;
let tenants = [];
let houses = [];

// DOM elements
const rentElement = document.getElementById('rent');
const expensesElement = document.getElementById('expenses');
const wealthElement = document.getElementById('wealth');
const tenantsList = document.getElementById('tenants-list');
const housesList = document.getElementById('houses-list');

// Function to save the game state to localStorage
function saveGame() {
    const gameState = {
        rent,
        expenses,
        totalWealth,
        tenants,
        houses
    };
    localStorage.setItem('virtualLandlordSave', JSON.stringify(gameState));
}

// Function to load the game state from localStorage
function loadGame() {
    const savedGame = localStorage.getItem('virtualLandlordSave');
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        rent = gameState.rent;
        expenses = gameState.expenses;
        totalWealth = gameState.totalWealth;
        tenants = gameState.tenants;
        houses = gameState.houses;
        
        updateTenantsUI();
        updateHousesUI();
        rentElement.textContent = `$${rent.toFixed(2)}`;
        expensesElement.textContent = `$${expenses.toFixed(2)}`;
        wealthElement.textContent = `$${totalWealth.toFixed(2)}`;
    }
}

// Auto-load the game on page load
window.onload = loadGame;

// Function to add a tenant
function addTenant() {
    const tenant = {
        id: tenants.length + 1,
        rentPerSecond: 5,
        isEvicted: false,
        cleanliness: 100
    };
    tenants.push(tenant);
    updateTenantsUI();
    collectRent(tenant);
    saveGame(); // Save the game after adding a tenant
}

// Function to evict a tenant
function evictTenant(tenantId) {
    tenants = tenants.map(tenant => {
        if (tenant.id === tenantId) {
            tenant.isEvicted = true;
        }
        return tenant;
    });
    updateTenantsUI();
    saveGame(); // Save the game after evicting a tenant
}

// Function to clean a tenant's house
function cleanTenantHouse(tenantId) {
    tenants = tenants.map(tenant => {
        if (tenant.id === tenantId && tenant.cleanliness < 100) {
            tenant.cleanliness = 100;
            tenant.rentPerSecond = 5;
        }
        return tenant;
    });
    updateTenantsUI();
    saveGame(); // Save the game after cleaning a tenant's house
}

// Update tenant UI
function updateTenantsUI() {
    tenantsList.innerHTML = '';
    tenants.forEach(tenant => {
        const tenantElement = document.createElement('div');
        tenantElement.textContent = `Tenant #${tenant.id}: Rent $${tenant.rentPerSecond.toFixed(2)}/5s | Cleanliness: ${tenant.cleanliness}%`;
        
        const evictButton = document.createElement('button');
        evictButton.textContent = 'Evict';
        evictButton.onclick = () => evictTenant(tenant.id);
        
        const cleanButton = document.createElement('button');
        cleanButton.textContent = 'Clean';
        cleanButton.onclick = () => cleanTenantHouse(tenant.id);
        
        tenantElement.appendChild(evictButton);
        tenantElement.appendChild(cleanButton);
        tenantsList.appendChild(tenantElement);
    });
}

// Function to build a house
function buildHouse() {
    const house = {
        id: houses.length + 1,
        upgradeLevel: 1,
        upgradeCost: 50
    };
    houses.push(house);
    updateHousesUI();
    saveGame(); // Save the game after building a house
}

// Function to upgrade a house
function upgradeHouse(houseId) {
    houses = houses.map(house => {
        if (house.id === houseId) {
            house.upgradeLevel++;
            house.upgradeCost *= 1.5;
            increaseTenantRent(house.upgradeLevel);
        }
        return house;
    });
    updateHousesUI();
    saveGame(); // Save the game after upgrading a house
}

// Update house UI
function updateHousesUI() {
    housesList.innerHTML = '';
    houses.forEach(house => {
        const houseElement = document.createElement('div');
        houseElement.textContent = `House #${house.id}: Upgrade Level ${house.upgradeLevel} | Upgrade Cost $${house.upgradeCost.toFixed(2)}`;
        
        const upgradeButton = document.createElement('button');
        upgradeButton.textContent = 'Upgrade';
        upgradeButton.onclick = () => upgradeHouse(house.id);
        
        houseElement.appendChild(upgradeButton);
        housesList.appendChild(houseElement);
    });
}

// Function to increase tenant rent based on house upgrade level
function increaseTenantRent(upgradeLevel) {
    tenants.forEach(tenant => {
        tenant.rentPerSecond += (upgradeLevel - 1) * 2;
    });
}

// Function to collect rent every 5 seconds
function collectRent(tenant) {
    setInterval(() => {
        if (!tenant.isEvicted) {
            rent += tenant.rentPerSecond;
            rentElement.textContent = `$${rent.toFixed(2)}`;
            updateWealth();
            saveGame(); // Save the game after rent collection
        }
    }, 5000);
}

// Function to degrade cleanliness over time
function degradeCleanliness() {
    setInterval(() => {
        tenants.forEach(tenant => {
            if (tenant.cleanliness > 0 && !tenant.isEvicted) {
                tenant.cleanliness -= 1;
                if (tenant.cleanliness < 50) {
                    tenant.rentPerSecond *= 0.95;
                }
            }
        });
        updateTenantsUI();
        saveGame(); // Save the game after cleanliness degradation
    }, 5000);
}

// Start degrading cleanliness over time
degradeCleanliness();

// Curse mechanic: landlord pays tenants
function activateCurse() {
    setInterval(() => {
        if (tenants.length > 0) {
            const curseAmount = tenants.length * 1;
            expenses += curseAmount;
            expensesElement.textContent = `$${expenses.toFixed(2)}`;
            updateWealth();
            saveGame(); // Save the game after curse payment
        }
    }, 1000);
}

// Function to update total wealth
function updateWealth() {
    totalWealth = rent - expenses;
    wealthElement.textContent = `$${totalWealth.toFixed(2)}`;
    saveGame(); // Save the game after wealth update
}

// Event listeners for buttons
document.getElementById('add-tenant-btn').addEventListener('click', addTenant);
document.getElementById('build-house-btn').addEventListener('click', buildHouse);
document.getElementById('curse-btn').addEventListener('click', activateCurse);
