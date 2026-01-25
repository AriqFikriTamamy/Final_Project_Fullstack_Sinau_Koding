// Generate ID
function generateOrderId() {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    return `ORDR#${random}`;
}

let currentOrderId = generateOrderId();

function updateOrderIdUI() {
    const orderIdSpan = document.querySelector(".list-order-title h2 span");
    if (orderIdSpan) {
        orderIdSpan.textContent = currentOrderId;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    updateOrderIdUI();
});

// Modal Order Archive
let archivedOrders = [];
const orderArchiveModal = document.getElementById("orderArchiveModal");
const closeOrderArchive = document.getElementById("closeOrderArchive");

function openArchiveModal() {
    renderArchiveList(archivedOrders);
    orderArchiveModal.style.display = "flex";
}

closeOrderArchive.addEventListener("click", () => {
    orderArchiveModal.style.display = "none";
});

function renderArchiveList(data) {
    const list = document.getElementById("orderArchiveList");
    list.innerHTML = "";

    if (data.length === 0) {
        list.innerHTML = "<p>No archived orders</p>";
        return;
    }

    data.forEach((order, index) => {
        const card = document.createElement("div");
        card.className = "archive-card";
        card.dataset.index = index;

        card.innerHTML = `
        <div class="archive-info">
            <span>No Order ${order.orderId} | ${order.type} | ${order.customer} | ${order.table}</span>
            <span class="archive-datetime">${formatDate(order.createdAt)}</span>
        </div>
        
        <div class="archive-total-and-use">
            <div class="archive-total">Rp ${format(Number(order.total))}</div>
            <div class="archive-use" data-index="${index}">
                <img src="assets/arrow-right.png" alt="Archive Use Icon">
            </div>
        </div>
        `;

        list.appendChild(card);
    });
};

document.getElementById("orderArchiveList").addEventListener("click", function (e) {
    const useBtn = e.target.closest(".archive-use");
    if (!useBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const index = useBtn.dataset.index;
    const archiveData = archivedOrders[index];
    if (!archiveData) return;

    restoreArchiveToOrder(archiveData);
});

const customerInput = document.getElementById("customer-name");

function restoreArchiveToOrder(archiveData) {
    //Set order type
    const type = archiveData.type === "Dine In" ? "dinein" : "takeaway";
    setOrderType(type);

    //Restore customer name
    
    if (customerInput) {
        customerInput.value = archiveData.customer !== "-" ? archiveData.customer : "";
    }

    //Restore table
    if (archiveData.table && archiveData.table !== "-") {
        const selectedText = document.querySelector(".selected-text");
        if (selectedText) selectedText.innerText = archiveData.table;
    }

    //Clear current order before restore
    orders[type] = {};

    //Restore items
    archiveData.items.forEach(item => {
        const itemId = item.id || crypto.randomUUID();
        orders[type][itemId] = {
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            note: item.note || "",
            image: item.image || ""
        };
    });

    renderOrderList();

    //Close archive modal
    orderArchiveModal.style.display = "none";

    currentOrderId = archiveData.orderId;
    updateOrderIdUI();
}

function formatDate(date) {
    return new Date(date).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

document.getElementById("searchArchiveBtn").addEventListener("click", () => {
    const keyword = document.getElementById("searchArchiveInput").value.toLowerCase();
    const type = document.getElementById("archiveTypeFilter").value;

    const filtered = archivedOrders.filter(order => {
        const matchKeyword =
        order.orderId.toLowerCase().includes(keyword) ||
        order.customer.toLowerCase().includes(keyword);

        const matchType = type ? order.type === type : true;

        return matchKeyword && matchType;
    });

    renderArchiveList(filtered);
});

// Modal Detail Menu
const menuModal = document.getElementById("menuModal");
const closeModal = document.getElementById("closeModal");
const modalName = document.getElementById("modalMenuName");
const modalImage = document.getElementById("modalMenuImage");
const modalDesc = document.getElementById("modalMenuDescription");
const modalPrice = document.getElementById("modalMenuPrice");
const modalBadge = document.getElementById("modalMenuBadge");

document.querySelectorAll(".detail-menu-icon").forEach(icon => {
    icon.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

    const card = this.closest(".menu-list-card");
    modalName.innerText = card.querySelector(".menu-name h1").innerText;
    modalDesc.innerText = card.querySelector(".menu-description p").innerText;
    modalPrice.innerText = card.querySelector(".menu-price span").innerText;
    modalImage.src = card.querySelector(".menu-image img").src;
    modalBadge.innerText = card.querySelector(".category-badge p").innerText;

    menuModal.style.display = "flex";
    });
});

closeModal.addEventListener("click", () => {
    menuModal.style.display = "none";
});

window.addEventListener("click", e => {
    if (e.target === menuModal) {
        menuModal.style.display = "none";
    }
});

// Modal Edit Note Order
let activeEditOrderId = null;
let activeOrderItem = null;
const editOrderModal = document.getElementById("editOrderModal");
const closeEditModal = document.getElementById("closeEditModal");
const editMenuName = document.getElementById("editMenuName");
const editMenuImage = document.getElementById("editMenuImage");
const editNoteInput = document.getElementById("editNote");
const submitEditBtn = document.getElementById("submitEditOrder");

document.addEventListener("click", function (e) {
    const editBtn = e.target.closest(".order-edit");
    if (!editBtn) return;

    e.stopPropagation();

    const orderItem = editBtn.closest(".order-item");
    activeEditOrderId = orderItem.dataset.id;

    const activeOrders = orders[currentOrderType];
    const item = activeOrders[activeEditOrderId];
    if (!item) return;

    editMenuName.innerText = item.name;
    editMenuImage.src = item.image;
    editNoteInput.value = item.note || "";

    editOrderModal.style.display = "flex";
});

closeEditModal.addEventListener("click", () => {
    editOrderModal.style.display = "none";
    activeEditOrderId = null;
});

window.addEventListener("click", (e) => {
    if (e.target === editOrderModal) {
        editOrderModal.style.display = "none";
        activeEditOrderId = null;
    }
});

submitEditBtn.addEventListener("click", () => {
    if (!activeEditOrderId) return;

    const activeOrders = orders[currentOrderType];
    const item = activeOrders[activeEditOrderId];
    if (!item) return;

    item.note = editNoteInput.value.trim();

    activeEditOrderId = null;
    renderOrderList();
    editOrderModal.style.display = "none";
});

// Category Menu Active and Counter Total Menu
const categoryButtons = document.querySelectorAll(".category-menu > div");
const menuCards = document.querySelectorAll(".menu-list-card");
const totalMenuCount = document.getElementById("totalMenuCount");

function updateTotalMenu(count){
    totalMenuCount.innerText = `${count} Menu`;
}

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        // Reset state berstatus active
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        let visibleCount = 0;

        menuCards.forEach(card => {
            const category = card.dataset.category;

            if(filter === "all" || category === filter){
                card.style.display = "block";
                visibleCount++;
            }else{
                card.style.display = "none";
            }
        });
        updateTotalMenu(visibleCount);
    });
});

updateTotalMenu(menuCards.length);

// List Order Section
const orderListElement = document.getElementById("orderList");
const orderSummaryElement = document.getElementById("orderSummary");
const subTotalElement = document.getElementById("subTotal");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("total");
const nominalInputWrapper = document.querySelector(".nominal-input");
const payButton = document.getElementById("payButton");

// List Order Category Active
const dineInBtn = document.querySelector(".order-dine-in");
const takeAwayBtn = document.querySelector(".order-take-away");

let currentOrderType = "dinein";

let orders = {
    dinein: {},
    takeaway: {}
};

dineInBtn.addEventListener("click", () => {
    setOrderType("dinein");
});

takeAwayBtn.addEventListener("click", () => {
    setOrderType("takeaway");
});

function setOrderType(type){
    currentOrderType = type;

    dineInBtn.classList.remove("active");
    takeAwayBtn.classList.remove("active");

    if(type === "dinein"){
        dineInBtn.classList.add("active")
    }else{
        takeAwayBtn.classList.add("active");
    };

    renderOrderList();
};

// Order List Data
const taxRate = 5000;

document.querySelectorAll(".menu-list-card").forEach(card => {
    card.addEventListener("click", (e) => {
        if (e.target.closest(".list-order-archive")) return;

        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price);
        const image = card.dataset.image;
        const activeOrders = orders[currentOrderType];

        if(activeOrders[id]){
            activeOrders[id].qty += 1;
        }else{
            activeOrders[id] = {id, name, price, image, qty: 1, note: ""}
        };

        renderOrderList();
    });
});

function renderOrderList(){
    const activeOrders = orders[currentOrderType];
    orderListElement.innerHTML = "";

    if(Object.keys(activeOrders).length === 0){
        orderListElement.innerHTML = `<h1 class="empty-order">No Menu Selected</h1>`;
        orderSummaryElement.style.display = "none";
        nominalInputWrapper.style.display = "none";
        payButton.style.backgroundColor = "#C4C4C4";
        return;
    };

    orderSummaryElement.style.display = "block";
    nominalInputWrapper.style.display = "flex";

    let subTotal = 0;

    Object.values(activeOrders).forEach(item => {
        subTotal += item.price * item.qty;

        const row = document.createElement("div");
        row.className = "order-item";
        row.dataset.id = item.id;
        row.innerHTML = `
            <img src="${item.image}" id="itemImage">
            <div class="order-info">
                <div class="order-delete">
                    <img src="assets/trash_icon.png" onclick="deleteOrder('${item.id}')">
                </div>
                <div class="item-info">
                    <div class="name-and-price">
                        <strong>${item.name}</strong>
                        <span>${format(item.price)}</span>
                    </div>


                    
                    <div class="qty-and-edit">
                        <div class="order-edit">
                            <img src="assets/edit-order-icon.png" alt="Edit Order Icon" width="16px" height="16px">
                            ${item.note ? `<p class="order-note">${item.note}</p>` : ""}
                        </div>
                        <div class="order-qty">
                            <button onClick="updateQty('${item.id}', -1)" id="minus">-</button>
                            <span>${item.qty}</span>
                            <button onClick="updateQty('${item.id}', 1)" id="plus">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        orderListElement.appendChild(row);
    });

    const tax = taxRate;
    const total = subTotal + tax;

    subTotalElement.textContent = `Rp. ${format(subTotal)}`;
    taxElement.textContent = `Rp ${format(tax)}`;
    totalElement.textContent = `Rp ${format(total)}`;

    payButton.style.backgroundColor = "#3572EF";
};

function updateQty(id, change){
    const activeOrders = orders[currentOrderType];

    if(!activeOrders[id]) return;

    activeOrders[id].qty += change;
    if(activeOrders[id].qty <= 0){
        delete activeOrders[id];
    };

    renderOrderList();

    // Jika order kosong
    if(Object.keys(orders).length === 0){
        orderListElement.innerHTML = `<h1 class="empty-order">No Menu Selected</h1>`;
        orderSummaryElement.style.display = "none";
        payButton.style.backgroundColor = "#C4C4C4";
    };
};

function deleteOrder(id){
    const activeOrders = orders[currentOrderType];
    delete activeOrders[id];
    // delete orders[id];
    renderOrderList();

    if(Object.keys(orders).length === 0){
        orderListElement.innerHTML = `<h1 class="empty-order">No Menu Selected</h1>`;
        orderSummaryElement.style.display == "none";
        payButton.style.backgroundColor = "#C4C4C4";
    };
};

function format(num){
    return num.toLocaleString('id-ID');
};

// Add to Order Archive
// document.querySelectorAll(".order-archive, .order-archive-icon").forEach(btn => {
//     btn.addEventListener("click", function (e) {
//         e.preventDefault();
//         e.stopPropagation();

//         saveOrderToArchive();
//         openArchiveModal();
//     });
// });

const openArchiveBtn = document.getElementById("openOrderArchive");

openArchiveBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    openArchiveModal();
});

const listOrderArchiveBtn = document.getElementById("listOrderArchive");

listOrderArchiveBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // validasi agar archive yang kosong tidak masuk data
    const activeOrders = orders[currentOrderType];
    if (Object.keys(activeOrders).length === 0) return;

    saveOrderToArchive();
    openArchiveModal();
});

function saveOrderToArchive(){
    const orderType = currentOrderType; // snapshot type
    const activeOrders = orders[orderType];

    if (!activeOrders || Object.keys(activeOrders).length === 0) return;

    const typeText = orderType === "dinein" ? "Dine In" : "Take Away";
    const customerName = document.getElementById("customer-name")?.value.trim() || "-";
    const tableText = document.querySelector(".selected-text")?.innerText || "-";

    const items = Object.values(activeOrders).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        note: item.note || "",
        image: item.image || ""
    }));

    if (items.length === 0) return;

    const archiveData = {
        orderId: currentOrderId,
        type: typeText,
        customer: customerName,
        table: tableText,
        total: calculateTotal(orderType),
        items,
        createdAt: new Date().toISOString()
    };

    archivedOrders.push(archiveData);
    renderArchiveList(archivedOrders);

    resetOrderAfterArchive();
};

function calculateTotal(orderType = currentOrderType) {
    const activeOrders = orders[orderType];

    return Object.values(activeOrders).reduce((total, item) => {
        return total + item.price * item.qty;
    }, 0);
}

function resetOrderAfterArchive() {
    orders[currentOrderType] = {};

    orderListElement.innerHTML =
        '<h1 class="empty-order">No Menu Selected</h1>';

    document.getElementById("customer-name").value = "";
    document.querySelector(".selected-text").innerText = "Select No. Table";

    currentOrderId = generateOrderId();
    updateOrderIdUI();

    renderOrderList();
};

function clearCurrentOrder() {
    orders[currentOrderType] = {};
    renderOrderList();
}

// Dropdown Menu No Table List Order
const dropdown = document.getElementById("tableDropdown");
const toggle = dropdown.querySelector(".dropdown-toggle");
const items = dropdown.querySelectorAll(".dropdown-item li");
const selectedText = dropdown.querySelector(".selected-text");

// Munculkan Dropdown
toggle.addEventListener("click", function (e){
    e.preventDefault();
    dropdown.classList.toggle("active");
});

// Pilih Item Dropdown
items.forEach(item => {
    item.addEventListener("click", function (){
        selectedText.textContent = this.textContent;
        dropdown.classList.remove("active");
    });
});

// Tutup Dropdown Menu
document.addEventListener("click", function (e){
    if(!dropdown.contains(e.target)){
        dropdown.classList.remove("active");
    };
});


// Modal Transaction Success
const successModal = document.getElementById("successModal");
const closeSuccessModal = document.getElementById("closeSuccessModal");

payButton.addEventListener("click", () => {
    const activeOrders = orders[currentOrderType];

    if (Object.keys(activeOrders).length === 0) return;

    const nominalInput = document.getElementById("nominalInput");
    const paid = parseInt(nominalInput.value.replace(/\D/g, "") || 0);

    const subTotal = Object.values(activeOrders)
        .reduce((sum, item) => sum + item.price * item.qty, 0);

    const tax = taxRate;
    const total = subTotal + tax;

    if (paid < total) {
        alert("Nominal pembayaran kurang");
        return;
    }

    showSuccessModal({
        activeOrders,
        subTotal,
        tax,
        total,
        paid
    });
});

function showSuccessModal({ activeOrders, subTotal, tax, total, paid }) {
    document.getElementById("receiptOrderId").innerText = currentOrderId;
    document.getElementById("receiptDate").innerText =
        new Date().toLocaleString("id-ID");
    document.getElementById("receiptCustomer").innerText =
        document.getElementById("customer-name").value || "-";
    document.getElementById("receiptType").innerText =
        currentOrderType === "dinein" ? "Dine In" : "Take Away";

    const itemsContainer = document.getElementById("receiptItems");
    itemsContainer.innerHTML = "";

    Object.values(activeOrders).forEach(item => {
        const row = document.createElement("div");
        row.className = "receipt-item";

        row.innerHTML = `
            <div class="receipt-item-row">
                <span>${item.name} x${item.qty}</span>
                <span>Rp ${format(item.price * item.qty)}</span>
            </div>
            ${item.note ? `<small class="receipt-note">Catatan: ${item.note}</small>` : ""}
        `;

        itemsContainer.appendChild(row);
    });

    document.getElementById("receiptSubTotal").innerText =
        `Rp ${format(subTotal)}`;
    document.getElementById("receiptTax").innerText =
        `Rp ${format(tax)}`;
    document.getElementById("receiptTotal").innerText =
        `Rp ${format(total)}`;

    document.getElementById("receiptPaid").innerText =
        `Rp ${format(paid)}`;
    document.getElementById("receiptChange").innerText =
        `Rp ${format(paid - total)}`;

    successModal.style.display = "flex";
};

closeSuccessModal.addEventListener("click", () => {
    successModal.style.display = "none";
    resetOrderAfterArchive(); // atau clearCurrentOrder()
});

window.addEventListener("click", e => {
    if (e.target === successModal) {
        successModal.style.display = "none";
        resetOrderAfterArchive();
    }
});