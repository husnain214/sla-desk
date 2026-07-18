import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.error ?? "Something went wrong";
    const status = error.response?.status ?? 500;
    return Promise.reject(new ApiError(message, status));
  },
);
