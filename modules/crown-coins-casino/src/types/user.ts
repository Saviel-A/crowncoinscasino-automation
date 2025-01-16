import { config } from "../config/config";
import { generateRandomString } from "../utils/generic";

export interface User {
  email: string;
  password: string;
  username: string;
}

export const generateUser = (): User => {
  return {
    email: config.USER_EMAIL,
    password: config.USER_PASSWORD,
    username: generateRandomString(10),
  };
};