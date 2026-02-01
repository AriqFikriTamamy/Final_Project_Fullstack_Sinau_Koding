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
