import axiosInstance from 'src/config/config';
import _ from 'lodash';

export const getNewFeedPost = async (params?: any) => {
  let queryString = `/post/posts`;
  if (params?.page) {
    const queryPage = `?page=${params.page}`;
    queryString = queryString.concat(queryPage);
  }
  if (params?.limit) {
    const condition = _.get(params, 'page', 0) > 0 ? '&' : '?';
    const queryLimit = `${condition}postLimit=${params.limit}`;
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

