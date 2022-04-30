export type LoginParams = {
  email: string
  password: string
};


export type RegisterParams = {
  email: string,
  password: string,
  displayName: string,
};

export type LoginParamsWalletAddress = {
  walletAddress: string,
  signature: string,
  email:string
};


export type RegisterParamsWalletAddress = {
  email: string,
  walletAddress: string
};


export type ActivateParams = {
  email: string,
  activationCode: string,
}

export type ResetPassword = {
  email: string,
  newPassword: string,
  token: string,
}

