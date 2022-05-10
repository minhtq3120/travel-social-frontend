import axiosInstance from 'src/config/config';
import _ from 'lodash';

export const getNewFeedPost = async (params?: any) => {
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
  return await axiosInstance
    .get(queryString)
    .catch(function (error) {
      if (error.response) {
        return error.response.status;
      }
    });
};

export const getHashtagPosts = async (params?: any) => {
  let queryString = `/post/hashtag-detail`;
  if (params?.keyword) {
    const queryPage = `?hashtag=%23${params.keyword.slice(1, params.keyword.length)}`;
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
  return axiosInstance
    .post(`/post/new-post`, payload)
    .catch((error) => {
      return error
    });
};

export const addInterest = async (
  payload
) => {
  return axiosInstance
    .post(`/interests/add`, payload)
    .catch((error) => {
      if (error.response) {
        console.error(error.response.message);
        return error.response.status;
      }
    });
};


export const getPostDetail = async (
  postId
) => {
  let queryString = `/post/post/${postId}`;
  return await axiosInstance
    .get(queryString)
    .catch(function (error) {
      if (error.response) {
        return error.response.status;
      }
    });
};
