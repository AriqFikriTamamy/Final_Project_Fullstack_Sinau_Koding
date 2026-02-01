import { openArchiveModal, initArchive, bindArchiveSearch, saveOrderToArchive } from "../modules/archive.js";
import { menus } from "../data/menu.data.js";
import { renderMenuList, bindMenuClick } from "../modules/menu.js";
import { createOrderState, addItem, renderOrderList, generateOrderId } from "../modules/order.js";

const menuList = document.getElementById("menuList");
const totalMenuCount = document.getElementById("totalMenuCount");

const state = createOrderState();

initArchive();
bindArchiveSearch();

["openOrderArchive", "listOrderArchive"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener("click", e => {
            e.preventDefault();
            openArchiveModal();
            console.log("OPEN ARCHIVE CLICKED");
        });
    }
});

// const archiveBtn = document.getElementById("listOrderArchive");

// archiveBtn.addEventListener("click", e => {
//     e.preventDefault();
//     e.stopPropagation();

//     const activeOrders = state.orders[state.currentType];

//     if (!activeOrders || Object.keys(activeOrders).length === 0) {
//         alert("List Order masih kosong");
//         return;
//     }

//     saveOrderToArchive(state, {
//         orderId: currentOrderId,
//         customer: document.getElementById("customer-name")?.value || "-",
//         table: document.querySelector(".selected-text")?.textContent || "-"
//     });

//     state.orders[state.currentType] = {};

//     currentOrderId = generateOrderId();
//     orderIdSpan.textContent = currentOrderId;

//     renderOrderList(orderList, state);
// });

document.querySelector(".category-menu")
    .addEventListener("click", e => {
        const card = e.target.closest("[data-filter]");
        if (!card) return;

        document.querySelectorAll("[data-filter]")
            .forEach(c => c.classList.remove("active"));

        card.classList.add("active");

        const filter = card.dataset.filter;

        document.querySelectorAll(".menu-list-card").forEach(menu => {
            const show =
                filter === "all" ||
                menu.dataset.category === filter;

            menu.style.display = show ? "block" : "none";
        });
    }
);

// RENDER MENU
renderMenuList(menuList, menus);
totalMenuCount.textContent = `${menus.length} Menu`;

// EVENT KLIK MENU
bindMenuClick(menuList, item => {
    addItem(state, item);
    renderOrderList(orderList, state)
    // console.log("ORDER:", state);
});

// Dropdown No. table
const tableDropdown = document.getElementById("tableDropdown");
const selectedText = tableDropdown?.querySelector(".selected-text");
const items = tableDropdown?.querySelectorAll(".dropdown-item li");

// Buka dropdown
tableDropdown?.querySelector(".dropdown-toggle")
    .addEventListener("click", e => {
        e.preventDefault();
        tableDropdown.classList.toggle("active");
    }
);

// Pilih item
items?.forEach(item => {
    item.addEventListener("click", () => {
        selectedText.textContent = item.textContent;
        tableDropdown.classList.remove("active");
    });
});

// Klik di luar → tutup
document.addEventListener("click", e => {
    if (!tableDropdown.contains(e.target)) {
        tableDropdown.classList.remove("active");
    }
});

// Tipe Order (DIne In atau Take Away)
const dineInBtn = document.querySelector(".order-dine-in");
const takeAwayBtn = document.querySelector(".order-take-away");

dineInBtn.addEventListener("click", () => {
    state.currentType = "dinein";
    dineInBtn.classList.add("active");
    takeAwayBtn.classList.remove("active");
    renderOrderList(orderList, state);
});

takeAwayBtn.addEventListener("click", () => {
    state.currentType = "takeaway";
    takeAwayBtn.classList.add("active");
    dineInBtn.classList.remove("active");
    renderOrderList(orderList, state);
});

// Generate Order ID
// import { generateOrderId } from "../modules/order.js";

const orderIdSpan = document.querySelector(".list-order-title h2 span");
let currentOrderId = generateOrderId();

orderIdSpan.textContent = currentOrderId;

document.getElementById("listOrderArchive")
    .addEventListener("click", e => {
        e.preventDefault();

        saveOrderToArchive(state, {
            orderId: currentOrderId,
            customer: document.getElementById("customer-name").value,
            table: document.querySelector(".selected-text").textContent
        });

        // reset
        state.orders[state.currentType] = {};
        currentOrderId = generateOrderId();
        orderIdSpan.textContent = currentOrderId;

        renderOrderList(orderList, state);
    }
);

// Filter Menu Berdasarkan Kategori
const categoryMenu = document.querySelector(".category-menu");

categoryMenu.addEventListener("click", e => {
    const target = e.target.closest("[data-filter]");
    if (!target) return;

    // UI active
    categoryMenu.querySelectorAll("[data-filter]")
        .forEach(el => el.classList.remove("active"));
    target.classList.add("active");

    const filter = target.dataset.filter;

    // filter menu
    document.querySelectorAll(".menu-list-card").forEach(card => {
        const show =
            filter === "all" ||
            card.dataset.category === filter;

        card.style.display = show ? "block" : "none";
    });
});