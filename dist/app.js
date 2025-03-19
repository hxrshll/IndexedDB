// db.ts
// Open or create the database
const request = indexedDB.open('MyDatabase', 1);
let db; // Declare db outside the event handlers
// Handle database setup (runs when DB is created or version changes)
request.onupgradeneeded = (event) => {
    db = event.target.result;
    // Create an object store (like a table) for 'friends'
    const objectStore = db.createObjectStore('friends', {
        keyPath: 'id',
        autoIncrement: true,
    });
    // Create indexes for quick searches
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('age', 'age', { unique: false });
    console.log('Database setup complete!');
};
// Handle successful database opening
request.onsuccess = (event) => {
    db = event.target.result;
    console.log('Database opened successfully!');
};
// Handle errors
request.onerror = (event) => {
    console.error('Database error:', event);
};
// 1. Adding Data
export const addFriend = (friend, callback) => {
    if (!db) {
        callback(new Error('Database not initialized'));
        return;
    }
    const transaction = db.transaction('friends', 'readwrite');
    const objectStore = transaction.objectStore('friends');
    const req = objectStore.add(friend);
    req.onsuccess = () => {
        console.log(`Added ${friend.name} to the database!`);
        callback();
    };
    req.onerror = () => {
        console.error('Error adding friend:', friend);
        callback(new Error('Error adding friend'));
    };
    transaction.oncomplete = () => console.log('Transaction completed!');
    transaction.onerror = () => callback(new Error('Transaction error adding friend'));
};
// 2. Retrieving Data
export const getFriend = (id, callback) => {
    if (!db) {
        callback(undefined, new Error('Database not initialized'));
        return;
    }
    const transaction = db.transaction('friends', 'readonly');
    const objectStore = transaction.objectStore('friends');
    const req = objectStore.get(id);
    req.onsuccess = () => {
        const friend = req.result;
        if (friend) {
            console.log(`Found friend:`, friend);
            callback(friend);
        }
        else {
            console.log(`No friend found with ID ${id}`);
            callback(undefined);
        }
    };
    req.onerror = () => {
        console.error('Error retrieving friend with ID:', id);
        callback(undefined, new Error('Error retrieving friend'));
    };
    transaction.onerror = () => callback(undefined, new Error('Transaction error retrieving friend'));
};
// 3. Updating Data
export const updateFriend = (friend, callback) => {
    if (!db) {
        callback(new Error('Database not initialized'));
        return;
    }
    const transaction = db.transaction('friends', 'readwrite');
    const objectStore = transaction.objectStore('friends');
    const req = objectStore.put(friend);
    req.onsuccess = () => {
        console.log(`Updated friend with ID ${friend.id}`);
        callback();
    };
    req.onerror = () => {
        console.error('Error updating friend:', friend);
        callback(new Error('Error updating friend'));
    };
    transaction.onerror = () => callback(new Error('Transaction error updating friend'));
};
// 4. Deleting Data
export const deleteFriend = (id, callback) => {
    if (!db) {
        callback(new Error('Database not initialized'));
        return;
    }
    const transaction = db.transaction('friends', 'readwrite');
    const objectStore = transaction.objectStore('friends');
    const req = objectStore.delete(id);
    req.onsuccess = () => {
        console.log(`Deleted friend with ID ${id}`);
        callback();
    };
    req.onerror = () => {
        console.error('Error deleting friend with ID:', id);
        callback(new Error('Error deleting friend'));
    };
    transaction.onerror = () => callback(new Error('Transaction error deleting friend'));
};
// 5. Searching with Indexes (e.g., find friends over 20)
export const findFriendsOverAge = (minAge, callback) => {
    if (!db) {
        callback([], new Error('Database not initialized'));
        return;
    }
    const transaction = db.transaction('friends', 'readonly');
    const objectStore = transaction.objectStore('friends');
    const index = objectStore.index('age');
    const req = index.openCursor(IDBKeyRange.lowerBound(minAge));
    const foundFriends = [];
    req.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            foundFriends.push(cursor.value);
            cursor.continue();
        }
        else {
            callback(foundFriends);
        }
    };
    req.onerror = () => {
        console.error('Error searching friends by age');
        callback([], new Error('Error searching friends by age'));
    };
    transaction.onerror = () => callback([], new Error('Transaction error searching friends'));
};
