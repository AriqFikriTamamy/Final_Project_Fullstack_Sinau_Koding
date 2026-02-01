export function createOrderState() {
    return {
        currentType: "dinein",
        orders: {
            dinein: {},
            takeaway: {}
        }
    };
};

export function addItem(state, item) {
    const active = state.orders[state.currentType];
    if (active[item.id]) {
        active[item.id].qty += 1;
    } else {
        active[item.id] = { ...item, qty: 1, note: "" };
    }
};

export function clearOrder(state) {
    state.orders[state.currentType] = {};
};

export function renderOrderList(container, state) {
    if (!container) return;

    const activeOrders = state.orders[state.currentType];
    container.innerHTML = "";

    if (Object.keys(activeOrders).length === 0) {
        container.innerHTML = `<h1 class="empty-order">No Menu Selected</h1>`;
        return;
    }

    Object.values(activeOrders).forEach(item => {
        const row = document.createElement("div");
        row.className = "order-item";

        row.innerHTML = `
            <img id="itemImage" src="${item.image}" alt="${item.name}">
            <div class="order-info">
                <div class="item-info">
                    <div class="name-and-price">
                        <strong>${item.name}</strong>
                        <span>${item.qty} x Rp ${item.price.toLocaleString("id-ID")}</span>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(row);
    });
};

// Generate Order ID
export function generateOrderId() {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    return `ORDR#${random}`;
};

// Hitung Total
export function calculateTotal(state) {
    const activeOrders = state.orders[state.currentType];

    return Object.values(activeOrders).reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );
}