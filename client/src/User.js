import axios from 'axios';
import { useState } from 'react';
import './User.css'

const updateUser = async (user, userId)=> {
  try{
    const res= await axios.put(`http://localhost:5000/api/user/${userId}`,user);
    return res.data;
  }
  catch(err)
  {
    console.error(err);
  }
};


const deleteUser = async (userId)=> {
  try{
    const res= await axios.delete(`http://localhost:5000/api/user/${userId}`);
    return res.data;
  }
  catch(err)
  {
    console.error(err);
  }
};


const User = ({ user, removeUser }) => {

  const [state, setstate] = useState({
    mode: 'show',
    user: user
  })

  const getText = (data) => <span className="info">{data}</span>;
  const getInput = (data, name) =>
    <input className="info" type="text" value={data} name={name} onChange={onChange} />;

  const getView = (data, name) => {
    const { mode } = state;
    if (mode === 'edit') return getInput(data, name)
    if (mode === 'show') return getText(data)
  }

  const showButtonView = () => (
    <>
      <button className="edit" onClick={editHandler} >edit</button>
      <button className="delete" onClick={deleteHandler}>delete</button>
    </>
  );

  const editButtonView = () => (
    <button className="update" onClick={updateHandler}>update</button>
  )

  const getButtonView = () => {
    const { mode } = state;
    if (mode === 'edit') return editButtonView();
    if (mode === 'show') return showButtonView();
  }

  const editHandler = () => {
    setstate({ ...state, mode: 'edit' });
  }

  const updateHandler = () => {
    setstate({ ...state, mode: 'show' })
    const {user} =state;
    const {userId} = user;
    updateUser(user,userId);
  }

  const deleteHandler = async () => {
    const { user: { userId } } = state;
    removeUser(userId);
    deleteUser(userId)
  }

  const onChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const { user: prevUser } = state;
    setstate({
      ...state,
      user: {
        ...prevUser,
        [name]: value
      }
    }
    );
  }



  const { user: { firstName, lastName, emailAddress, mobileNo } } = state;

  return (
    <div className="container">
      <span className="user-info"> User Info</span>
      <span className="details">
        <span className="info-name">First name: </span>
        {getView(firstName, 'firstName')}
      </span>
      <span className="details">
        <span className="info-name">Last name: </span>
        {getView(lastName, 'lastName')}
      </span>
      <span className="details">
        <span className="info-name">Email Address: </span>
        {getView(emailAddress, 'emailAddress')}
      </span>
      <span className="details">
        <span className="info-name">Mobile No: </span>
        {getView(mobileNo, 'mobileNo')}
      </span>
      {getButtonView()}
    </div>
  )
};
export default User;