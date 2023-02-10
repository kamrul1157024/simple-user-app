import axios from 'axios';

const serverAddress = 'http://local.envelopproject.com/api';

export const getUsersFromServer = async () => {
    try {
        const res = await axios.get(`${serverAddress}/user`);
        return res.data;
    }
    catch (err) {
        console.error(err);
    }
}

export const adddUserInServer = async (user) => {
    try {
        const res = await axios.post(`${serverAddress}/user`, user);
        return res.data;
    }
    catch (err) {
        console.error(err);
    }
}

export const updateUserInServer = async (user, userId) => {
    try {
        const res = await axios.put(`${serverAddress}/user/${userId}`, user);
        return res.data;
    }
    catch (err) {
        console.error(err);
    }
};

export const deleteUserInServer = async (userId) => {
    try {
        const res = await axios.delete(`${serverAddress}/user/${userId}`);
        return res.data;
    }
    catch (err) {
        console.error(err);
    }
};
