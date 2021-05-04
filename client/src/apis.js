import axios from 'axios';

const serverAddress = 'http://localhost:5000';

export const getUsersFromServer = async () => {
    try {
        const res = await axios.get(`${serverAddress}/api/user`);
        return res.data;
    }
    catch (err) {
        console.error(err);
    }
}

export const adddUserInServer = async (user) => {
    try {
        const res = await axios.post(`${serverAddress}/api/user`, user);
        return res.data;
    }
    catch (err) {
        console.error(err);
    }
}

export const updateUserInServer = async (user, userId) => {
    try {
        const res = await axios.put(`${serverAddress}/api/user/${userId}`, user);
        return res.data;
    }
    catch (err) {
        console.error(err);
    }
};

export const deleteUserInServer = async (userId) => {
    try {
        const res = await axios.delete(`${serverAddress}/api/user/${userId}`);
        return res.data;
    }
    catch (err) {
        console.error(err);
    }
};
