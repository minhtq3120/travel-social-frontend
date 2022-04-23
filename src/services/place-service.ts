import axiosInstance from 'src/config/config';
import _ from 'lodash';

export const getDiscovery = async (params) => {
    let queryString = `/places/discovery-places`;
    if (params?.page) {
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



export const getDiscoveryDetail = async (params) => {
    let queryString = `/places/discovery-detail`;
    if (params?.placeId) {
        const queryPage = `/${params.placeId}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.page) {
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

export const getRecentsVisited = async (params) => {
    let queryString = `/places/visited-places`;
    if (params?.time) {
        const queryPage = `?time=${params.time}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.page) {
        const time = _.get(params, 'time', null);
        const condition = time ? '&' : '?'
        const queryPage = `${condition}page=${params.page}`;
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

export const getPlaces = async (params) => {
    let queryString = `/places/search`;
    if (params?.input) {
        const queryInput = `?input=${params.input}`;
        queryString = queryString.concat(queryInput);
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