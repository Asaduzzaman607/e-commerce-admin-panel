import {Form, notification} from "antd";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {notifyResponseError} from "../common/notifications";
import {useBoolean} from "react-use";
import userService from "../../../services/authService/UserService";
import {fetchUsersPagination, refreshPagination} from "./usePagination";
import {useDispatch} from "react-redux";

export default function useUsers() {
    const userName = "Admin";
    let {id} = useParams();
    const [form] = Form.useForm();
    const [submitting, toggleSubmitting] = useBoolean(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()


    const handleUserModelSubmit = async (values) => {
        try {
            toggleSubmitting()
            if (id) {
                await userService.signUp(id, values)
            } else {
                let {data} = await userService.signUp(values)
            }
            setShowUserModal(false);
            dispatch(fetchUsersPagination("users", "users/"));
            form.resetFields()
            navigate("/user");
            notification["success"]({
                message: id ? "Successfully updated!" : "Successfully added!",
            });

        } catch (er) {
            notifyResponseError(er);
            toggleSubmitting()
        }
    };


    const getSingleData = async () => {
    };

    const onReset = () => {
        if (id) {
            getSingleData(id);
        }
        form.resetFields();
    };

    useEffect(() => {
        if (!id) return;
        getSingleData(id);
    }, [id]);

    const handleOkUsers = () => {
        setShowUserModal(false)
    };


    return {
        userName,
        id,
        form,
        getSingleData,
        onReset,
        showUserModal,
        setShowUserModal,
        handleUserModelSubmit,
        submitting,
        handleOkUsers
    };
}
