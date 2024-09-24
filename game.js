let rent = 0;
let expenses = 0;
let totalWealth = 0;
let tenants = [];
let houses = [];

const rentElement = document.getElementById('rent');
const expensesElement = document.getElementById('expenses');
const wealthElement = document.getElementById('wealth');
const tenantsList = document.getElementById('tenants-list');
const housesList = document.getElementById('houses-list');

// Function to add a tenant
function addTenant() {
    const tenant = {
        id: tenants.length + 1,
        rentPerSecond: 5,
        isEvicted: false,
        cleanliness: 100 // Tenant cleanliness starts at 100%
    };
    tenants.push(tenant);
    updateTenantsUI();
    collectRent(tenant);
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
}

// Function to clean a tenant's house
function cleanTenantHouse(tenantId) {
    tenants = tenants.map(tenant => {
        if (tenant.id === tenantId && tenant.cleanliness < 100) {
            tenant.cleanliness = 100; // Reset cleanliness to 100%
            tenant.rentPerSecond = 5; // Reset rent back to normal
        }
        return tenant;
    });
    updateTenantsUI();
}

// Updated tenant UI to include "Evict" and "Clean" buttons with event listeners
function updateTenantsUI() {
    tenantsList.innerHTML = '';
    tenants.forEach(tenant => {
        const tenantElement = document.createElement('div');
        tenantElement.textContent = `Tenant #${tenant.id}: Rent $${tenant.rentPerSecond.toFixed(2)}/5s | Cleanliness: ${tenant.cleanliness}%`;
        
        const evictButton = document.createElement('button');
        evictButton.textContent = 'Evict';
        evictButton.onclick = () => evictTenant(tenant.id); // Event listener for evict button
        
        const cleanButton = document.createElement('button');
        cleanButton.textContent = 'Clean';
        cleanButton.onclick = () => cleanTenantHouse(tenant.id); // Event listener for clean button
        
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
        upgradeCost: 50 // Cost for the next upgrade
    };
    houses.push(house);
    updateHousesUI();
}

// Function to upgrade a house
function upgradeHouse(houseId) {
    houses = houses.map(house => {
        if (house.id === houseId) {
            house.upgradeLevel++;
            house.upgradeCost *= 1.5; // Increase upgrade cost
            increaseTenantRent(house.upgradeLevel); // Increase rent for each upgrade
        }
        return house;
    });
    updateHousesUI();
}

// Function to increase tenant rent based on house upgrade level
function increaseTenantRent(upgradeLevel) {
    tenants.forEach(tenant => {
        tenant.rentPerSecond += (upgradeLevel - 1) * 2; // Rent increases with house level
    });
}

// Updated house UI to include "Upgrade" button with event listener
function updateHousesUI() {
    housesList.innerHTML = '';
    houses.forEach(house => {
        const houseElement = document.createElement('div');
        houseElement.textContent = `House #${house.id}: Upgrade Level ${house.upgradeLevel} | Upgrade Cost $${house.upgradeCost.toFixed(2)}`;
        
        const upgradeButton = document.createElement('button');
        upgradeButton.textContent = 'Upgrade';
        upgradeButton.onclick = () => upgradeHouse(house.id); // Event listener for upgrade button
        
        houseElement.appendChild(upgradeButton);
        housesList.appendChild(houseElement);
    });
}

// Function to collect rent every 5 seconds
function collectRent(tenant) {
    setInterval(() => {
        if (!tenant.isEvicted) {
            rent += tenant.rentPerSecond;
            rentElement.textContent = `$${rent.toFixed(2)}`;
            updateWealth();
        }
    }, 5000); // 5 seconds interval
}

// Function to degrade cleanliness over time
function degradeCleanliness() {
    setInterval(() => {
        tenants.forEach(tenant => {
            if (tenant.cleanliness > 0 && !tenant.isEvicted) {
                tenant.cleanliness -= 1; // Decrease cleanliness by 1% per interval
                if (tenant.cleanliness < 50) {
                    tenant.rentPerSecond *= 0.95; // Rent decreases if cleanliness is below 50%
                }
            }
        });
        updateTenantsUI();
    }, 5000); // Cleanliness decreases every 5 seconds
}

// Start degrading cleanliness over time
degradeCleanliness();

// Curse mechanic: landlord pays tenants
function activateCurse() {
    setInterval(() => {
        if (tenants.length > 0) {
            const curseAmount = tenants.length * 1; // 1 dollar per tenant per second
            expenses += curseAmount;
            expensesElement.textContent = `$${expenses.toFixed(2)}`;
            updateWealth();
        }
    }, 1000); // Curse happens every second
}

// Function to update total wealth
function updateWealth() {
    totalWealth = rent - expenses;
    wealthElement.textContent = `$${totalWealth.toFixed(2)}`;
}

// Update wealth every second
setInterval(updateWealth, 1000);

// Event listeners for adding tenants, building houses, and activating curse
document.getElementById('add-tenant-btn').addEventListener('click', addTenant);
document.getElementById('build-house-btn').addEventListener('click', buildHouse);
document.getElementById('curse-btn').addEventListener('click', activateCurse);
