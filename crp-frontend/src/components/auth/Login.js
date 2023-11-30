import EmptyLayout from "../../layout/EmptyLayout";
import { Button, Card, Col, Form, Row } from "antd";
import CRPForm from "../lib/common/CRPForm";
import CustomInput from "../lib/common/CustomInput";

import login from "../../assets/images/login.svg";
import styled from "styled-components";

import useLogin from "../lib/hooks/useLogin";

const CustomButton = styled(Button)`
  width: 45% !important;
  text-align: center;
  background-color: #ffc900;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0px 1px 1px 0px #00000040;
  margin-top: 5px;
  &:hover {
    border: none !important;
    background-color: #ffc900;
    color: black !important;
  }
  &:focus,
  &:active {
    border: none !important;
    background-color: #ffc900;
    color: black !important;
  }
`;

const ContainerDiv = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  @media (max-width: 768px) {
    overflow-y: auto;
  }
`;

const ImageDiv = styled.div`
  background-color: rebeccapurple;
  height: 100vh;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    margin: 20px;
    width: 100%;
  }
`;

const FormDiv = styled.div`
  background-color: #ffffff;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenteredCard = styled(Card)`
  width: 50%;
  height: 300px;
  background-color: #f1f1f1;
  border-radius: 4px;
  @media (max-width: 768px) {
    margin: 20px;
    width: 100%;
  }
`;
const FormItem=styled(Form.Item)`
.ant-form-item-label{
  height: 40px;
}
&&.ant-form-item {
    margin-bottom: 7.5px !important;
}

`

const Login = () => {
  const { loginForm, loading, onFinish } = useLogin();
  return (
    <EmptyLayout>
      <ContainerDiv>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12}>
            <ImageDiv>
              <img src={login} alt="" />
            </ImageDiv>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <FormDiv>
              <CenteredCard>
                <CRPForm layout="vertical" form={loginForm} onFinish={onFinish} size="large">
                  <FormItem
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                      },
                      {
                        pattern:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Please enter a valid email address!",
                      },
                    ]}
                  >
                    <CustomInput />
                  </FormItem>
                  <FormItem
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <CustomInput.Password iconRender={() => null} />
                  </FormItem>
                  <FormItem style={{ textAlign: "center"}}>
                    <CustomButton htmlType="submit" disabled={loading}>
                      {" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        LOGIN
                      </span>
                    </CustomButton>
                  </FormItem>
                </CRPForm>
              </CenteredCard>
            </FormDiv>
          </Col>
        </Row>
      </ContainerDiv>
    </EmptyLayout>
  );
};

export default Login;
