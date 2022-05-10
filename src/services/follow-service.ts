import axiosInstance from 'src/config/config';
import _ from 'lodash';
export const followId = async (id) => {
    return axiosInstance
        .post("/following/add/followings", {
            followingId: id,
        })
        .catch((error) => {
            console.error(error);
            if (error.response) {
                return error.response;
            }
        });
};

export const unfollowId = async (id) => {
    return axiosInstance
        .delete("/following/unfollow", {
            data: {
                followingId: id,
            },
        })
        .catch((error) => {
            console.error(error);
            if (error.response) {
                return error.response;
            }
        });
};
export const getFollowing = async (params) => {
    let queryString = `/following/get/followings`;
    if (params?.userId) {
        const queryPage = `?userId=${params.userId}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.page) {
        const userId = _.get(params, 'userId', null);
        const condition = userId ? '&' : '?'
        const queryPage = `${condition}page=${params.page}`;
        queryString = queryString.concat(queryPage);
    }
    return await axiosInstance
        .get(queryString)
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};
export const getFollowers = async (params) => {
    let queryString = `/following/get/followers`;
    if (params?.userId) {
        const queryPage = `?userId=${params.userId}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.page) {
        const userId = _.get(params, 'userId', null);
        const condition = userId ? '&' : '?'
        const queryPage = `${condition}page=${params.page}`;
        queryString = queryString.concat(queryPage);
    }
    return await axiosInstance
        .get(queryString)
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};
