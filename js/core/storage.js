const KEY = "archivedOrders";

export function getArchivedOrders() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
};

export function saveArchivedOrders(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
};