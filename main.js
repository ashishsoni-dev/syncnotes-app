import { initDB } from "./storage.js";
import { loadNotes } from "./ui.js";
import { processQueue } from "./sync.js";

window.addEventListener("online", function () {
    processQueue();
});

initDB(function () {
    loadNotes();

    let input = document.getElementById("inputField");
    input.disabled = false;

    if (navigator.onLine) {
        processQueue();
    }
});