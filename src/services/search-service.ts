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

    return await axiosInstance
        .get(queryString)
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};



export const searchEverything = async (params) => {
    let queryString = `/searchs/all`;
    if (params?.keyword) {
        const queryPage = params?.keyword[0] === '#' && params.keyword.length > 1 ? `?search=%23${params.keyword.slice(1, params.keyword.length)}` : `?search=${params.keyword}`;
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

    return await axiosInstance
        .get(queryString)
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};



export const searchEverythingAll = async (params) => {
    let queryString = `/searchs/all/detail`;
    if (params?.filter) {
        const queryPage = `?filter=${params.filter}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.keyword) {
        const queryPage = params?.keyword[0] === '#' && params.keyword.length > 1 ? `&search=%23${params.keyword.slice(1, params.keyword.length)}` : `&search=${params.keyword}`;
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

    return await axiosInstance
        .get(queryString)
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};

