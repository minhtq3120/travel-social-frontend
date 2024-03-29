import { MOCK_TOKEN_ABI, STAKING_CONTRACT_ABI } from "./abi";
import { InjectedConnector } from '@web3-react/injected-connector/';

import Web3 from 'web3';


import { providers, ethers } from 'ethers';
import BigNumber from "bignumber.js";

export const STAKING_ADDRESS = '0x8952513F0AED52EcAC8fCb12ED747f9abc77710a'

export const MSN_TOKEN_ADDRESS = '0x61ee09f919d7D6F48e83dB94dFBEd55399DAD07d'



export const msnToken = async () => {
  const umadABI = MOCK_TOKEN_ABI;
  return await createInstanceContract(MSN_TOKEN_ADDRESS, JSON.parse(umadABI));
};

export const staking = async () => {
  const stakingABI = STAKING_CONTRACT_ABI;

  return await createInstanceContract(STAKING_ADDRESS as string, JSON.parse(stakingABI));
};

export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));



export const createInstanceContract = async (address: string, abi: string) => {
  await sleep();
  const provider = await injectedConnector.getProvider();
  const web3Provider = await new providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();
  return new ethers.Contract(address, abi, signer);
};

export const injectedConnector = new InjectedConnector({ supportedChainIds: [4] })

export const signMessage = async (msg: any, library: any, walletAdddress: string) => {
  if (!library || !msg) throw new Error('invalid params');

  const provider: any = await getProvider();
  const signature = await provider.send('personal_sign', [
    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(msg)),
    walletAdddress.toLowerCase(),
  ]);
  return signature?.result;
};

export const signWallet = (library: any, walletAddress: string) => {
  return signMessage('LIVERPOOL', library, walletAddress);
};

export const getProvider = async () => {
  return await injectedConnector.getProvider()
}

export const getContractInstanceEther = async (ABIContract: any, contractAddress: string) => {
  const provider = await getProvider()
  const signer = provider.getSigner()

  return new ethers.Contract(contractAddress, ABIContract, signer)
}

export const getSigner = async () => {
  const provider = await getProvider()

  return provider.getSigner()
}


// 