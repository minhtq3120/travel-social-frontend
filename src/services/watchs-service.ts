import axiosInstance from 'src/config/config';
import _ from 'lodash';


export const getWatchs = async (params) => {
    let queryString = `/media-files/videos/watch`;

    const queryPage = `?page=${params.page}`;
    queryString = queryString.concat(queryPage);

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
