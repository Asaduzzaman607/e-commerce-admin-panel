import {Form} from "antd";
import React from "react";
import {formLayout as layout} from "../lib/common/layout";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import ResetBtn from "../lib/common/button/ResetBtn";
import CustomInput from "../lib/common/CustomInput";

const AddUser = ({onReset, id}) => {
    return (
        <>
            <Form.Item
                name="name"
                label="User Name"
                rules={[
                    {
                        required: true,
                        message: "Please enter your user name"
                    },
                ]}
            >
                <CustomInput/>
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                rules={[
                    {
                        required: true,
                        message: "Please enter your email"
                    },
                    {
                        pattern: '[a-z0-9]+@[a-z]+\\.[a-z]{2,3}',
                        message: "Please enter a valid email!"
                    }
                ]}
            >
                <CustomInput/>
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please enter your password!',
                    },
                ]}
            >
                <CustomInput.Password/>
            </Form.Item>
            <Form.Item
                label="Confirm Password"
                name="confirm_password"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The new password that you entered does not match!'));
                        },
                    }),
                ]}
            >
                <CustomInput.Password/>
            </Form.Item>

            <Form.Item wrapperCol={{...layout.wrapperCol}}>
                <div style={{display: 'flex', float: "right"}}>
                    <ResetBtn onClick={onReset} style={{marginRight: "10px"}}>
                        Reset
                    </ResetBtn>
                    <SubmitBtn htmlType="submit">
                        {id ? "Update" : "Submit"}
                    </SubmitBtn>
                </div>
            </Form.Item>
        </>

    );
};

export default AddUser;
