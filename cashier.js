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

function filterArchiveOrders() {
    const keyword = document
        .getElementById("searchArchiveInput")
        .value
        .toLowerCase()
        .trim();

    const typeFilter = document.getElementById("archiveTypeFilter").value;

    const filteredData = archivedOrders.filter(order => {
        const matchKeyword =
            order.orderId.toLowerCase().includes(keyword) ||
            order.customer.toLowerCase().includes(keyword) ||
            order.table.toLowerCase().includes(keyword);

        const matchType = typeFilter ? order.type === typeFilter : true;

        return matchKeyword && matchType;
    });

    renderArchiveList(filteredData);
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

// document.getElementById("searchArchiveBtn").addEventListener("click", () => {
//     const keyword = document.getElementById("searchArchiveInput").value.toLowerCase();
//     const type = document.getElementById("archiveTypeFilter").value;

//     const filtered = archivedOrders.filter(order => {
//         const matchKeyword =
//         order.orderId.toLowerCase().includes(keyword) ||
//         order.customer.toLowerCase().includes(keyword);

//         const matchType = type ? order.type === type : true;

//         return matchKeyword && matchType;
//     });

//     renderArchiveList(filtered);
// });

document.getElementById("searchArchiveInput").addEventListener("input", filterArchiveOrders);

document.getElementById("archiveTypeFilter").addEventListener("change", filterArchiveOrders);

document.getElementById("searchArchiveBtn").addEventListener("click", filterArchiveOrders);

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

    const tableText = document.querySelector(".selected-text")?.innerText || "-";

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
        tableText,
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
    document.getElementById("tableNumber").innerText = 
        document.querySelector(".selected-text")?.innerText || "-";

    const itemsContainer = document.getElementById("receiptItems");
    itemsContainer.innerHTML = "";

    Object.values(activeOrders).forEach(item => {
        const row = document.createElement("div");
        row.className = "receipt-item";

        row.innerHTML = `
            <div class="receipt-item-row">
                <div class="receipt-name-price-item">
                    <span>${item.name}</span>
                    <span id="priceQty">${format(item.price * item.qty)}</span>
                </div>
                <span id="qtyXPrice">${item.qty} x Rp ${item.price} </span>
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

// Object Menu
const menus = [
    //Foods Menu
    {
        id: 1,
        category: "food",
        name: "Nasi Goreng Kampung",
        image: "https://images.unsplash.com/photo-1668839746796-c5bca3982957",
        description: "Nasi goreng tradisional dengan bawang, cabai, telur, dan ayam.",
        price: 25000
    },
    {
        id: 2,
        category: "food",
        name: "Rendang Daging Sapi",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        description: "Daging sapi dimasak dengan santan dan rempah khas Minang.",
        price: 45000
    },
    {
        id: 3,
        category: "food",
        name: "Sate Ayam Madura",
        image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
        description: "Sate ayam dengan saus kacang khas Madura.",
        price: 30000
    },
    {
        id: 4,
        category: "food",
        name: "Gado-Gado",
        image: "https://images.unsplash.com/photo-1707269561481-a4a0370a980a",
        description: "Sayuran rebus dengan saus kacang dan kerupuk.",
        price: 20000
    },
    {
        id: 5,
        category: "food",
        name: "Soto Ayam",
        image: "https://www.shutterstock.com/image-photo/soto-ayam-typical-indonesian-food-260nw-2517244091.jpg",
        description: "Soto ayam dengan kuah kuning dan koya.",
        price: 25000
    },
    {
        id: 6,
        category: "food",
        name: "Bakso Sapi",
        image: "https://img.freepik.com/foto-gratis/sudut-pandang-tinggi-susunan-mangkuk-bakso-lezat_23-2148967915.jpg?semt=ais_hybrid&w=740&q=80",
        description: "Bakso sapi dengan kuah kaldu dan mie.",
        price: 22000
    },
    {
        id: 7,
        category: "food",
        name: "Ayam Geprek",
        image: "https://www.shutterstock.com/image-photo/ayam-geprek-indonesian-food-crispy-600nw-1949306203.jpg",
        description: "Ayam goreng tepung dengan sambal pedas.",
        price: 23000
    },
    {
        id: 8,
        category: "food",
        name: "Nasi Uduk",
        image: "https://www.shutterstock.com/image-photo/nasi-uduk-dish-made-diaroned-260nw-2510230781.jpg",
        description: "Nasi gurih santan dengan lauk khas Betawi.",
        price: 20000
    },
    {
        id: 9,
        category: "food",
        name: "Pempek Palembang",
        image: "https://www.shutterstock.com/image-photo/pempek-mpekmpek-indonesian-slang-empekempek-260nw-2586079891.jpg",
        description: "Olahan ikan dengan kuah cuko asam pedas.",
        price: 28000
    },
    {
        id: 10,
        category: "food",
        name: "Rawon",
        image: "https://www.shutterstock.com/image-photo/rawon-indonesian-black-beef-soup-260nw-2286219153.jpg",
        description: "Sup daging sapi dengan kuah hitam khas Jawa Timur.",
        price: 35000
    },

    //Beverages Menu
    {
        id: 11,
        category: "beverages",
        name: "Es Teh Manis",
        image: "https://png.pngtree.com/png-vector/20240519/ourmid/pngtree-jumbo-iced-tea-transparent-background-png-image_12495350.png",
        description: "Teh manis dingin segar.",
        price: 5000
    },
    {
        id: 12,
        category: "beverages",
        name: "Es Jeruk",
        image: "https://img.freepik.com/foto-gratis/segelas-jus-jeruk-diletakkan-di-atas-kayu_1150-9661.jpg?semt=ais_hybrid&w=740&q=80",
        description: "Perasan jeruk segar dengan es batu.",
        price: 7000
    },
    {
        id: 13,
        category: "beverages",
        name: "Es Cendol",
        image: "https://www.shutterstock.com/image-photo/es-campur-cendol-cincau-600nw-2585426799.jpg",
        description: "Cendol dengan santan dan gula aren.",
        price: 12000
    },
    {
        id: 14,
        category: "beverages",
        name: "Es Campur",
        image: "https://st5.depositphotos.com/76634246/64711/i/450/depositphotos_647110546-stock-photo-fruit-soup-soup-prepared-using.jpg",
        description: "Campuran buah, cincau, dan sirup.",
        price: 15000
    },
    {
        id: 15,
        category: "beverages",
        name: "Es Kelapa Muda",
        image: "https://st.depositphotos.com/52939322/55514/i/450/depositphotos_555142042-stock-photo-kelapa-jeruk-typical-indonesian-drink.jpg",
        description: "Air kelapa muda segar.",
        price: 10000
    },
    {
        id: 16,
        category: "beverages",
        name: "Bajigur",
        image: "https://img-global.cpcdn.com/recipes/b680cdaf57abb4b9/228x268cq80/photo.jpg",
        description: "Minuman hangat santan dan gula aren.",
        price: 12000
    },
    {
        id: 17,
        category: "beverages",
        name: "Bandrek",
        image: "https://img-global.cpcdn.com/recipes/b8c7139f9d7ef649/200x200cq80/bandrek-foto-resep-utama.jpg",
        description: "Minuman jahe khas Sunda.",
        price: 12000
    },
    {
        id: 18,
        category: "beverages",
        name: "Wedang Jahe",
        image: "https://www.shutterstock.com/image-photo/wedang-jahe-one-indonesian-traditional-260nw-1707637867.jpg",
        description: "Minuman jahe hangat tradisional.",
        price: 10000
    },
    {
        id: 19,
        category: "beverages",
        name: "Es Dawet Ayu",
        image: "https://www.shutterstock.com/image-photo/dawet-ayu-traditional-drink-made-600nw-2340438975.jpg",
        description: "Dawet khas Banjarnegara.",
        price: 12000
    },
    {
        id: 20,
        category: "beverages",
        name: "Kopi Tubruk",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
        description: "Kopi hitam tradisional Indonesia.",
        price: 8000
    },

    //Dessert Menu
    {
        id: 21,
        category: "dessert",
        name: "Klepon",
        image: "https://www.shutterstock.com/image-photo/klepon-indonesian-popular-traditional-snack-260nw-2015476712.jpg",
        description: "Kue ketan isi gula merah.",
        price: 10000
    },
    {
        id: 22,
        category: "dessert",
        name: "Onde-Onde",
        image: "https://www.shutterstock.com/image-photo/onde-cake-on-table-260nw-2416199051.jpg",
        description: "Kue wijen isi kacang hijau.",
        price: 10000
    },
    {
        id: 23,
        category: "dessert",
        name: "Dadar Gulung",
        image: "https://cdn.grid.id/crop/0x0:0x0/filters:format(webp):quality(100)/photo/2020/06/06/135383365.jpg",
        description: "Pancake pandan isi kelapa manis.",
        price: 12000
    },
    {
        id: 24,
        category: "dessert",
        name: "Getuk",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4-QU5bY4URw81BAt3USxfrjMFXSeSSUmjAA&s",
        description: "Singkong tumbuk dengan gula.",
        price: 9000
    },
    {
        id: 25,
        category: "dessert",
        name: "Lapis Legit",
        image: "https://png.pngtree.com/png-vector/20250429/ourmid/pngtree-lapis-legit-cake-png-image_16069109.png",
        description: "Kue lapis khas Indonesia.",
        price: 15000
    },
    {
        id: 26,
        category: "dessert",
        name: "Serabi",
        image: "https://www.shutterstock.com/image-photo/this-traditional-food-indonesia-called-260nw-2483781697.jpg",
        description: "Pancake tradisional dengan santan.",
        price: 10000
    },
    {
        id: 27,
        category: "dessert",
        name: "Kue Lumpur",
        image: "https://hypeabis.id/assets/content/202309211340191695278419.jpg",
        description: "Kue lembut berbahan kentang.",
        price: 12000
    },
    {
        id: 28,
        category: "dessert",
        name: "Bubur Sumsum",
        image: "https://www.shutterstock.com/image-photo/rice-flour-coconut-milk-porridge-600nw-2252590039.jpg",
        description: "Bubur lembut dengan saus gula merah.",
        price: 10000
    },
    {
        id: 29,
        category: "dessert",
        name: "Es Pisang Ijo",
        image: "https://www.shutterstock.com/image-photo/rice-flour-coconut-milk-porridge-600nw-2252590039.jpg",
        description: "Pisang dibalut adonan hijau dengan sirup.",
        price: 15000
    },
    {
        id: 30,
        category: "dessert",
        name: "Kue Putu",
        image: "https://www.shutterstock.com/image-photo/putu-cake-kue-ayu-cakes-260nw-2233786323.jpg",
        description: "Kue bambu isi gula merah.",
        price: 10000
    }
];

const menuListElement = document.getElementById("menuList");

function renderMenuList(data) {
            menuListElement.innerHTML = "";

            data.forEach(menu => {
                const card = document.createElement("div");
                card.className = "menu-list-card";
                card.dataset.category = menu.category;
                card.dataset.id = menu.id;
                card.dataset.name = menu.name;
                card.dataset.price = menu.price;
                card.dataset.image = menu.image;

                card.innerHTML = `
                    <div class="menu-content">
                        <div class="menu-image">
                            <img src="${menu.image}" alt="${menu.name}">
                            <div class="category-badge">
                                <p>${capitalize(menu.category)}</p>
                            </div>
                        </div>

                        <div class="menu-name">
                            <h1>${menu.name}</h1>
                        </div>

                        <div class="menu-description">
                            <p>${menu.description}</p>
                        </div>

                        <div class="menu-price">
                            <p><span>Rp. ${format(menu.price)}</span>/portion</p>
                        </div>

                        <div class="detail-menu-icon">
                            <a href="#">
                                <img src="assets/order-menu-icon.png" alt="Order Menu Icon">
                            </a>
                        </div>
                    </div>
                `;

                menuListElement.appendChild(card);
            });

            updateTotalMenu(data.length);
}

function capitalize(text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
}

document.addEventListener("DOMContentLoaded", () => {
            renderMenuList(menus);
});

const categoryMenuButtons = document.querySelectorAll(".category-menu > div");

categoryMenuButtons.forEach(button => {
            button.addEventListener("click", () => {
                const filter = button.dataset.filter;

                categoryMenuButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                const filteredMenu =
                    filter === "all"
                        ? menus
                        : menus.filter(menu => menu.category === filter);

                renderMenuList(filteredMenu);
            });
});

menuListElement.addEventListener("click", function (e) {
            const card = e.target.closest(".menu-list-card");
            if (!card) return;

            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseInt(card.dataset.price);
            const image = card.dataset.image;

            const activeOrders = orders[currentOrderType];

            if (activeOrders[id]) {
                activeOrders[id].qty += 1;
            } else {
                activeOrders[id] = {
                    id,
                    name,
                    price,
                    image,
                    qty: 1,
                    note: ""
                };
            }

            renderOrderList();
});

const searchInput = document.getElementById("search");

// Search Bar Input
searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();

    // Ambil kategori aktif
    const activeCategoryBtn = document.querySelector(".category-menu > div.active");
    const activeCategory = activeCategoryBtn?.dataset.filter || "all";

    let filteredMenus = menus;

    // Filter berdasarkan kategori terlebih dahulu
    if (activeCategory !== "all") {
        filteredMenus = filteredMenus.filter(
            menu => menu.category === activeCategory
        );
    }

    // Filter berdasarkan keyword
    if (keyword !== "") {
        filteredMenus = filteredMenus.filter(menu =>
            menu.name.toLowerCase().includes(keyword) ||
            menu.description.toLowerCase().includes(keyword) ||
            menu.category.toLowerCase().includes(keyword)
        );
    }

    renderMenuList(filteredMenus);
});