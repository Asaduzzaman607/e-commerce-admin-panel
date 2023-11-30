import { Form } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../../redux/reducers/user.reducer";
import { notifyResponseError, notifySuccess } from "../common/notifications";
import UserService from "../../../services/authService/UserService";

export default function useLogin() {
  const [loginForm] = Form.useForm();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await UserService.login(values);
      dispatch(setUser(data));
      localStorage.setItem("userName", `${data?.data?.user?.name}`);
      localStorage.setItem("token", `${data?.data?.access_token}`);
      setLoading(false);
      notifySuccess(`${data?.message}`);
      navigate("/");
    } catch (er) {
      setLoading(false);
      notifyResponseError(er);
    }
  };

  return {
    loginForm,
    loading,
    onFinish,
  };
}
