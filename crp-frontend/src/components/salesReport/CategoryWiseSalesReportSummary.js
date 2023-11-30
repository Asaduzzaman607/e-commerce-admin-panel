import {usePaginate} from "../lib/hooks/usePagination";
import useReports from "../lib/hooks/useReports";
import {Button, Card, Col, DatePicker, Dropdown, Form, Input, Row, Select, Tooltip} from "antd";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import ReportCard from "../lib/common/ReportCard";
import CustomInput from "../lib/common/CustomInput";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import ResetBtn from "../lib/common/button/ResetBtn";
import {DownOutlined, FilePdfFilled} from "@ant-design/icons";
import ExportToExcelButton, {ExportButton} from "../lib/common/ExportButton";
import {exportToPDF, formatMoney} from "../lib/common/Helper";
import {CustomTable} from "../lib/common/CustomTableStyle";
import {CustomTableSkeleton} from "../lib/common/CustomTableSkeleton";
import {CustomPagination} from "../lib/common/CustomPaginationStyle";
import React from "react";
import {DualAxes, Line} from "@ant-design/plots";
import styled from "styled-components";


const PaymentChannelCustomDiv = styled(Card)`
  border: 1px solid #d2dae5 !important;
  padding: 5px;
`;

const CategoryWiseSalesReportSummary = () => {
    const {
        form,
        fetchData,
        collection,
        page,
        total_data,
        paginate,
        total_page,
        refreshPagination,
        resetFilter: resetFilterForm,
        deleteReduxKey,
        per_page,
        sizeForm,
        getSizeValue,
        summary,
    } = usePaginate(
        "categoryWiseSalesReportSummary",
        "customers/category-wise-sales-report"
    );
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
            title: "Category",
            dataIndex: "category_name",
            key: 'category_name',
        },
        {
            title: "Order Count",
            dataIndex: "total_order_details_count",
            key: 'total_order_details_count',
        },
        {
            title: "Periodic GMV BDT",
            dataIndex: "total_order_details_price",
            key: 'total_order_details_price',
        }
    ];


    const customCategoryWiseSalesData = collection?.map((data, index) => ({
        ...data,
        sl: index + 1,
    }));

    const propertyNames = [
        "category_name",
        "total_order_details_count",
        "total_order_details_price",
    ];

    const {
        form: reportForm,
        handleTableChange,
        handleDropdownClick,
        applyFilters,
        resetFilters,
        menu,
        handleSearchTable,
        filteredData,
        searchText,
        columns,
        visibleColumns,
        data,
        topCategoriesData
    } = useReports(
        customCategoryWiseSalesData,
        customFilterOptions,
        customColumns,
        propertyNames
    );


    const modifiedData = filteredData?.map(item => ({
        ...item,
        total_order_details_price: formatMoney(item?.total_order_details_price),
    }));

    const flattenedData = modifiedData?.map(item => ({
        'Top Category L1': item?.category_name,
        'Order Count': item?.total_order_details_count,
        'Periodic GMV BDT': item?.total_order_details_price,
    }))


    const customDate = Form.useWatch("created_at", form);

    const lineChartData = [];
    collection?.slice(0, 15)?.map((bar) => {

        lineChartData?.push({
            year: bar?.category_name,
            value: bar?.total_order_details_price,
            category: "Total Order Details Price",
        });
        lineChartData?.push({
            year: bar?.category_name,
            value: bar?.total_order_details_count,
            category: "Total Order Details Count",
        });
    });

    const barChartData = [];
    collection?.slice(0, 15)?.map((bar) => {

        barChartData?.push({
            time: bar?.category_name,
            value: bar?.total_order_details_price,
            type: "Total Order Details Price",
        });
        barChartData?.push({
            time: bar?.category_name,
            value: bar?.total_order_details_count,
            type: "Total Order Details Count",
        });
    });
    const graph = Form.useWatch("graph", reportForm) || "column";

    const transformData = [];
    const config = {
        data: [barChartData, transformData],
        xField: "time",
        yField: ["value"],
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
            marker: {symbol: "square"},
        },
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: false,
            },
            tickCount: barChartData.length / 2,
        },
    };


    const lineConfig = {
        data: lineChartData,
        xField: "year",
        yField: "value",
        seriesField: "category",
        yAxis: {
            label: {
                formatter: (v) =>
                    `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        legend: {
            layout: "horizontal",
            position: "top-left",
            marker: { symbol: "square" },
        },
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: false,
            },
            tickCount: barChartData.length / 2,
        },
    };

    return (
        <CommonLayout>
            <DashboardLayout>
                <>
                    <ReportCard title="Filter" style={{marginBottom: 10}}>
                        <Form form={form} onFinish={fetchData}>
                            <Row gutter={[6, 6]}>
                                <Col sm={20} md={6} xs={20}>
                                    <Form.Item name={"category_name"}>
                                        <Select
                                            placeholder={"Category Name"}
                                            allowClear
                                        >
                                            {
                                                topCategoriesData?.map(({id, category_name}) =>
                                                    <Select.Option value={category_name}
                                                                   key={id}>{category_name}</Select.Option>)
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
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
                                            <DatePicker.RangePicker/>
                                        </Form.Item>
                                    </Col>
                                )}
                                <Col sm={20} md={6} xs={20}>
                                    <Form.Item>
                                        <SubmitBtn htmlType="submit" style={{marginRight: 8}}>
                                            Apply
                                        </SubmitBtn>
                                        <ResetBtn onClick={resetFilterForm}>Reset</ResetBtn>
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
                                marginBottom: "-10px"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "start",
                                    marginBottom: "-10px"
                                }}
                            >
                                <div>
                                    <Form.Item>
                                        <Input
                                            size={"small"}
                                            placeholder="Search..."
                                            value={searchText}
                                            onChange={(e) => handleSearchTable(e.target.value)}
                                            style={{background: "#F8F9FA"}}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div>
                                <Dropdown overlay={menu} onClick={handleDropdownClick}>
                                    <Button size={"small"}>
                                        Visibility <DownOutlined/>
                                    </Button>
                                </Dropdown>
                                <ExportToExcelButton
                                    data={flattenedData}
                                    fileName="excel_sales_data"
                                    size="small"
                                >

                                </ExportToExcelButton>
                                <ExportButton size={"small"}
                                              onClick={() => exportToPDF(flattenedData, 'category_wise_sales_summary_data.pdf','portrait','Category Wise Sales Summary Report')}>

                                    <FilePdfFilled
                                        style={{fontSize: "16px", color: "#FF5733"}}
                                    />
                                </ExportButton>
                            </div>
                        </div>
                        {modifiedData ? (
                            <CustomTable
                                dataSource={modifiedData}
                                columns={visibleColumns}
                                pagination={false}
                                bordered
                            />
                        ) : (
                            <CustomTableSkeleton/>
                        )}
                    </ReportCard>
                    <Col sm={24} xs={24} md={24} lg={24}>
                        <ReportCard
                            title="Category Wise Sales Summary"
                            extra={
                                <Form
                                    form={reportForm}
                                    style={{marginTop: "8px", display: "flex"}}
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} sm={12}>
                                            <Form.Item name="graph" style={{marginRight: "3px"}}>
                                                <Select style={{width: 120}} defaultValue="column">
                                                    <Select.Option value="column">
                                                        Bar Chart
                                                    </Select.Option>
                                                    <Select.Option value="line">Line Chart</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            }
                        >
                            <PaymentChannelCustomDiv>
                                {graph === "column" ? (
                                    <DualAxes style={{height: "400px"}} {...config} />
                                ) : (
                                    <Line style={{height: "400px"}} {...lineConfig} />
                                )}
                            </PaymentChannelCustomDiv>
                        </ReportCard>
                    </Col>
                </>
            </DashboardLayout>
        </CommonLayout>
    );
};

export default CategoryWiseSalesReportSummary;