import React, {useState} from 'react';
import {
    Table,
    Button,
    Dropdown,
    Form,
    Row,
    Col,
    Card,
    Select,
    Empty,
    Pagination,
    Tooltip,
    DatePicker,
    Input
} from 'antd';
import {DownOutlined, FileExcelFilled, FilePdfFilled} from '@ant-design/icons';
import 'jspdf-autotable';
import ReportCard from "../lib/common/ReportCard";
import {exportToExcel, exportToPDF, formatMoney, formatUnderLineText} from '../lib/common/Helper';
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import ExportToExcelButton, {ExportButton} from '../lib/common/ExportButton';
import useReports from "../lib/hooks/useReports";
import CustomInput from "../lib/common/CustomInput";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import ResetBtn from "../lib/common/button/ResetBtn";
import CRPForm from "../lib/common/CRPForm";
import {CustomTableSkeleton} from "../lib/common/CustomTableSkeleton";
import {usePaginate} from "../lib/hooks/usePagination";
import {CustomTable} from "../lib/common/CustomTableStyle";
import {CustomPagination} from "../lib/common/CustomPaginationStyle";
import styled from "styled-components";
import dayjs from "dayjs";
import axios from "axios";
import {notifyResponseError} from "../lib/common/notifications";
import {DualAxes} from "@ant-design/plots";


const DistrictWiseSalesCustomDiv = styled(Card)`
  border: 1px solid #d2dae5 !important;
  padding: 5px;
`;
const DistrictWiseSalesReport = () => {
    const customFilterOptions = {
        name: "",
        age: "",
    };

    const customColumns = [
        {
            title: "SL",
            dataIndex: "sl",
            render: (_, __, index) => index + 1,
        },
        {
            title: "District Name",
            dataIndex: "district_name",
            sorter: (a, b) => a.district_name.localeCompare(b.district_name),
        },
        {
            title: "Order Count",
            dataIndex: "order_counts",
        },

        {
            title: "GMV(BDT)",
            dataIndex: "gmv",
        },
    ];

    const propertyNames = ["district_name"];

    const [form] = Form.useForm();

    const [collection, setCollection] = useState([]);
    const customDate = Form.useWatch("created_at", form);

    const handleFinish = async (values) => {
        const [startDate, endDate] = values.customDateRange || "";

        let range_start;
        let range_end;
        if (values.created_at === "today") {
            range_start = dayjs().format("YYYY-MM-DD");
            range_end = dayjs().format("YYYY-MM-DD");
        }
        if (values.created_at === "last") {
            range_start = dayjs().subtract(1, "day").format("YYYY-MM-DD");
            range_end = dayjs().subtract(1, "day").format("YYYY-MM-DD");
        }
        if (values.created_at === "lastWeek") {
            range_start = dayjs().subtract(1, "week").format("YYYY-MM-DD");
            range_end = dayjs().subtract(1, "week").format("YYYY-MM-DD");
        }
        if (values.created_at === "lastMonth") {
            range_start = dayjs().subtract(1, "month").format("YYYY-MM-DD");
            range_end = dayjs().subtract(1, "month").format("YYYY-MM-DD");
        }
        if (values.created_at === "custom") {
            range_start = startDate?.format("YYYY-MM-DD");
            range_end = endDate?.format("YYYY-MM-DD");
        }

        const modifiedData = {
            range_start: range_start,
            range_end: range_end,
            api_key: "ZOHYSUHIRZS_LBM!@050PA5-POMU0ZBX-@WY)=5XP&)B#05*G",
        };
        try {
            const { data } = await axios.post(
                `https://oms.shoplover.com/sll/crp/district-wise-sales`,
                modifiedData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setCollection(data?.data);
        } catch (er) {
            notifyResponseError(er);
        }
    };

    const onReset = () => {
        form.resetFields();
    };
    const modifiedData = collection?.map((item) => ({
        district_name: formatUnderLineText(item.district_name),
        order_counts: item?.order_counts,
        gmv: formatMoney(item?.gmv),

    }));

    const districtWiseReportData = modifiedData?.map((data, index) => ({
        sl: index + 1,
        ...data
    }));

    const exportFormatData = districtWiseReportData?.map((districtReport) => ({
        "SL": districtReport?.sl,
        "District Name": districtReport?.district_name,
        "Order Counts" : districtReport?.order_counts,
        "GMV": districtReport?.gmv,
    }));

    const lineChartData = collection?.map((line) => ({
        year: line?.district_name,
        order: line?.order_counts,
        gmv: line?.gmv,
    }));

    const barChartData = [];
    collection?.map((bar) => {
        barChartData?.push({
            time: bar?.key,
            value: bar?.order_counts,
            type: "Order",
        });
        barChartData?.push({
            time: bar?.key,
            value: bar?.gmv,
            type: "GMV",
        });
    });
    const {
        form: chartForm,
        handleDropdownClick,
        menu,
        columns,
        visibleColumns,
        data
    } = useReports(
        districtWiseReportData,
        customFilterOptions,
        customColumns,
        propertyNames
    );
    const graph = Form.useWatch("graph", chartForm) || "column";

    const transformData = [];
    const config = {
        data:
            graph === "column"
                ? [barChartData, transformData]
                : [lineChartData, lineChartData],
        xField: graph === "column" ? "time" : "year",
        yField: graph === "column" ? ["value"] : ["order", "gmv"],
        geometryOptions:
            graph === "column"
                ? [
                    {
                        geometry: "column",
                        isGroup: true,
                        seriesField: "type",
                        columnWidthRatio: 0.4,
                        columnStyle: {
                            radius: [5, 5, 0, 0],
                        },
                    },
                ]
                : [
                    {
                        geometry: "line",
                        color: "#5B8FF9",
                    },
                    {
                        geometry: "line",
                        color: "#5AD8A6",
                    },
                ],
        legend: {
            layout: "horizontal",
            position: "top-left",
            marker: { symbol: "square" },
        },
    };
    console.log({collection})
    return (
        <CommonLayout>
            <DashboardLayout>
                <>
                    <ReportCard title="Filter" style={{ marginBottom: 10 }}>
                        <Form form={form} onFinish={handleFinish}>
                            <Row gutter={[6, 6]}>
                                <Col sm={20} md={6} xs={20}>
                                    <Form.Item
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
                                        <Select allowClear>
                                            <Select.Option value="today">Today</Select.Option>
                                            <Select.Option value="last">Yesterday</Select.Option>
                                            <Select.Option value="lastWeek">Last Week</Select.Option>
                                            <Select.Option value="lastMonth">
                                                Last Month
                                            </Select.Option>
                                            <Select.Option value="custom">
                                                <Tooltip title="Please select max 1 month for better performance">
                                                    Custom Date Range
                                                </Tooltip>
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                {customDate === "custom" && (
                                    <Col sm={20} md={6} xs={20}>
                                        <Form.Item name="customDateRange">
                                            <DatePicker.RangePicker />
                                        </Form.Item>
                                    </Col>
                                )}
                                <Col sm={20} md={6} xs={20}>
                                    <Form.Item>
                                        <SubmitBtn htmlType="submit" style={{ marginRight: 8 }}>
                                            Apply
                                        </SubmitBtn>
                                        <ResetBtn onClick={onReset}>Reset</ResetBtn>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </ReportCard>
                    <ReportCard>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingTop: "10px",
                                marginBottom: "10px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                }}
                            ></div>
                            <div>
                                <Dropdown overlay={menu} onClick={handleDropdownClick}>
                                    <Button size="small">
                                        Visibility <DownOutlined />
                                    </Button>
                                </Dropdown>
                                <ExportToExcelButton data={exportFormatData} fileName="district_wise_sales_report"
                                                     size="small">
                                </ExportToExcelButton>
                                <ExportButton onClick={() => exportToPDF( exportFormatData,'district_wise_sales_report','portrait','District Wise Sales Report')}>
                                    <FilePdfFilled
                                        style={{ fontSize: "16px", color: "#FF5733" }}
                                    />
                                </ExportButton>
                            </div>
                        </div>
                        <CustomTable
                            dataSource={districtWiseReportData}
                            columns={visibleColumns}
                            pagination={false}
                        />
                    </ReportCard>
                    {/*<Col sm={24} xs={24} md={24} lg={24}>*/}
                    {/*    <ReportCard*/}
                    {/*        title="District Wise Sales Data"*/}
                    {/*        extra={*/}
                    {/*            <Form*/}
                    {/*                form={chartForm}*/}
                    {/*                style={{ marginTop: "8px", display: "flex" }}*/}
                    {/*            >*/}
                    {/*                <Row gutter={16}>*/}
                    {/*                    <Col xs={24} sm={12}>*/}
                    {/*                        <Form.Item name="graph" style={{ marginRight: "3px" }}>*/}
                    {/*                            <Select style={{ width: 120 }} defaultValue="column">*/}
                    {/*                                <Select.Option value="column">*/}
                    {/*                                    Bar Chart*/}
                    {/*                                </Select.Option>*/}
                    {/*                                <Select.Option value="line">Line Chart</Select.Option>*/}
                    {/*                            </Select>*/}
                    {/*                        </Form.Item>*/}
                    {/*                    </Col>*/}
                    {/*                </Row>*/}
                    {/*            </Form>*/}
                    {/*        }*/}
                    {/*    >*/}
                    {/*        <DistrictWiseSalesCustomDiv>*/}
                    {/*            <DualAxes style={{ height: "200px" }} {...config} />*/}
                    {/*        </DistrictWiseSalesCustomDiv>*/}
                    {/*    </ReportCard>*/}
                    {/*</Col>*/}
                </>
            </DashboardLayout>
        </CommonLayout>
    );
};

export default DistrictWiseSalesReport;