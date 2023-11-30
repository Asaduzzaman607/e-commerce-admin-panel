import React, {useEffect} from "react";
import {Button, Col, Form, Modal, Pagination, Select, Space, Table} from "antd";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import ReportCard from "../lib/common/ReportCard";
import useReports from "../lib/hooks/useReports";
import useUsers from "../lib/hooks/useUsers";
import AddUser from "./AddUser";
import CRPForm from "../lib/common/CRPForm";
import {
    CloseCircleOutlined, DeleteOutlined, DoubleLeftOutlined, DoubleRightOutlined, EditOutlined, EyeOutlined,
    LeftOutlined, PlusOutlined,
    RightOutlined, SearchOutlined
} from "@ant-design/icons";
import {formLayout as layout} from "../lib/common/layout";
import CustomSelect from "../lib/common/CustomSelect";
import {Link} from "react-router-dom";
import {CustomSpan, CustomTable} from "../deliveryReport/DeliveryReport";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import ResetBtn from "../lib/common/button/ResetBtn";
import CustomInput from "../lib/common/CustomInput";
import {usePaginate} from "../lib/hooks/usePagination";
import { CustomPagination } from "../lib/common/CustomPaginationStyle";


export const handleEdit = async (record) => {

    console.log({record})
    try {

    } catch (error) {
        console.error('Error:', error);
    }
};

// Define the handleDelete function
export const handleDelete = async (record) => {
    try {

    } catch (error) {
        console.error('Error:', error);
    }
};


const customFilterOptions = {
    name: "",
    email: "",
};


const customColumns = [
    {
        title: "SL",
        width: 50,
        dataIndex: "sl",
        render: (_, __, index) => index + 1,
    },
    {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: "Email",
        dataIndex: "email",
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: "Action",
        dataIndex: "action",
        width: 100,
        render: (_, record) => (

            // <Space size="middle">
            //     <Link to={`/employees/employee/details/1`}>
            //         <Button
            //             type="primary"
            //             size="small"
            //             style={{
            //                 backgroundColor: '#4aa0b5',
            //                 borderColor: '#4aa0b5',
            //             }}
            //         >
            //             <EyeOutlined />
            //         </Button>
            //     </Link>
            //
            //     <Link to={`/employees/employee/add/2`}>
            //         <Button
            //             danger
            //             type="primary"
            //             size="small"
            //             style={{
            //                 backgroundColor: '#6e757c',
            //                 borderColor: '#6e757c',
            //             }}
            //         >
            //             <EditOutlined />
            //         </Button>
            //     </Link>
            //
            //     <Button
            //         danger
            //
            //         handleOk={async () => {
            //             try {
            //
            //             } catch (e) {
            //                 notification['error']({
            //                     message: getErrorMessage(e),
            //                 });
            //             }
            //         }}
            //     />
            // </Space>

            <Space size="small">
                <EditOutlined onClick={() => handleEdit(record)} className="edit-link"/>
                <DeleteOutlined onClick={() => handleDelete(record)} className="delete-link"/>
            </Space>

        ),
    },
];

const userData = [
    {
        key: "1",
        name: "John Doe",
        email: 'doe@gmail.com',

    },
    {
        key: "2",
        name: "test",
        email: 'doe@gmail.com',
    },
    {
        key: "3",
        name: "test",
        email: 'doe@gmail.com',
    },
    {
        key: "4",
        name: "test",
        email: 'doe@gmail.com',
    },
    {
        key: "5",
        name: "test",
        email: 'doe@gmail.com',
    },
    {
        key: "6",
        name: "test",
        email: 'doe@gmail.com',
    },
    {
        key: "7",
        name: "test",
        email: 'doe@gmail.com',
    },
];
const customUserData = userData.map((data, index) => ({
    ...data,
    sl: index + 1,
}));


export const Users = () => {

    const {
        onReset,
        id,
        form: userForm,
        showUserModal,
        setShowUserModal,
        handleUserModelSubmit,
        handleOkUsers,
        submitting
    } = useUsers();


    const {
        form,
        fetchData,
        collection,
        page,
        total_data,
        paginate,
        total_page,
        refreshPagination,
        resetFilter,
        deleteReduxKey,
        per_page,
    } = usePaginate('users', 'users');


    useEffect(() => {
        fetchData();
    }, []);






    return (
        <CommonLayout>

            {
                showUserModal && <Modal
                    title={"Add New User Info"}
                    style={{
                        top: 20,
                    }}
                    closeIcon={<CloseCircleOutlined/>}
                    onOk={handleOkUsers}
                    destroyOnClose={true}
                    onCancel={() => setShowUserModal(false)}
                    centered
                    open={showUserModal}
                    width={450}
                    footer={null}
                    maskClosable={false}
                >

                    <CRPForm
                        {...layout}
                        form={userForm}
                        layout="vertical"
                        name="nest-messages"
                        onFinish={handleUserModelSubmit}
                    >
                        <AddUser submitting={submitting} onReset={onReset} id={id}
                                 handleUserModelSubmit={handleUserModelSubmit}/>
                    </CRPForm>

                </Modal>
            }

            <DashboardLayout>
                <>
                    <ReportCard title="Filter" style={{marginBottom: 10}}>
                        <div style={{display: 'flex'}}>
                            <CRPForm layout="inline" style={{flex: 1}} form={form} onFinish={fetchData}>

                                <Col lg={6} md={6} sm={24} xs={24}>
                                    <Form.Item name="name">
                                        <CustomInput prefix={<SearchOutlined/>} placeholder={"Name"}/>
                                    </Form.Item>
                                </Col>
                                <Col lg={6} md={6} sm={24} xs={24}>
                                    <Form.Item name="email">
                                        <CustomInput prefix={<SearchOutlined/>} placeholder={"Email"}/>
                                    </Form.Item>
                                </Col>

                                <Col lg={6} md={6} sm={24} xs={24}>
                                    <Form.Item>
                                        <SubmitBtn htmlType="submit"  style={{marginRight: 8}}>
                                            Apply
                                        </SubmitBtn>
                                        <ResetBtn onClick={resetFilter}>Reset</ResetBtn>
                                    </Form.Item>
                                </Col>

                                <Col lg={6} md={6} sm={24} xs={24}>
                                    <Form.Item>
                                        <Button
                                            onClick={() => setShowUserModal(true)}
                                            style={{
                                                backgroundColor: '#72AC51',
                                                width: '132px',
                                                radius: '4px',
                                                color: 'white',
                                                float: "right"
                                            }}><PlusOutlined />Add
                                            New</Button>
                                    </Form.Item>
                                </Col>
                            </CRPForm>

                        </div>
                    </ReportCard>
                    <ReportCard>
                        <CustomTable
                            style={{marginTop: '10px'}}
                            dataSource={collection}
                            columns={customColumns}
                            pagination={false}
                            // pagination={{
                            //     ...pagination,
                            //     showLessItems: true,
                            //     itemRender: (page, type, originalElement) => {
                            //         if (type === "jump-prev" || type === "jump-next") {
                            //             return <span>...</span>;
                            //         }
                            //         if (
                            //             type === "prev" ||
                            //             type === "next" ||
                            //             type === "prev_5" ||
                            //             type === "next_5"
                            //         ) {
                            //             return (
                            //                 <Link
                            //                     href="#"
                            //                     onClick={(e) => {
                            //                         e.preventDefault();
                            //                         handleTableChange(type);
                            //                     }}
                            //                 >
                            //                     {type === "prev" && (
                            //                         <>
                            //                             <CustomSpan>
                            //                                 <LeftOutlined/>
                            //                             </CustomSpan>
                            //                         </>
                            //                     )}
                            //                     {type === "next" && (
                            //                         <>
                            //                             <CustomSpan>
                            //                                 <RightOutlined/>
                            //                             </CustomSpan>
                            //                         </>
                            //                     )}
                            //                     {type === "prev_5" && <DoubleLeftOutlined/>}
                            //                     {type === "next_5" && <DoubleRightOutlined/>}
                            //                 </Link>
                            //             );
                            //         }
                            //         return originalElement;
                            //     },
                            // }}
                            // onChange={handleTableChange}
                        />
                        <CustomPagination
                            current={page}
                            pageSize={per_page}
                            total={total_data}
                            onChange={paginate}
                        />
                    </ReportCard>
                </>
            </DashboardLayout>
        </CommonLayout>
    )
        ;
}