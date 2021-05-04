import { useEffect, useState } from 'react';
import User from './user/User';
import './App.css';
import AddUser from './addUser/AddUser';
import { getUsersFromServer } from './apis';

function App() {

  const [state, setstate] = useState({ users: [] })

  useEffect(() => {
    const fethcApi = async () => {
      const users = await getUsersFromServer();
      setstate({ ...state, users: users });
    };
    fethcApi();
  }, []);

  const addUser = (user) => {
    const { users } = state;
    const newUsers = [...users, user];
    setstate({ ...state, users: newUsers });
  }

  const removeUser = (userId) => {
    const { users } = state;
    const newUsers = users.filter(user => user.userId !== userId);
    setstate({ ...state, users: newUsers });
  }

  const { users } = state;
  return (
    <>
      <div className="top-bar">
        Simple-User-APP
      </div>
      <div className="users-container">
        <AddUser addUser={addUser} />
        {users.map(user =>
          <User
            key={user.userId}
            user={user}
            removeUser={removeUser}
          />)}
      </div>
    </>
  )
}

export default App;
