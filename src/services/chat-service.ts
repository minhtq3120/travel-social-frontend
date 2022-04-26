import axiosInstance from 'src/config/config';
import _ from 'lodash';
export const getRecentsChat = async (params) => {
    let queryString = `/chat/recent-chats`;
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


export const getChatDetailById = async (params) => {
    let queryString = `/chat/inbox`;
    if (params?.groupChatId) {
        const queryPage = `/${params.groupChatId}`;
        queryString = queryString.concat(queryPage);
    }
    if (params?.perPage) {
        const queryPage = `?perPage=${params.perPage}`;
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




export const createChatGroup = async (
    payload
) => {
    console.log(payload)
    return axiosInstance
        .post(`/chat/create/chat-group`, payload)
        .catch((error) => {
            console.log(error)
            if (error.response) {
                console.error(error.response.message);
                return error.response.status;
            }
        });
};
