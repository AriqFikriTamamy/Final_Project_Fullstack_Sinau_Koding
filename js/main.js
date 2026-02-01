if (document.body.classList.contains("page-cashier")) {
    import("./pages/cashier.page.js");
};

if (document.body.classList.contains("page-sales-report")) {
    import("./pages/sales-report.page.js");
};

const categoryButtons = document.querySelectorAll(".category-menu > div");
const menuCards = document.querySelectorAll(".menu-list-card");

categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        categoryButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        menuCards.forEach(card => {
        const category = card.dataset.category;
        card.style.display =
            filter === "all" || category === filter ? "block" : "none";
        });
    });
});