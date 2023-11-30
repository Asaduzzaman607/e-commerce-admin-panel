import axios from "axios";
import { getJWTToken } from "../../components/lib/common/auth/authHelper";


const AuthAPI = axios.create({
    baseURL: process.env.REACT_APP_BASE_AUTH_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Add an interceptor to include the JWT token in the request headers
AuthAPI.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${getJWTToken()}`;
    return config;
});

export default AuthAPI;