import { PartitionOutlined } from '@ant-design/icons';
import _ from 'lodash';
import axiosInstance from 'src/config/config';

export const getAllPools = async (params?: any) => {
  let queryString = `/pools`;
  if (params?.page) {
    const queryPage = `?page=${params.page}`;
    queryString = queryString.concat(queryPage);
  }
  if (params?.limit) {
    const condition = _.get(params, 'page', 0) > 0 ? '&' : '?';
    const queryLimit = `${condition}limit=${params.limit}`;
    queryString = queryString.concat(queryLimit);
  }
  if (params?.keyword) {
    const page = _.get(params, 'page', 0);
    const limit = _.get(params, 'limit', 0);
    const condition = page > 0 || limit > 0 ? '&' : '?';
    const queryName = `${condition}keyword=${params.keyword}`;
    queryString = queryString.concat(queryName);
  }
  if (params?.sortField) {
    const page = _.get(params, 'page', 0);
    const limit = _.get(params, 'limit', 0);
    const condition = page > 0 || limit > 0 ? '&' : '?';
    const queryName = `${condition}sortField=${params.sortField}`;
    queryString = queryString.concat(queryName);
  }
  if (params?.sortDirection) {
    const page = _.get(params, 'page', 0);
    const limit = _.get(params, 'limit', 0);
    const condition = page > 0 || limit > 0 ? '&' : '?';
    const queryName = `${condition}sortDirection=${params.sortDirection}`;
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

export const getPoolStake = async (poolId: string, params?: any) => {
  let queryString = `/pools/staked/${poolId}`;
  if (params?.page) {
    const queryPage = `?page=${params.page}`;
    queryString = queryString.concat(queryPage);
  }
  if (params?.limit) {
    const condition = _.get(params, 'page', 0) > 0 ? '&' : '?';
    const queryLimit = `${condition}limit=${params.limit}`;
    queryString = queryString.concat(queryLimit);
  }
  if (params?.keyword) {
    const page = _.get(params, 'page', 0);
    const limit = _.get(params, 'limit', 0);
    const condition = page > 0 || limit > 0 ? '&' : '?';
    const queryName = `${condition}keyword=${params.keyword}`;
    queryString = queryString.concat(queryName);
  }
  if (params?.sortField) {
    const page = _.get(params, 'page', 0);
    const limit = _.get(params, 'limit', 0);
    const condition = page > 0 || limit > 0 ? '&' : '?';
    const queryName = `${condition}sortField=${params.sortField}`;
    queryString = queryString.concat(queryName);
  }
  if (params?.sortDirection) {
    const page = _.get(params, 'page', 0);
    const limit = _.get(params, 'limit', 0);
    const condition = page > 0 || limit > 0 ? '&' : '?';
    const queryName = `${condition}sortDirection=${params.sortDirection}`;
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


export const getPoolDetail = async (poolId: string, address: string) => {
  return await axiosInstance
    .get(`/pools/detail/${poolId}/${address}`)
    .catch(function (error) {
      if (error.response) {
        return error.response.status;
      }
    });
}

export const createPool = async (payload: any) => {
  return await axiosInstance
    .post('/pools/create', payload)
    .catch(function (error) {
      if (error.response) {
        return error.response.status;
      }
    });
}


export const updatePool = async (poolId: string, payload: any) => {
  return await axiosInstance
    .patch(`/pools/update/${poolId}`, payload)
    .catch(function (error) {
      if (error.response) {
        return error.response.status;
      }
    });
}


export const changeStatusDeploying = async (poolId: string) => {
  return await axiosInstance
    .post(`/pools/deploy/${poolId}`)
    .catch(function (error) {
      if (error.response) {
        return error.response.status;
      }
    });
}

export const deployPoolToSmartContract = async (poolId: string) => {
  return await axiosInstance
    .post(`/pools/deployed/${poolId}`)
    .catch(function (error) {
      if (error.response) {
        return error.response.status;
      }
    });
}
