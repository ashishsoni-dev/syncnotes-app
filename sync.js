import { db } from "./state.js";

export function addToQueue(action) {
    let tx = db.transaction("syncQueue", "readwrite");
    let store = tx.objectStore("syncQueue");

    store.add(action);
}

function fakeServerSync(action) {
    // simulate 80% success
    return Math.random() > 0.2;
}

export function processQueue() {

    if (!db) {
        console.log("DB not ready yet");
        return;
    }

    let tx = db.transaction("syncQueue", "readwrite");
    let store = tx.objectStore("syncQueue");

    let request = store.getAll();

    request.onsuccess = function () {
        let actions = request.result;

        actions.forEach(function (action) {
            let success = fakeServerSync(action);

            if (success) {
                console.log("Synced:", action);

                // delete ONLY this action
                store.delete(action.id);

            } else {
                console.log("Failed:", action);
                // keep it for retry
            }
        });
    };
}