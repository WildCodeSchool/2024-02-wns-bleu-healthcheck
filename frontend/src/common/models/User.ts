export type User = {
  name: string;
  email: string;
  role: Role;
}

export type UserRegisterInput = {
  name: string;
  email: string;
  password: string;
}

export enum Role {
  USER,
  PREMIUM,
  ADMIN
}
  