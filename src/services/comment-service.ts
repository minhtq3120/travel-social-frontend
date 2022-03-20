import axiosInstance from 'src/config/config';
import _ from 'lodash';


export const getCommentsOfPost = async (params) => {
    let queryString = `/comment/comments/of-post/`;
    if (params?.postId) {
        const queryPage = `${params.postId}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.page) {
        const postId = _.get(params, 'postId', null);
        const condition = postId ? '?' : '&'
        const queryPage = `&page=${params.page}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.perPage) {
        // const postId = _.get(params, 'postId', null);
        // const condition = postId ? '?' : '&'
        const queryPage = `&perPage=${params.perPage}`;
        queryString = queryString.concat(queryPage);
    }
    console.log(queryString)
    return await axiosInstance
        .get(queryString)
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};

export const getReplyOfComment = async (params) => {
    let queryString = `/comment/comment-replies/`;
    if (params?.commentId) {
        const queryPage = `${params.commentId}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.page) {
        const postId = _.get(params, 'postId', null);
        const condition = postId ? '?' : '&'
        const queryPage = `&page=${params.page}`;
        queryString = queryString.concat(queryPage);
    }
    console.log(queryString)
    return await axiosInstance
        .get(queryString)
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};

export const commentToPost = async (payload) => {
    return axiosInstance
        .post("/comment/add/comment-to-post", payload)
        .catch((error) => {
            console.error(error);
            if (error.response) {
                return error.response;
            }
        });
};


export const replyToComment = async (payload) => {
    return axiosInstance
        .post("/comment/add/reply-to-comment", payload)
        .catch((error) => {
            console.error(error);
            if (error.response) {
                return error.response;
            }
        });
};
