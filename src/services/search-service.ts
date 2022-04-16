import axiosInstance from 'src/config/config';
import _ from 'lodash';
export const searchAllUser = async (params) => {
    let queryString = `/searchs/users`;
    if (params?.keyword) {
        const queryPage = `?search=${params.keyword}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.filter) {
        const queryPage = `&filter=${params.filter}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.perPage) {
        const queryPage = `&perPage=${params.perPage}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.page) {
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

