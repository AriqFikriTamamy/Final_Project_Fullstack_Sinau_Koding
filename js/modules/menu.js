import { format } from "../core/helpers.js";
export function renderMenuList(container, menus) {
    if (!container) return;

    container.innerHTML = "";

    menus.forEach(menu => {
        const card = document.createElement("div");
        card.className = "menu-list-card";
        card.dataset.id = menu.id;
        card.dataset.name = menu.name;
        card.dataset.description = menu.name;
        card.dataset.price = menu.price;
        card.dataset.category = menu.category;
        card.dataset.image = menu.image;

        card.innerHTML = `
        <div class="menu-content">
            <div class="menu-image">
            <img src="${menu.image}" alt="${menu.name}">
            <div class="category-badge">
                <p>${menu.category}</p>
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
                <img src="assets/order-menu-icon.png">
            </a>
            </div>
        </div>
        `;

        container.appendChild(card);
    });
};

export function bindMenuClick(container, handler) {
    if (!container) return;

    container.addEventListener("click", e => {
        e.preventDefault();

        const card = e.target.closest(".menu-list-card");
        if (!card) return;

        handler({
            id: card.dataset.id,
            name: card.dataset.name,
            price: Number(card.dataset.price),
            image: card.dataset.image
        });
    });
}
