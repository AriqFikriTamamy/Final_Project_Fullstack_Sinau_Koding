// Report Date Title
function showDate(){
    const dateTime = new Date();

    const arrayDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const arrayMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];

    let day = arrayDay[dateTime.getDay()];
    let date = dateTime.getDate();
    let month = arrayMonth[dateTime.getMonth()];
    let year = dateTime.getFullYear();

    let result = `${day} ${date} ${month} ${year}`;

    document.getElementById("reportTime").innerText = result;
};

showDate()

// Dropdown Category
const dropdownCategory = document.getElementById("categoryDropdown");

if (dropdownCategory) {
    const toggle = dropdownCategory.querySelector(".dropdown-toggle");
    const items = dropdownCategory.querySelectorAll(".dropdown-item li");
    const selectedText = dropdownCategory.querySelector(".selected-text");

    toggle.addEventListener("click", function (e){
        e.preventDefault();
        dropdownCategory.classList.toggle("active");
    });

    items.forEach(item => {
        item.addEventListener("click", function (){
            selectedText.textContent = this.textContent;
            dropdownCategory.classList.remove("active");
        });
    });

    document.addEventListener("click", function (e){
        if(!dropdownCategory.contains(e.target)){
            dropdownCategory.classList.remove("active");
        }
    });
};

// Dropdown Order Type
const dropdownOrderType = document.getElementById("orderTypeDropdown");

if (dropdownOrderType) {
    const toggle = dropdownOrderType.querySelector(".dropdown-toggle");
    const items = dropdownOrderType.querySelectorAll(".dropdown-item li");
    const selectedText = dropdownOrderType.querySelector(".selected-text");

    toggle.addEventListener("click", function (e){
        e.preventDefault();
        dropdownOrderType.classList.toggle("active");
    });

    items.forEach(item => {
        item.addEventListener("click", function (){
            selectedText.textContent = this.textContent;
            dropdownOrderType.classList.remove("active");
        });
    });

    document.addEventListener("click", function (e){
        if(!dropdownOrderType.contains(e.target)){
            dropdownOrderType.classList.remove("active");
        }
    });
};

// Modal Export Data Button
const exportDataModal = document.getElementById("exportDataModal");
const openModal = document.getElementById("dataExport");
const closeModalExport = document.getElementById("closeModalExport");
const exportExcel = document.getElementById("exportExcel")
const exportPDF = document.getElementById("exportPDF")

if(exportDataModal && openModal){
    openModal.addEventListener("click", () => {

        exportDataModal.style.display = "flex";
    })
}

if (closeModalExport && exportDataModal) {
    closeModalExport.addEventListener("click", () => {
        exportDataModal.style.display = "none";
    });
}

window.addEventListener("click", e => {
    if (e.target === exportDataModal) {
        exportDataModal.style.display = "none";
    }
});

// Dropdown Show Data Entries
const entriesDropdown = document.getElementById("entriesDropdown");

if(entriesDropdown){
    const toggle = entriesDropdown.querySelector(".dropdown-toggle");
    const items = entriesDropdown.querySelectorAll(".dropdown-item li");
    const selectedText = entriesDropdown.querySelector(".selected-text");

    toggle.addEventListener("click", (e) => {
        e.preventDefault();
        entriesDropdown.classList.toggle("active");
    });

    items.forEach(item => {
        item.addEventListener("click", function() {
            selectedText.textContent = this.textContent;
            entriesDropdown.classList.remove("active");
        });
    });

    document.addEventListener("click", (e) => {
        if(!entriesDropdown.contains(e.target)){
            entriesDropdown.classList.remove("active")
        }
    });
};

// Sales |Report Pagination
document.addEventListener("DOMContentLoaded", () => {
const pagination = document.querySelector(".recent-data-pagination");

const totalPages = 10;
let currentPage = 1;
const visiblePages = 3;

function renderPagination() {
    pagination.innerHTML = "";

    const prev = document.createElement("div");
    prev.className = "pagination-btn pagination-prev";
    prev.innerHTML = `<img src="assets/previous-pagination-icon.png" alt="Previous">`;

    if (currentPage === 1){
        prev.classList.add("is-disabled");
    } else {
        prev.classList.add("is-active");
    }

    prev.addEventListener("click", () => changePage(currentPage - 1));
    pagination.appendChild(prev);

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + visiblePages - 1);

    if (start > 1) {
        pagination.appendChild(createPage(1));
        if (start > 2) pagination.appendChild(createEllipsis());
    }

    for (let i = start; i <= end; i++) {
        pagination.appendChild(createPage(i));
    }

    if (end < totalPages) {
        if (end < totalPages - 1) pagination.appendChild(createEllipsis());
        pagination.appendChild(createPage(totalPages));
    }

    const next = document.createElement("div");
    next.className = "pagination-btn pagination-next";
    next.innerHTML = `<img src="assets/next-pagination-icon.png" alt="Next">`;

    if (currentPage === totalPages){
        next.classList.add("is-disabled");
    } else {
        next.classList.add("is-active");
    }

    next.addEventListener("click", () => changePage(currentPage + 1));
    pagination.appendChild(next);
}

function createPage(page) {
    const el = document.createElement("div");
    el.className = "pagination-page";
    el.innerHTML = `<p>${page}</p>`;

    if (page === currentPage) el.classList.add("is-active");

    el.addEventListener("click", () => changePage(page));
    return el;
}

function createEllipsis() {
    const el = document.createElement("span");
    el.className = "pagination-ellipsis";
    el.textContent = "...";
    return el;
}

function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderPagination();

    console.log("Halaman aktif: ", currentPage);
}
    renderPagination();
});

// Modal Detail Foods Summary
const foodsDetailSummary = () => {
    const foodsSummaryModal = document.getElementById("foodsDetailSummary");
    const openModalFoods = document.getElementById("foodsSummary");
    const closeModalFoods = document.getElementById("closeModalFoods");

    if(foodsSummaryModal && openModalFoods ){
        openModalFoods .addEventListener("click", () => {
            foodsSummaryModal.style.display = "flex";
        })
    }

    if (closeModalFoods && foodsSummaryModal) {
        closeModalFoods.addEventListener("click", () => {
            foodsSummaryModal.style.display = "none";
        });
    }

    window.addEventListener("click", e => {
        if (e.target === foodsSummaryModal) {
            foodsSummaryModal.style.display = "none";
        }
    });
    //Foods Detail Search
    const searchFoodsInput = document.getElementById("foodsSummarySearch")

    searchFoodsInput.addEventListener("input", function(){
        const keyword = this.value.toLowerCase().trim();
        const rows = document.querySelectorAll(".foods-table-data");

        rows.forEach(row => {
            const menuName = row.querySelector(".foods-name-data").textContent.toLowerCase();
            const foodsSalesData = row.querySelector(".foods-sales-data").textContent.toLowerCase();

            const isMatch = menuName.includes(keyword) || foodsSalesData.includes(keyword);
            row.style.display = isMatch ? "" : "none";
        });

    });
};

foodsDetailSummary();

//Modal Detail Beverages Summary
const beveragesDetailSummary = () => {
    const beveragesSummaryModal = document.getElementById("beveragesDetailSummary");
    const openModalBeverages = document.getElementById("beveragesSummary");
    const closeModalBeverages = document.getElementById("closeModalBeverages");

    if(openModalBeverages && beveragesSummaryModal){
        openModalBeverages.addEventListener("click", () => {
            beveragesSummaryModal.style.display = "flex";
        })
    };

    if(closeModalBeverages && beveragesSummaryModal){
        closeModalBeverages.addEventListener("click", () => {
            beveragesSummaryModal.style.display = "none";
        })
    };

    window.addEventListener("click", (e) => {
        if(e.target === beveragesSummaryModal){
            beveragesSummaryModal.style.display = "none";
        };
    });

    //Beverages Detail Search
    const searchBeveragesInput = document.getElementById("beveragesSummarySearch");
    
    searchBeveragesInput.addEventListener("input", function(){
        const keyword = this.value.toLowerCase().trim();
        const rows = document.querySelectorAll(".beverages-table-data");

        rows.forEach(row => {
            const menuName = row.querySelector(".beverages-name-data").textContent.toLowerCase();
            const beveragesSalesData = row.querySelector(".beverages-sales-data").textContent.toLowerCase();

            const isMatch = menuName.includes(keyword) || beveragesSalesData.includes(keyword);
            row.style.display = isMatch ? "" : "none";
        })
    })
};

beveragesDetailSummary();

//Modal Detail Desserts Summary
const dessertsDetailSummary = () => {
    const dessertsSummaryModal = document.getElementById("dessertsDetailSummary");
    const openModalDesserts = document.getElementById("dessertsSummary");
    const closeModalDesserts = document.getElementById("closeModalDesserts");

    if(openModalDesserts && dessertsSummaryModal){
        openModalDesserts.addEventListener("click", () => {
            dessertsSummaryModal.style.display = "flex";
        });
    };

    if(closeModalDesserts && dessertsSummaryModal){
        closeModalDesserts.addEventListener("click", () => {
            dessertsSummaryModal.style.display = "none";
        });
    };

    window.addEventListener("click", (e) => {
        if(e.target === dessertsSummaryModal){
            dessertsSummaryModal.style.display = "none";
        };
    });

    //Desserts Detail Search
    const searchDessertsInput = document.getElementById("dessertsSummarySearch");

    searchDessertsInput.addEventListener("input", function() {
        const keywords = this.value.toLowerCase().trim();
        const rows = document.querySelectorAll(".desserts-table-data");

        rows.forEach(row => {
            const menuName = row.querySelector(".desserts-name-data").textContent.toLowerCase();
            const dessertsSalesData = row.querySelector(".desserts-sales-data").textContent.toLowerCase();

            const isMatch = menuName.includes(keywords) || dessertsSalesData.includes(keywords);
            row.style.display = isMatch ? "" : "none";
        });
    });
};

dessertsDetailSummary();

// Modal Detail Transaction Order
const detailTransactionPopup = () => {
    const detailTransactionModal = document.getElementById("detailTransactionModal");
    const openModalDetail = document.querySelectorAll(".open-detail-modal");
    const closeModalDetail = document.getElementById("closeModalDetail");

    if(openModalDetail && detailTransactionModal){
        // openModalDetail.addEventListener("click", () => {
        //     detailTransactionModal.style.display = "flex";
        // });

        openModalDetail.forEach(btn => {
            btn.addEventListener("click", () => {
                detailTransactionModal.style.display = "flex";
            });
        });
    };

    if(closeModalDetail && detailTransactionModal){
        closeModalDetail.addEventListener("click", () => {
            detailTransactionModal.style.display = "none";
        });
    };

    window.addEventListener("click", (e) => {
        if(e.target === detailTransactionModal){
            detailTransactionModal.style.display = "none";
        };
    });
};

detailTransactionPopup();
