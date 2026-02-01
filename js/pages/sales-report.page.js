// import { on } from "../core/helpers.js";
// import { openArchiveModal } from "../modules/archive.js";

// const openArchiveBtn = document.getElementById("openOrderArchive");

// on(openArchiveBtn, "click", e => {
//     e.preventDefault();
//     openArchiveModal();
// });

// import { openArchiveModal, initArchive, bindArchiveSearch } from "../modules/archive.js";
// import { on } from "../core/helpers.js";

// initArchive();
// bindArchiveSearch();

// on(document.getElementById("openOrderArchive"), "click", e => {
//     e.preventDefault();
//     openArchiveModal();
// });

import { createOrderState, addItem } from "../modules/order.js";
import { bindMenuClick } from "../modules/menu.js";
import { openArchiveModal, initArchive, bindArchiveSearch, renderArchiveList } from "../modules/archive.js";
import { on } from "../core/helpers.js";

const btn = document.getElementById("openOrderArchive");
const state = createOrderState();

initArchive();
bindArchiveSearch();

const menuList = document.getElementById("menuList");

bindMenuClick(menuList, item => {
    addItem(state, item);
    console.log("ORDER:", state);
});

// on(document.getElementById("openOrderArchive"), "click", e => {
//     e.preventDefault();
//     openArchiveModal();
// });

on(btn, "click", e => {
    e.preventDefault();
    console.log("ARCHIVE CLICKED");
    openArchiveModal();
});

document.getElementById("openOrderArchive")?.addEventListener("click", () => {
    renderArchiveList(getArchivedOrders());
    document.getElementById("orderArchiveModal").style.display = "flex";
});