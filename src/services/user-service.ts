import axiosInstance from 'src/config/config';
import _ from 'lodash';

export const getCurrUserProfile = async () => {
    try {
        return axiosInstance.get(`/user/profile`).then((res) => res.data);
    } catch (error) {
        throw error;
    }
};
export const getUserProfileById = async (id) => {
    let url = "/user/profile";

    if (!!id) url += `?userId=${id}`;

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

export const changePassword = async (currentPassword, newPassword) => {
    return axiosInstance
        .put(`/user/change-password`, {
            currentPassword,
            newPassword,
        })
        .catch((error) => {
            if (error.response) {
                console.error(error.response.message);
                return error.response.status;
            }
        });
};

export const updateInfo = async (
    sex,
    birthday,
    provinceId,
    districtId,
    wardId
) => {
    return axiosInstance
        .put(`/user/update-info`, {
            sex: +sex,
            birthday,
            address: {
                province: +provinceId > 0 ? +provinceId : -1,
                district: +districtId > 0 ? +districtId : -1,
                ward: +wardId > 0 ? +wardId : -1,
            },
        })
        .catch((error) => {
            if (error.response) {
                console.error(error.response.message);
                return error.response.status;
            }
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
