// db.ts

// What a 'friend' looks like
export interface Friend {
    id?: number;
    name: string;
    age: number;
}

let database: IDBDatabase | null = null; // Initialize to null

export const whenDatabaseReady = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const databaseRequest = indexedDB.open('MyDatabase', 1);

        databaseRequest.onupgradeneeded = (event: Event) => {
            database = (event.target as IDBOpenDBRequest).result;
            database.createObjectStore('friends', { keyPath: 'id', autoIncrement: true });
            console.log('Database upgraded!');
        };

        databaseRequest.onsuccess = (event: Event) => {
            database = (event.target as IDBOpenDBRequest).result;
            console.log('Database opened!');
            resolve(database);
        };

        databaseRequest.onerror = (event: Event) => {
            console.error('Database error:', event);
            reject(new Error('Database failed to open'));
        };
    });
};

// --- Functions to work with our friends ---

// Reusable transaction error handler
const handleTransactionError = (error: Event, errorMessage: string, callback: (errorMsg: string) => void) => {
    console.error(errorMessage, error);
    callback(errorMessage);
};

// Add a new friend
export const addFriend = (friend: Friend, callback: (errorMsg?: string) => void) => {
    if (!database) {
        callback('Database not ready');
        return;
    }

    const transaction = database.transaction('friends', 'readwrite');
    const friendStore = transaction.objectStore('friends');
    const addRequest = friendStore.add(friend);

    addRequest.onsuccess = () => {
        console.log(`Added ${friend.name}!`);
        callback();
    };

    addRequest.onerror = () => {
        console.error('Problem adding friend:', friend);
        callback('Problem adding friend');
    };

    transaction.onerror = (event) => handleTransactionError(event, 'Database problem adding friend', callback);
};

// Get a friend by their ID
export const getFriend = (id: number, callback: (friend: Friend | undefined, errorMsg?: string) => void) => {
    if (!database) {
        callback(undefined, 'Database not ready');
        return;
    }

    const transaction = database.transaction('friends', 'readonly');
    const friendStore = transaction.objectStore('friends');
    const getRequest = friendStore.get(id);

    getRequest.onsuccess = () => {
        callback(getRequest.result);
    };

    getRequest.onerror = () => {
        console.error('Problem getting friend:', id);
        callback(undefined, 'Problem getting friend');
    };

    transaction.onerror = (event) => handleTransactionError(event, 'Database problem getting friend', (errorMsg) => callback(undefined, errorMsg));
};

// Update a friend's info
export const updateFriend = (friend: Friend, callback: (errorMsg?: string) => void) => {
    if (!database) {
        callback('Database not ready');
        return;
    }

    const transaction = database.transaction('friends', 'readwrite');
    const friendStore = transaction.objectStore('friends');
    const updateRequest = friendStore.put(friend);

    updateRequest.onsuccess = () => {
        console.log(`Updated ${friend.name}!`);
        callback();
    };

    updateRequest.onerror = () => {
        console.error('Problem updating friend:', friend);
        callback('Problem updating friend');
    };

    transaction.onerror = (event) => handleTransactionError(event, 'Database problem updating friend', callback);
};

// Delete a friend
export const deleteFriend = (id: number, callback: (errorMsg?: string) => void) => {
    if (!database) {
        callback('Database not ready');
        return;
    }

    const transaction = database.transaction('friends', 'readwrite');
    const friendStore = transaction.objectStore('friends');
    const deleteRequest = friendStore.delete(id);

    deleteRequest.onsuccess = () => {
        console.log(`Deleted friend with ID ${id}!`);
        callback();
    };

    deleteRequest.onerror = () => {
        console.error('Problem deleting friend:', id);
        callback('Problem deleting friend');
    };

    transaction.onerror = (event) => handleTransactionError(event, 'Database problem deleting friend', callback);
};