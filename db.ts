// db.ts

// What a 'friend' looks like
export interface Friend {
    id?: number;
    name: string;
    age: number;
}

let database: IDBDatabase | null = null; // Initialize to null
let databaseReady = false; // Track database readiness

const databaseRequest = indexedDB.open('MyDatabase', 1);

databaseRequest.onupgradeneeded = (event: Event) => {
    database = (event.target as IDBOpenDBRequest).result;
    database.createObjectStore('friends', { keyPath: 'id', autoIncrement: true });
    console.log('Database upgraded!');
};

databaseRequest.onsuccess = (event: Event) => {
    database = (event.target as IDBOpenDBRequest).result;
    databaseReady = true; // Set readiness to true
    console.log('Database opened!');
};

databaseRequest.onerror = (event: Event) => {
    console.error('Database error:', event);
};

// --- Functions to work with our friends ---

// Add a new friend
export const addFriend = (friend: Friend, callback: (error?: Error) => void) => {
    if (!databaseReady || !database) { // Check readiness
        callback(new Error('Database not ready'));
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
        callback(new Error('Problem adding friend'));
    };

    transaction.onerror = () => callback(new Error('Database problem adding friend'));
};

// Get a friend by their ID
export const getFriend = (id: number, callback: (friend: Friend | undefined, error?: Error) => void) => {
    if (!databaseReady || !database) { // Check readiness
        callback(undefined, new Error('Database not ready'));
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
        callback(undefined, new Error('Problem getting friend'));
    };

    transaction.onerror = () => callback(undefined, new Error('Database problem getting friend'));
};

// Update a friend's info
export const updateFriend = (friend: Friend, callback: (error?: Error) => void) => {
    if (!databaseReady || !database) { // Check readiness
        callback(new Error('Database not ready'));
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
        callback(new Error('Problem updating friend'));
    };

    transaction.onerror = () => callback(new Error('Database problem updating friend'));
};

// Delete a friend
export const deleteFriend = (id: number, callback: (error?: Error) => void) => {
    if (!databaseReady || !database) { // Check readiness
        callback(new Error('Database not ready'));
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
        callback(new Error('Problem deleting friend'));
    };

    transaction.onerror = () => callback(new Error('Database problem deleting friend'));
};

// Find friends older than a certain age
export const findFriendsOverAge = (minAge: number, callback: (friends: Friend[], error?: Error) => void) => {
    if (!databaseReady || !database) { // Check readiness
        callback([], new Error('Database not ready'));
        return;
    }

    const transaction = database.transaction('friends', 'readonly');
    const friendStore = transaction.objectStore('friends');
    const ageIndex = friendStore.index('age');
    const cursorRequest = ageIndex.openCursor(IDBKeyRange.lowerBound(minAge));

    const foundFriends: Friend[] = [];

    cursorRequest.onsuccess = (event: Event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
        if (cursor) {
            foundFriends.push(cursor.value);
            cursor.continue();
        } else {
            callback(foundFriends);
        }
    };

    cursorRequest.onerror = () => {
        console.error('Problem searching friends by age');
        callback([], new Error('Problem searching friends by age'));
    };

    transaction.onerror = () => callback([], new Error('Database problem searching friends'));
};