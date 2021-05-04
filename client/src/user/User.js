import { useState } from 'react';
import { UserInfoView } from '../userInfo/UserInfoView';
import './User.css'
import '../userInfo/UserInfoView.css'
import { deleteUserInServer, updateUserInServer } from '../apis';

const User = ({ user, updateUsers }) => {

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

  const updateHandler = async () => {
    setstate({ ...state, mode: 'show' })
    const { user } = state;
    const { userId } = user;
    const users = await updateUserInServer(user, userId);
    updateUsers(users);
  }

  const deleteHandler = async () => {
    const { user: { userId } } = state;
    const users = await deleteUserInServer(userId);
    updateUsers(users);
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

  return <UserInfoView
    userInfo={state.user}
    showUserInfoAs={getView}
    showButtonAs={getButtonView} />;
};
export default User;
