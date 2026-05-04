import { db } from "./state.js";
import { saveNote, deleteNoteById } from "./storage.js";

let editingId = null; // temporary (we’ll move later)
let invalidText = document.getElementById("invalidText");
let successText = document.getElementById("successText");
let input = document.getElementById("inputField");
input.disabled = true;
let saveBtn = document.getElementById("changeButton");
let pendingDelete = null;
let undoTimer = null;

input.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {
        e.preventDefault();
        saveBtn.click();
    }

});

export function renderNotes(notes) {
    displayText.innerHTML = "";

    if (notes.length === 0) {
        displayText.innerHTML = `<div class="empty">No notes yet 👆</div>`;
        return;
    }

    for (let i = 0; i < notes.length; i++) {
        displayText.innerHTML += `
            <div class="note-card" data-id="${notes[i].id}">${i + 1}.&nbsp; 
                <span class="note-text"> ${notes[i].content}</span>

                <div class="note-actions">
                    <button class="edit-btn" data-id="${notes[i].id}">Edit</button>
                    <button class="delete-btn" data-id="${notes[i].id}">Delete</button>
                </div>
            </div>
        `;
    }
}

export function loadNotes() {
    let tx = db.transaction("notes", "readonly");
    let store = tx.objectStore("notes");
    let getAllRequest = store.getAll();

    getAllRequest.onsuccess = function () {
        let notes = getAllRequest.result;
        renderNotes(notes);
    }
}


saveBtn.addEventListener("click", function () {

    let note = input.value;

    if (note.trim() === "") {
        invalidText.textContent = "Please enter a note.";
        successText.textContent = "";
        return;
    }

    invalidText.textContent = "";

    saveNote(note, editingId, function () {
        loadNotes();
    });
    saveBtn.textContent = "Save Note";
    // message handling
    if (editingId) {
        successText.textContent = "Note updated successfully.";
    } else {
        successText.textContent = "Note saved successfully.";
    }

    // reset state
    editingId = null;
    input.value = "";
    input.placeholder = "Type something...";

    // remove highlight
    document.querySelectorAll(".note-card").forEach(card => {
        card.classList.remove("active");
    });

    // auto-hide message
    setTimeout(() => {
        successText.textContent = "";
    }, 2000);
});

displayText.addEventListener("click", function (e) {

    let id = e.target.dataset.id;
    if (!id) return;

    // EDIT
    if (e.target.classList.contains("edit-btn")) {
        document.querySelectorAll(".note-card").forEach(card => {
            card.classList.remove("active");
        });

        let card = e.target.closest(".note-card");
        card.classList.add("active");

        editingId = Number(id);

        let text = card.querySelector(".note-text").textContent;

        input.value = text;
        input.focus();
        input.placeholder = "Editing note...";

        return;
    }

    // DELETE
    if (e.target.classList.contains("delete-btn")) {

        let card = e.target.closest(".note-card");
        let id = Number(e.target.dataset.id);

        let text = card.querySelector(".note-text").textContent;

        card.classList.add("removing");
        setTimeout(() => {
            card.remove();
        }, 300);

        pendingDelete = { id };

        successText.innerHTML = `Note deleted. <span id="undoBtn" style="cursor:pointer; text-decoration:underline;">Undo</span>`;

        // delay DB deletion
        undoTimer = setTimeout(() => {
            deleteNoteById(id, function () {
                loadNotes();
            });
            pendingDelete = null;
        }, 3000);

    }

    return;
});

document.addEventListener("click", function (e) {

    if (e.target.id === "undoBtn" && pendingDelete) {

        clearTimeout(undoTimer);

        loadNotes();

        successText.textContent = "Note restored.";

        pendingDelete = null;
    }

});
