import axiosInstance from 'src/config/config';
import _ from 'lodash';

export const getCurrUserProfile = async () => {
    try {
        return axiosInstance.get(`/user/profile`).then((res) => res.data);
    } catch (error) {
        throw error;
    }
};
export const getUserProfileById = async (userId?: string) => {
    let url = "/user/profile";
    if (userId) {
        let query = `?userId=${userId}`
        url += query
    }
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((error) => {
            if (error.response) {
                console.error(error.response.message);
                return error.response;
            }
        });
};

export const changePassword = async ({ currentPassword, newPassword }) => {
    return axiosInstance
        .put(`/user/change-password`, {
            currentPassword,
            newPassword,
        })
        .catch((error) => {
            return error
        });
};

export const updateInfo = async (
    payload: any
) => {
    const {
        bio,
        displayName,
        sex,
        birthday
    } = payload
    return axiosInstance
        .put(`/user/update-info`, {
            bio,
            displayName,
            sex,
            birthday
        })
        .catch((error) => {
            return error
        });
};

export const uploadProfileImage = async (
    payload: any
) => {
    return axiosInstance
        .post(`/user/upload/profile-image`, payload)
        .catch((error) => {
            return error
        });
};

export const searchUser = async (keyWord) => {
    return axiosInstance
        .get(`/user/search/users?search=${keyWord}&page=0`)
        .catch((error) => {
            if (error.response) {
                console.error(error.response.message);
                return error.response.status;
            }
        });
};
