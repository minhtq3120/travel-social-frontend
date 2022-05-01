import axiosInstance from "src/config/config";
import { StakeGetSignature } from "./params-type";

export const getSignature = async (payload: StakeGetSignature) => {
    try {
        return await axiosInstance.post(`/pool/getSignature`, payload);
    } catch (error) {
        throw error;
    }
};

export const getListPool = async () => {
    try {
        return await axiosInstance.get(`/pool`);
    } catch (error) {
        throw error;
    }
};

export const getStakingDataByAddress = async (payload) => {
    try {
        return await axiosInstance.post(`/pool/getStakingData`, payload);
    } catch (error) {
        throw error;
    }
};