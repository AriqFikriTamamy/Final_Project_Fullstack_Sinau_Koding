// Modal Export Data Button
const exportDataModal = document.getElementById("exportDataModal");
const openModal = document.getElementById("dataExport");
const closeModal = document.getElementById("closeModal");
const modalName = document.getElementById("modalMenuName");
const modalImage = document.getElementById("modalMenuImage");
const modalDesc = document.getElementById("modalMenuDescription");
const modalPrice = document.getElementById("modalMenuPrice");
const modalBadge = document.getElementById("modalMenuBadge");

if(exportDataModal){
    openModal.addEventListener("click", (e) => {

        exportDataModal.style.display = "flex";
    })
}

if (closeModal && exportDataModal) {
    closeModal.addEventListener("click", () => {
        exportDataModal.style.display = "none";
    });
}

window.addEventListener("click", e => {
    if (e.target === menuModal) {
        exportDataModal.style.display = "none";
    }
});