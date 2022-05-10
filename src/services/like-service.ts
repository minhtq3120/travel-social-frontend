import axiosInstance from 'src/config/config';
import _ from 'lodash';
export const likePost = async (postId) => {
    return axiosInstance
        .post(`/like/add/to-post/`, { postId })
        .catch((error) => {
            console.error(error);
            if (error.response) {
                return error.response;
            }
        });
};

export const unLikePost = async (postId: any) => {
    return axiosInstance
        .delete(`/like/remove-like`, { data: { postId } })
        .catch((error) => {
            console.error(error);
            if (error.response) {
                return error.response;
            }
        });
};


export const getLikeOfPots = async (params) => {
    let queryString = `/like/`;
    if (params?.postId) {
        const queryPage = `${params.postId}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.page) {
        // const postId = _.get(params, 'postId', null);
        // const condition = postId ? '?' : '&'
        const queryPage = `?page=${params.page}`;
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