import { setDB } from "./state.js";
import { db } from "./state.js";
import { addToQueue } from "./sync.js";

export function initDB(onReady) {
    let request = indexedDB.open("NotesDB", 1);

    request.onupgradeneeded = function (event) {
        let database = event.target.result;

        database.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
        database.createObjectStore("syncQueue", { keyPath: "id", autoIncrement: true });
    };

    request.onsuccess = function (event) {
        console.log("DB opened.");

        setDB(event.target.result);

        onReady();
    };
}

export function saveNote(note, editingId, callback) {

    if (!db) {
        console.log("DB not ready yet");
        return;
    }

    let tx = db.transaction("notes", "readwrite");
    let store = tx.objectStore("notes");

    if (editingId === null) {
        store.add({
            content: note,
            updatedAt: Date.now()
        });
        addToQueue({ action: "add", content: note });

    } else {
        store.put({
            id: editingId,
            content: note,
            updatedAt: Date.now()
        });
        addToQueue({ action: "update", id: editingId, content: note });
    }

    tx.oncomplete = function () {
        callback();
    };
}

export function deleteNoteById(id, callback) {
    let tx = db.transaction("notes", "readwrite");
    let store = tx.objectStore("notes");

    store.delete(id);

    addToQueue({ action: "delete", id: id });

    tx.oncomplete = function () {
        callback();
    };
}


export function deleteNoteByIndex(index, callback) {
    let tx = db.transaction("notes", "readwrite");
    let store = tx.objectStore("notes");

    let request = store.getAll();

    request.onsuccess = function () {
        let notes = request.result;

        let note = notes[index];

        if (!note) {
            return
        };
        store.delete(note.id);
        addToQueue({ action: "delete", id: note.id });
    };

    tx.oncomplete = function () {
        callback();
    };
}