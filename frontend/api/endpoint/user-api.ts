const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

export const userApi = {
  GET_ALL: `${baseUrl}/users`,
  GET_BY_ID: `${baseUrl}/users/`,
  CREATE: `${baseUrl}/users`,
  UPDATE: `${baseUrl}/users/`,
  DELETE: `${baseUrl}/users/`,
};
