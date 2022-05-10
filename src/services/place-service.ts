import axiosInstance from 'src/config/config';
import _ from 'lodash';

export const getDiscovery = async (params) => {
    let queryString = `/places/discovery-places`;
    if (params?.page) {
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



export const getDiscoveryDetail = async (params) => {
    let queryString = `/places/discovery-detail`;
    if (params?.placeId) {
        const queryPage = `/${params.placeId}`;
        queryString = queryString.concat(queryPage);
    }
    const queryPage = `?page=${params.page}`;
    queryString = queryString.concat(queryPage);
    if (params?.perPage) {
        const queryPage = `&perPage=${params?.perPage}`;
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

export const getPlacesDetail = async (placeId: string) => {
    let queryString = `/places/place-detail`;
    if (placeId) {
        const queryPage = `/${placeId}`;
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

export const getRecentsVisited = async (params) => {
    let queryString = `/places/visited-places`;
    if (params?.time) {
        const queryPage = `?time=${params.time}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.page) {
        const queryPage = `&page=${params.page}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.perPage) {
        const queryPage = `&perPage=${params.perPage}`;
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

export const getPlaces = async (params) => {
    let queryString = `/places/search`;
    if (params?.input) {
        const queryInput = `?input=${params.input}`;
        queryString = queryString.concat(queryInput);
    }

    return await axiosInstance
        .get(queryString)
        .catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
};

export const getSuggestionVehicle = async (payload) => {
    let queryString = `places/suggest/vehicle`;


    return await axiosInstance
        .post(queryString, payload)
        .catch(function (error) {
            return error
        });
}