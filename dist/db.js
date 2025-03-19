// db.ts
// Open our database (or create it if it doesn't exist)
const databaseRequest = indexedDB.open('MyDatabase', 1);
let database; // This will hold our opened database
// When the database is first created or its version changes...
databaseRequest.onupgradeneeded = (event) => {
    database = event.target.result;
    // Make a place to store our friends (like a table)
    const friendStore = database.createObjectStore('friends', {
        keyPath: 'id',
        autoIncrement: true,
    });
    // Make it faster to search friends by name or age
    friendStore.createIndex('name', 'name', { unique: false });
    friendStore.createIndex('age', 'age', { unique: false });
    console.log('Database ready!');
};
// When the database opens successfully...
databaseRequest.onsuccess = (event) => {
    database = event.target.result;
    console.log('Database opened!');
};
// If there's a problem opening the database...
databaseRequest.onerror = (event) => {
    console.error('Database problem:', event);
};
// --- Functions to work with our friends ---
// Add a new friend
export const addFriend = (friend, callback) => {
    if (!database) {
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
export const getFriend = (id, callback) => {
    if (!database) {
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
export const updateFriend = (friend, callback) => {
    if (!database) {
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
export const deleteFriend = (id, callback) => {
    if (!database) {
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
export const findFriendsOverAge = (minAge, callback) => {
    if (!database) {
        callback([], new Error('Database not ready'));
        return;
    }
    const transaction = database.transaction('friends', 'readonly');
    const friendStore = transaction.objectStore('friends');
    const ageIndex = friendStore.index('age');
    const cursorRequest = ageIndex.openCursor(IDBKeyRange.lowerBound(minAge));
    const foundFriends = [];
    cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            foundFriends.push(cursor.value);
            cursor.continue();
        }
        else {
            callback(foundFriends);
        }
    };
    cursorRequest.onerror = () => {
        console.error('Problem searching friends by age');
        callback([], new Error('Problem searching friends by age'));
    };
    transaction.onerror = () => callback([], new Error('Database problem searching friends'));
};
