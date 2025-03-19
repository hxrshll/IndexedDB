import React, { useEffect, useState } from 'react';
import { addFriend, getFriend, updateFriend, deleteFriend, findFriendsOverAge, Friend } from './db';

const App: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<number>(0);
    const [idToGet, setIdToGet] = useState<number>(0);
    const [idToDelete, setIdToDelete] = useState<number>(0);
    const [minAge, setMinAge] = useState<number>(20);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [databaseReady, setDatabaseReady] = useState<boolean>(false);

    useEffect(() => {
        // Check for database readiness using the existing request
        const request = indexedDB.open('MyDatabase', 1);

        request.onsuccess = () => {
            setDatabaseReady(true);
        };

        request.onerror = () => {
            console.error('Database failed to open.');
        };
    }, []);

    useEffect(() => {
        if (databaseReady) {
            setLoading(true);
            findFriendsOverAge(minAge, (foundFriends: Friend[], err?: Error) => {
                setLoading(false);
                if (err) {
                    setError(err.message);
                } else {
                    setFriends(foundFriends);
                }
            });
        }
    }, [minAge, databaseReady]);

    const handleAddFriend = () => {
        if (databaseReady && name && age) {
            setLoading(true);
            addFriend({ name, age }, (err?: Error) => {
                setLoading(false);
                if (err) {
                    setError(err.message);
                } else {
                    findFriendsOverAge(minAge, setFriends);
                    setName('');
                    setAge(0);
                }
            });
        } else if (!databaseReady) {
            setError("Database not ready");
        }
    };

    const handleGetFriend = () => {
        if (databaseReady) {
            setLoading(true);
            getFriend(idToGet, (friend, err?: Error) => {
                setLoading(false);
                if (err) {
                    setError(err.message);
                } else if (friend) {
                    setFriends([friend]);
                } else {
                    setFriends([]);
                }
            });
        } else {
            setError("Database not ready");
        }
    };

    const handleUpdateFriend = () => {
        if (databaseReady && idToGet && name && age) {
            setLoading(true);
            updateFriend({ id: idToGet, name, age }, (err?: Error) => {
                setLoading(false);
                if (err) {
                    setError(err.message);
                } else {
                    findFriendsOverAge(minAge, setFriends);
                }
            });
        } else if (!databaseReady) {
            setError("Database not ready");
        }
    };

    const handleDeleteFriend = () => {
        if (databaseReady) {
            setLoading(true);
            deleteFriend(idToDelete, (err?: Error) => {
                setLoading(false);
                if (err) {
                    setError(err.message);
                } else {
                    findFriendsOverAge(minAge, setFriends);
                    setIdToDelete(0);
                }
            });
        } else {
            setError("Database not ready");
        }
    };

    const handleSearchByAge = () => {
        if (databaseReady) {
            setLoading(true);
            findFriendsOverAge(minAge, (foundFriends: Friend[], err?: Error) => {
                setLoading(false);
                if (err) {
                    setError(err.message);
                } else {
                    setFriends(foundFriends);
                }
            });
        } else {
            setError("Database not ready");
        }
    };

    if (!databaseReady) {
        return <div style={{ padding: '20px' }}>Database not ready</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>IndexedDB React Demo</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {loading && <div>Loading...</div>}

            {/* ... (Rest of your JSX remains the same) ... */}

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