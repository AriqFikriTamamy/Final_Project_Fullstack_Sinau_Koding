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
    card.addEventListener("click", () => {
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
        payButton.style.backgroundColor = "#C4C4C4";
        return;
    };

    orderSummaryElement.style.display = "block";

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

    // if(!orders[id]) return;
    // orders[id].qty += change;
    // if(orders[id].qty <= 0){
    //     delete orders[id];
    // };

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