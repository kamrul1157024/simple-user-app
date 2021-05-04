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
      updateUsers(users);
    };
    fethcApi();
  }, []);

  const updateUsers = (users) => {
    if (!users) users = [];
    setstate({ ...state, users: users });
  }

  const { users } = state;
  return (
    <>
      <div className="top-bar">
        Simple-User-APP
      </div>

      <div className="users-container">
        <AddUser updateUsers={updateUsers} />
        {users.map(user =>
          <User
            key={user.userId}
            user={user}
            updateUsers={updateUsers}
          />)}
      </div>
    </>
  )
}

export default App;
