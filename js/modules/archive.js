import { getArchivedOrders, saveArchivedOrders } from "../core/storage.js";
import { format, formatDate } from "../core/helpers.js";
import { calculateTotal } from "./order.js";

let cache = [];

export function initArchive() {
    cache = getArchivedOrders();
}

export function openArchiveModal() {
    const modal = document.getElementById("orderArchiveModal");
    const list = document.getElementById("orderArchiveList");

    if (!modal || !list) return;

    //AMBIL DATA TERBARU SETIAP KALI
    const archivedOrders = getArchivedOrders();

    list.innerHTML = "";

    if (archivedOrders.length === 0) {
        list.innerHTML = "<p>No archived orders</p>";
    } else {
        archivedOrders.forEach(order => {
            const div = document.createElement("div");
            div.className = "archive-card";

            div.innerHTML = `
                <div>
                    <strong>${order.orderId}</strong> • ${order.type}
                    <br>
                    <small>${formatDate(order.createdAt)}</small>
                </div>
                <div>Rp ${order.total.toLocaleString("id-ID")}</div>
            `;

            list.appendChild(div);
        });
    }

    modal.style.display = "flex";
}

export function bindArchiveSearch() {
    const input = document.getElementById("searchArchiveInput");
    const select = document.getElementById("archiveTypeFilter");

    if (input) input.addEventListener("input", filter);
    if (select) select.addEventListener("change", filter);
}

function filter() {
    const keyword =
        document.getElementById("searchArchiveInput").value.toLowerCase();
    const type =
        document.getElementById("archiveTypeFilter").value;

    const result = cache.filter(o => {
        const matchText =
            o.orderId.toLowerCase().includes(keyword) ||
            o.customer.toLowerCase().includes(keyword);

        const matchType = type ? o.type === type : true;
        return matchText && matchType;
    });

    render(result);
}

function render(data) {
    const list = document.getElementById("orderArchiveList");
    if (!list) return;

    list.innerHTML = "";

    if (!data || data.length === 0) {
        list.innerHTML = "<p>No archived orders</p>";
        return;
    }

    data.forEach(order => {
        const div = document.createElement("div");
        div.className = "archive-card";

        div.innerHTML = `
            <div>
                <strong>${order.orderId}</strong> • ${order.type}
                <br>
                <small>${new Date(order.createdAt).toLocaleString("id-ID")}</small>
            </div>
            <div>Rp ${order.total.toLocaleString("id-ID")}</div>
        `;

        list.appendChild(div);
    });
}

export function saveOrderToArchive(state, meta) {
    const activeOrders = state.orders[state.currentType];
    if (!activeOrders || Object.keys(activeOrders).length === 0) return;

    const archived = getArchivedOrders();

    archived.push({
        orderId: meta.orderId,
        type: state.currentType === "dinein" ? "Dine In" : "Take Away",
        customer: meta.customer,
        table: meta.table,
        items: Object.values(activeOrders),
        total: calculateTotal(state),
        createdAt: new Date().toISOString()
    });

    saveArchivedOrders(archived);
};

function normalizeArchiveData() {
    const raw = JSON.parse(localStorage.getItem("archivedOrders")) || [];

    const normalized = raw.map((order, index) => {
        const items = Array.isArray(order.items) ? order.items : [];

        const total =
            typeof order.total === "number"
                ? order.total
                : items.reduce(
                      (sum, i) => sum + (i.price || 0) * (i.qty || 1),
                    0
                );

        return {
            orderId: order.orderId || order.id || `ORDR#LEGACY${index + 1}`,
            type: order.type || order.orderType || "-",
            customer: order.customer || "-",
            table: order.table || "-",
            items,
            total,
            createdAt: order.createdAt || order.created || new Date().toISOString()
        };
    });

    saveArchivedOrders(normalized);
}

normalizeArchiveData();

const orderArchiveModal = document.getElementById("orderArchiveModal");
const closeOrderArchive = document.getElementById("closeOrderArchive");

closeOrderArchive.addEventListener("click", () => {
    orderArchiveModal.style.display = "none";
});

window.addEventListener("order:archived", () => {
    render(getArchivedOrders());
});

export function renderArchiveList(data) {
    const list = document.getElementById("orderArchiveList");
    if (!list) return;

    list.innerHTML = "";

    if (!data.length) {
        list.innerHTML = "<p>No archived orders</p>";
        return;
    }

    data.forEach((order, index) => {
        const card = document.createElement("div");
        card.className = "archive-card";
        card.dataset.index = index;

        card.innerHTML = `
            <div class="archive-info">
                <span>${order.orderId} | ${order.type}</span>
                <span>${formatDate(order.createdAt)}</span>
            </div>
            <div class="archive-total-and-use">
                <div>Rp ${format(Number(order.total))}</div>
                <div class="archive-use" data-index="${index}">▶</div>
            </div>
        `;

        list.appendChild(card);
    });
}