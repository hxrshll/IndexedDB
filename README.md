# IndexedDB React Demo

This repository demonstrates basic CRUD (Create, Read, Update, Delete) operations using IndexedDB with React and TypeScript. It's designed to be a simple, beginner-friendly example for those learning how to use IndexedDB in a modern web application.

## Features

* **Basic CRUD Operations:**
    * Add new friends to the database.
    * Retrieve a friend's information by ID.
    * Update an existing friend's information.
    * Delete a friend from the database.
* **React and TypeScript:** Built using React for the UI and TypeScript for type safety.
* **Asynchronous Handling:** Demonstrates how to handle the asynchronous nature of IndexedDB operations.
* **Error Handling:** Basic error handling to provide feedback to the user.
* **Database Readiness:** Correctly handles the database readiness before performing any crud operation.

## Getting Started

### Prerequisites

* Node.js and npm (Node Package Manager) installed on your machine.

### Installation

1.  Clone the repository:

    ```bash
    git clone [https://github.com/hxrshll/IndexedDB.git](https://github.com/hxrshll/IndexedDB.git)
    cd IndexedDB
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:

    ```bash
    npm start
    ```

4.  Open your browser and navigate to `http://localhost:3000`.

### Usage

The application provides a simple UI to interact with the IndexedDB database.

* **Add Friend:** Enter the friend's name and age, then click "Add Friend."
* **Get Friend:** Enter the friend's ID and click "Get Friend."
* **Update Friend:** Enter the friend's ID, name, and age, then click "Update Friend."
* **Delete Friend:** Enter the friend's ID and click "Delete Friend."
* **Friends List:** The list below the input fields displays the friends currently stored in the database.

### Code Structure

* **`src/db.ts`:** Contains the IndexedDB logic, including database initialization and CRUD operations.
* **`src/app.tsx`:** The main React component that handles user interactions and displays data.
* **`src/index.tsx`:** The entry point of the React application.
* **`public/index.html`:** The HTML template for the application.

### Understanding IndexedDB

IndexedDB is an asynchronous, transactional, object-oriented database that runs in the browser. It allows you to store significant amounts of structured data in the client-side.

### Key Concepts Demonstrated

* **Database Initialization:** How to open and create an IndexedDB database and object store.
* **Transactions:** How to use transactions for data manipulation.
* **Object Stores:** How to store and retrieve data from object stores.
* **Asynchronous Operations:** How to handle the asynchronous nature of IndexedDB.
* **Error Handling:** How to handle potential errors during database operations.

### Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

### License

This project is licensed under the MIT License.

### Author

Harshal

### Acknowledgments

* React
* TypeScript
* IndexedDB API