import { AiOutlineUserAdd } from 'react-icons/ai';
import './AddUser.css';
import '../userInfo/UserInfoView.css';
import { useState } from 'react';
import { UserInfoView } from '../userInfo/UserInfoView';
import { adddUserInServer } from '../apis';

const AddUser = ({ updateUsers }) => {

    const [state, setstate] = useState({
        view: 'add-icon',
        user: {
            firstName: '',
            lastName: '',
            emailAddress: '',
            mobileNo: ''
        }
    });

    const userIconView = () => (
        <div className="container">
            <div className="add-user-icon" onClick={addUserIconHandler}>
                <AiOutlineUserAdd size={250} color="white" />
            </div>
        </div>
    )

    const addUserButtonView = () => (
        <button className="add-user" onClick={addUserHandler}>add user</button>
    )

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

    const getInputView = (data, name) =>
        <input className="info" type="text" value={data} name={name} onChange={onChange} />;

    const userInputView = () => (
        <UserInfoView
            userInfo={state.user}
            showUserInfoAs={getInputView}
            showButtonAs={addUserButtonView} />
    )

    const getView = () => {
        const { view } = state;
        if (view === 'add-icon') return userIconView();
        if (view === 'user-input') return userInputView();
    }

    const addUserIconHandler = (e) => {
        e.preventDefault();
        setstate({ ...state, view: 'user-input' });
    }

    const addUserHandler = async (e) => {
        e.preventDefault();
        setstate({ ...state, view: 'add-icon' });
        const { user } = state;
        const users = await adddUserInServer(user);
        updateUsers(users);
    }

    return getView();
}

export default AddUser;
