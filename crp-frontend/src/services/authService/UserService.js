import AuthAPI from "../authService/AuthAPI";

class UserService {
    signUp(value) {
        return AuthAPI.post(`/auth/signup`, value);
    }
    login(values) {
        return AuthAPI.post(`/auth/login`, values);
    }
}

export default new UserService();