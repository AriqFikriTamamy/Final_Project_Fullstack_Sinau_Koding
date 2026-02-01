export function on(el, event, handler) {
    if (el) el.addEventListener(event, handler);
}

// export function format(num) {
//     const safeNumber = Number(num);
//     if (Number.isNaN(safeNumber)) return "0";
//     return safeNumber.toLocaleString("id-ID");
// }

export function formatDate(date) {
    return new Date(date).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

// export function formatRupiah(value = 0) {
//     const number = Number(value) || 0;
//     return "Rp. " + number.toLocaleString("id-ID");
// }

export function format(number) {
    const value = Number(number) || 0;
    return value.toLocaleString("id-ID");
}

export function generateOrderId() {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    return `ORDR#${random}`;
}