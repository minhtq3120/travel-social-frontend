export type LoginParams = {
  email: string
  password: string
};


export type RegisterParams = {
  email: string,
  password: string,
  displayName: string,
  birthday: string,
  sex: number,
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

