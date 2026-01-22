// Modal Detail Menu
const modal = document.getElementById("menuModal");
const closeModal = document.getElementById("closeModal");

const modalName = document.getElementById("modalMenuName");
const modalImage = document.getElementById("modalMenuImage");
const modalDesc = document.getElementById("modalMenuDescription");
const modalPrice = document.getElementById("modalMenuPrice");
const modalBadge = document.getElementById("modalMenuBadge");

document.querySelectorAll(".detail-menu-icon").forEach(icon => {
    icon.addEventListener("click", function (e) {
        e.preventDefault();

const card = this.closest(".menu-list-card");
    modalName.innerText = card.querySelector(".menu-name h1").innerText;
    modalDesc.innerText = card.querySelector(".menu-description p").innerText;
    modalPrice.innerText = card.querySelector(".menu-price span").innerText;
    modalImage.src = card.querySelector(".menu-image img").src;
    modalBadge.innerText = card.querySelector(".category-badge p").innerText;

    modal.style.display = "flex";
    });
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", e => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
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