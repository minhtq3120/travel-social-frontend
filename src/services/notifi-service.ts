import axiosInstance from 'src/config/config';
import _ from 'lodash';

export const getNotifi = async (params) => {
    let queryString = `/notifications`;
    if (params?.page) {
        // const postId = _.get(params, 'postId', null);
        // const condition = postId ? '?' : '&'
        const queryPage = `?page=${params.page}`;
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