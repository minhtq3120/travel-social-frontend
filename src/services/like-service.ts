import axiosInstance from 'src/config/config';
import _ from 'lodash';
export const likePost = async (postId) => {
    return axiosInstance
        .post(`/like/add/to-post?postId=${postId}`)
        .catch((error) => {
            console.error(error);
            if (error.response) {
                return error.response;
            }
        });
};

export const unLikePost = async (postId) => {
    return axiosInstance
        .delete(`/like/remove-like?postId=${postId}`)
        .catch((error) => {
            console.error(error);
            if (error.response) {
                return error.response;
            }
        });
};


// export const getLikeOfPots = async (params) => {
//     let queryString = `/following/get/followings`;
//     if (params?.userId) {
//         const queryPage = `?userId=${params.userId}`;
//         queryString = queryString.concat(queryPage);
//     }
//     if (params?.page) {
//         const userId = _.get(params, 'userId', null);
//         const condition = userId ? '&' : '?'
//         const queryPage = `${condition}page=${params.page}`;
//         queryString = queryString.concat(queryPage);
//     }
//     console.log(queryString)
//     return await axiosInstance
//         .get(queryString)
//         .catch(function (error) {
//             if (error.response) {
//                 return error.response.status;
//             }
//         });
// };