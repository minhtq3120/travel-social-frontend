import { MOCK_TOKEN_ABI, STAKING_CONTRACT_ABI } from "./abi";
import { InjectedConnector } from '@web3-react/injected-connector/';



import { providers, ethers } from 'ethers';

export const umadToken = async (tokenAddress: string) => {
  const umadABI = MOCK_TOKEN_ABI;
  return await createInstanceContract(tokenAddress, JSON.parse(umadABI));
};


export const nftToken = async () => {
  const nftABI = MOCK_TOKEN_ABI;
  const nftAddress = process.env.REACT_APP_NFT_TOKEN_ADDRESS;
  return await createInstanceContract(nftAddress as string, JSON.parse(nftABI));
};

export const nftToken2 = async (collectionAddr: string) => {
  const nftABI = MOCK_TOKEN_ABI;
  return await createInstanceContract(collectionAddr, JSON.parse(nftABI));
};

export const stakingNFT = async () => {
  const stakingABI = STAKING_CONTRACT_ABI;
  const stakingAddress = process.env.REACT_APP_STAKING_ADDRESS;

  return await createInstanceContract(stakingAddress as string, JSON.parse(stakingABI));
};

export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));


export const createInstanceContract = async (address: string, abi: string) => {
  await sleep();
  const provider = await injectedConnector.getProvider();
  const web3Provider = await new providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();
  return new ethers.Contract(address, abi, signer);
};

export const injectedConnector = new InjectedConnector({ supportedChainIds: [1, 4, 3, 5, 42, 56, 97] })

export const signMessage = async (msg: any, library: any, walletAdddress: string) => {
  if (!library || !msg) throw new Error('invalid params');
  console.log({
    msg,
    library
  })
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


