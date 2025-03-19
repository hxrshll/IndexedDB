import React, { useEffect, useState } from 'react';
import { addFriend, getFriend, updateFriend, deleteFriend, whenDatabaseReady, Friend } from './db';

const App: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<number>(0);
    const [id, setId] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [databaseReady, setDatabaseReady] = useState<boolean>(false);

    useEffect(() => {
        whenDatabaseReady().then(() => {
            setDatabaseReady(true);
            fetchAllFriends();
        }).catch((error) => {
            setError(error.message);
        });
    }, []);

    const fetchAllFriends = () => {
        if (!databaseReady) return; // Prevent fetching if database is not ready

        const transaction = indexedDB.open('MyDatabase', 1).result.transaction('friends', 'readonly');
        const friendStore = transaction.objectStore('friends');
        const getAllRequest = friendStore.getAll();

        getAllRequest.onsuccess = () => {
            setFriends(getAllRequest.result);
        };

        getAllRequest.onerror = () => {
            setError('Failed to fetch friends');
        };
    };

    const handleAddFriend = () => {
        if (!databaseReady) return;

        addFriend({ name, age }, (errorMsg) => {
            if (errorMsg) {
                setError(errorMsg);
            } else {
                fetchAllFriends();
                setName('');
                setAge(0);
            }
        });
    };

    const handleGetFriend = () => {
        if (!databaseReady) return;

        getFriend(id, (friend, errorMsg) => {
            if (errorMsg) {
                setError(errorMsg);
            } else if (friend) {
                setFriends([friend]);
            } else {
                setFriends([]);
            }
        });
    };

    const handleUpdateFriend = () => {
        if (!databaseReady) return;

        updateFriend({ id, name, age }, (errorMsg) => {
            if (errorMsg) {
                setError(errorMsg);
            } else {
                fetchAllFriends();
            }
        });
    };

    const handleDeleteFriend = () => {
        if (!databaseReady) return;

        deleteFriend(id, (errorMsg) => {
            if (errorMsg) {
                setError(errorMsg);
            } else {
                fetchAllFriends();
            }
        });
    };

    if (!databaseReady) {
        return <div>Database not ready</div>;
    }

    return (
        <div>
            <h1>IndexedDB React Demo</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Age:</label>
                <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                <button onClick={handleAddFriend}>Add Friend</button>
            </div>

            <div>
                <label>ID:</label>
                <input type="number" value={id} onChange={(e) => setId(Number(e.target.value))} />
                <button onClick={handleGetFriend}>Get Friend</button>
                <button onClick={handleUpdateFriend}>Update Friend</button>
                <button onClick={handleDeleteFriend}>Delete Friend</button>
            </div>

            <div>
                <h2>Friends List</h2>
                {friends.length > 0 ? (
                    <ul>
                        {friends.map((friend) => (
                            <li key={friend.id}>
                                ID: {friend.id}, Name: {friend.name}, Age: {friend.age}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No friends found.</p>
                )}
            </div>
        </div>
    );
};

export default App;