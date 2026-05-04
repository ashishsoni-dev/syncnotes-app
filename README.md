# SyncNotes

SyncNotes is a lightweight, offline-first notes application built using pure JavaScript. It is designed to work seamlessly without an internet connection while maintaining a structured approach to data storage and synchronization.

## Overview

The application allows users to create, edit, and delete notes with a smooth and responsive user interface. It uses IndexedDB for persistent local storage and implements a queue-based sync system to simulate real-world backend synchronization behavior.

The project focuses on clean architecture, separation of concerns, and real-world application patterns such as async data handling, state management, and user experience improvements.

## Features

- Create, edit, and delete notes
- Offline-first functionality using IndexedDB
- Sync queue system for handling offline changes
- Undo delete functionality with delayed execution
- Smooth UI interactions with animations
- Keyboard support (Enter to save)
- Modular architecture (UI, storage, sync, state separation)

## Tech Stack

- JavaScript (ES6 Modules)
- IndexedDB (Browser Storage)
- HTML5
- CSS3

## Architecture

The project is structured into separate modules to ensure clarity and scalability:

- `ui.js` – Handles DOM updates and user interactions  
- `storage.js` – Manages all database operations  
- `sync.js` – Handles sync queue and simulated server processing  
- `state.js` – Maintains shared application state  
- `main.js` – Entry point and application initialization  

## Key Concepts Implemented

- Offline-first application design  
- Asynchronous programming with IndexedDB  
- Event delegation for dynamic UI handling  
- Debounce logic (initial version) and controlled input flow  
- Queue-based sync simulation  
- Separation of concerns in frontend architecture  

## How to Run

1. Open the project folder in a code editor
2. Run the project using a local server (recommended)
3. Open in a modern browser (Chrome recommended)

> Note: IndexedDB does not work properly with `file://` protocol. Use a local server.

## Future Improvements

- Real backend integration for sync
- Conflict resolution system
- Tagging and search functionality
- Improved notification system (toast UI)
- Multi-note undo stack

## Author

Ashish

Developed as a learning-focused project to understand real-world frontend architecture, offline-first design, and asynchronous data handling.
