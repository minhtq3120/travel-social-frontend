import axiosInstance from 'src/config/config';
import _ from 'lodash';

export const getNewFeedPost = async (params?: any) => {
  console.log(params)
  let queryString = `/post/posts`;
  if (params?.postLimit) {
    const queryPage = `?postLimit=${params.postLimit}`;
    queryString = queryString.concat(queryPage);
  }
  if (params?.userId) {
    const queryPage = `&userId=${params.userId}`;
    queryString = queryString.concat(queryPage);
  }
  if (params?.page) {
    const queryPage = `&page=${params.page}`;
    queryString = queryString.concat(queryPage);
  }
  if (params?.limit) {
    const queryLimit = `&limit=${params.limit}`;
    queryString = queryString.concat(queryLimit);
  }
  if (params?.groupId) {
    const page = _.get(params, 'page', 0);
    const limit = _.get(params, 'limit', 0);
    const condition = page > 0 || limit > 0 ? '&' : '?';
    const queryName = `${condition}groupId=${params.groupId}`;
    queryString = queryString.concat(queryName);
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

export const createPost = async (
  payload
) => {
  console.log(payload)
  return axiosInstance
    .post(`/post/new-post`, payload)
    .catch((error) => {
      console.log(error)
      if (error.response) {
        console.error(error.response.message);
        return error.response.status;
      }
    });
};
