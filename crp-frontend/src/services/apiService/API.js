import axios from "axios";
import {getJWTToken} from "../../components/lib/common/auth/authHelper";


const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${getJWTToken()}`;
    return config;
});

export default API;
