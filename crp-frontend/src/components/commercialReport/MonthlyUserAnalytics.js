import styled from "styled-components";
import {Button, Col, DatePicker,Form, Input, Row, Select, Table, Tooltip} from "antd";
import useReports from "../lib/hooks/useReports";
import React, {useState} from "react";
import {
    CustomDateRangeChecker,
} from "../lib/common/CustomDateRangeChecker";
import {monthlyAnalyticsEndPoint} from "../../services/ApiEndPointService";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import ReportCard from "../lib/common/ReportCard";
import CustomSelect from "../lib/common/CustomSelect";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import {CustomTableSkeleton} from "../lib/common/CustomTableSkeleton";
import {useResource4} from "../lib/hooks/useInventory";
import {formatInputDate, getMonthName} from "../lib/common/Helper";


const CustomDiv = styled.div`
  display: flex;
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    padding-bottom: 10px;
  }
`;
const FormItem = styled(Form.Item)`
  width: 100%;
  padding-right: 2px;
  @media (max-width: 768px) {
    .ant-form-item-label {
      height: 40px;
    }
    &&.ant-form-item {
      margin-bottom: 7.5px !important;
    }
  }
`;


const MonthlyUserAnalytics = () => {
    const summaryColumns = [
       {
            title: "Month",
            dataIndex: "month",
            render: (text) => (getMonthName(text))
        },
        {
            title: "Visitors",
            dataIndex: "totalVisitors",
        },
        {
            title: "Total Page Views",
            dataIndex: "totalPageViews",
        },
        {
            title: "Average Duration",
            dataIndex: "averageDuration",
            render: (text) => (text.toFixed(2))
        },
        {
            title: "Total Register User",
            dataIndex: "totalRegisterUser",
        }
    ];
    const customColumns = [
        {
            title: "Day of Month",
            dataIndex: "dayOfMonth",
            render: (text) => (formatInputDate(text))
        },
        {
            title: "Visitors",
            dataIndex: "visitors",

        },
        {
            title: "Page Views",
            dataIndex: "pageViews",
        },
        {
            title: "Average Duration",
            dataIndex: "averageDuration",
            render: (text) => (text.toFixed(2))
        },
        {
            title: "Register User",
            dataIndex: "registerUser",
        }
    ];

    const [form] = Form.useForm();

    const {data: monthlyAnalytics, initData: initMonthlyAnalytics} = useResource4(monthlyAnalyticsEndPoint);

    const [isLoading, setIsLoading] = useState(false);

    const customInsideOutsideDhakaData = monthlyAnalytics?.breakdownResults?.map((data, index) => ({
        ...data,
        dayOfMonth: data?.dayOfMonth,
        day: data?.day,
        month: data?.month,
        visitors: data?.visitors,
        pageViews: data?.pageViews,
        averageDuration: data?.averageDuration,
        registerUser: data?.registerUser,
    }));

    const customFilterOptions = {
        registerUser: "",
        month: "",
    };
    const propertyNames = [];
    const {
        form: reportForm,
        handleSearchTable,
        searchText,
    } = useReports(
        customInsideOutsideDhakaData,
        customFilterOptions,
        customColumns,
        propertyNames
    );

    const customDate = Form.useWatch("created_at", form);

    const onFinish = async (values) => {

        const selectedDate =CustomDateRangeChecker(values)

        const isoStartDate = new Date(`${selectedDate.range_start}T00:00:00.000Z`).toISOString();
        const isoEndDate = new Date(`${selectedDate.range_end}T23:59:59.999Z`).toISOString();
        const filterMonth = {
            'gte': isoStartDate,
            'lte': isoEndDate,
        };

        const filterString = encodeURIComponent(JSON.stringify(filterMonth));

        try {
            setIsLoading(true);
            await initMonthlyAnalytics(['data'], filterString);
        } finally {
            setIsLoading(false);
        }

    };


    return (
        <CommonLayout>
            <DashboardLayout>
                <ReportCard title="Filter" style={{ marginBottom: 10 }}>
                    <Form form={form} onFinish={onFinish}>
                        <Row gutter={[16, 16]}>
                            <Col sm={24} xs={24} md={6}>
                                <FormItem
                                    label={"Date Range"}
                                    placeholder="Select date"
                                    name="created_at"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please input your date!",
                                        },
                                    ]}
                                >
                                    <CustomSelect allowClear>
                                        <Select.Option value="today">Today</Select.Option>
                                        <Select.Option value="last">Yesterday</Select.Option>
                                        <Select.Option value="lastWeek">Last Week</Select.Option>
                                        <Select.Option value="lastMonth">Last Month</Select.Option>
                                        <Select.Option value="custom">
                                            <Tooltip title="Please select max 1 month for better performance">
                                                Custom Date Range
                                            </Tooltip>
                                        </Select.Option>
                                    </CustomSelect>
                                </FormItem>
                            </Col>
                            {customDate === "custom" && (
                                <Col sm={24} md={6} xs={24}>
                                    <Form.Item name="customDateRange">
                                        <DatePicker.RangePicker />
                                    </Form.Item>
                                </Col>
                            )}
                            <Col sm={24} md={6} xs={24}>
                                <FormItem>
                                    <SubmitBtn
                                        type="primary"
                                        htmlType="submit"
                                        style={{ marginRight: 8 }}
                                    >
                                        Apply
                                    </SubmitBtn>
                                    <Button >Reset</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </ReportCard>
                <ReportCard  title="Summary" style={{ marginBottom: 10 }}>
                   <Row>
                       <Col  sm={24} md={24} xs={24}>
                           {monthlyAnalytics?.data?.summaryResults?.length > 0 ? (
                               <Table
                                   pagination={false}
                                   bordered
                                   dataSource={monthlyAnalytics?.data?.summaryResults}
                                   columns={summaryColumns}
                               />
                           ) : (
                               <CustomTableSkeleton />
                           )}
                       </Col>
                   </Row>

                </ReportCard>
                <ReportCard  title="Break Down Results" style={{ marginBottom: 10 }}>
                    <CustomDiv
                        style={{
                            // display: "flex",
                            justifyContent: "space-between",
                            paddingTop: "10px",
                            marginBottom: "-10px",
                        }}
                    >
                        <CustomDiv
                            style={{
                                // display: "flex",
                                justifyContent: "start",
                                marginBottom: "-10px",
                            }}
                        >
                            {/*<div>*/}
                            {/*    <Form>*/}
                            {/*        <ReportFormItem>*/}
                            {/*            <Input*/}
                            {/*                size="small"*/}
                            {/*                placeholder="Search..."*/}
                            {/*                value={searchText}*/}
                            {/*                onChange={(e) => handleSearchTable(e.target.value)}*/}
                            {/*                style={{ background: "#F8F9FA" }}*/}
                            {/*            />*/}
                            {/*        </ReportFormItem>*/}
                            {/*    </Form>*/}
                            {/*</div>*/}
                        </CustomDiv>
                    </CustomDiv>

                    {monthlyAnalytics?.data?.breakdownResults?.length > 0 ? (
                        <Table
                            pagination={false}
                            bordered
                            dataSource={monthlyAnalytics?.data?.breakdownResults}
                            columns={customColumns}
                        />
                    ) : (
                        <CustomTableSkeleton />
                    )}
                </ReportCard>
            </DashboardLayout>
        </CommonLayout>
    );
};

export default MonthlyUserAnalytics;