import { useEffect, useState } from 'react';
import User from './User';
import axios from 'axios';
import './App.css';

function App() {

  const [state, setstate] = useState({ users: [] })

  useEffect(() => {
    const fethcApi = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user');
        setstate({ ...state, users: res.data });
      }
      catch (err) {
        console.error(err);
      }
    };
    fethcApi();
  }, []);

  const removeUser = (userId) => {
    const { users } = state;
    const newUsers = users.filter(user => user.userId !== userId);
    setstate({ ...state, users: newUsers });
  }

  const { users } = state;
  return (
    <div className="users-container">
      {users.map(user =>
        <User
          key={user.userId}
          user={user}
          removeUser={removeUser}
        />)}
    </div>
  )
}

export default App;
