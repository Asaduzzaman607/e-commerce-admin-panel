import {usePaginate} from "../lib/hooks/usePagination";
import useReports from "../lib/hooks/useReports";
import {exportToPDF, formatMoney} from "../lib/common/Helper";
import {Button, Col, DatePicker, Dropdown, Form, Input, Row, Select, Tooltip} from "antd";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import ReportCard from "../lib/common/ReportCard";
import CustomInput from "../lib/common/CustomInput";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import ResetBtn from "../lib/common/button/ResetBtn";
import {DownOutlined, FilePdfFilled} from "@ant-design/icons";
import ExportToExcelButton, {ExportButton} from "../lib/common/ExportButton";
import {CustomTable} from "../lib/common/CustomTableStyle";
import {CustomTableSkeleton} from "../lib/common/CustomTableSkeleton";
import {CustomPagination} from "../lib/common/CustomPaginationStyle";
import React from "react";

const SellerWiseSalesReport = () => {
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
        "sellerWiseSalesReport",
        "customers/seller-wise-sales-report"
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
            title: "Seller Name",
            dataIndex: "seller_name",
            key: 'seller_name',
        },
        {
            title: "Order Count",
            dataIndex: "periodic_sales",
            key: 'periodic_sales',
        },
        {
            title: "Periodic GMV BDT",
            dataIndex: "periodic_gmv_bdt",
            key: 'periodic_gmv_bdt',
        }
    ];



    const customCategoryWiseSalesData = collection?.map((data, index) => ({
        ...data,
        sl: index + 1,
    }));

    const propertyNames = [
        "seller_name",
        "periodic_gmv_bdt",
        "periodic_sales",
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
    } = useReports(
        customCategoryWiseSalesData,
        customFilterOptions,
        customColumns,
        propertyNames
    );


    const modifiedData = filteredData?.map(item => ({
        ...item,
        periodic_gmv_bdt: formatMoney(item?.periodic_gmv_bdt),
    }));

    const flattenedData = modifiedData?.map(item => ({
        'Seller Name': item?.seller_name,
        'Order Count': item?.periodic_sales,
        'Periodic GMV BDT': item?.periodic_gmv_bdt,
    }))



    const customDate = Form.useWatch("created_at", form);
    return (
        <CommonLayout>
            <DashboardLayout>
                <>
                    <ReportCard title="Filter" style={{ marginBottom: 10 }}>
                        <Form form={form} onFinish={fetchData}>
                            <Row gutter={[6, 6]}>
                                <Col sm={20} md={4} xs={20}>
                                    <Form.Item name={"seller_name"}>
                                        <CustomInput placeholder={"Seller Name"} />
                                    </Form.Item>
                                </Col>
                                <Col sm={20} md={6} xs={20}>
                                    <Form.Item
                                        label={"Date Range"}
                                        placeholder="Select date"
                                        name="created_at"
                                        rules={[
                                            {
                                                required: true,
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
                                marginBottom:"-10px"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "start",
                                    marginBottom:"-10px"
                                }}
                            >
                                <div>
                                    <Form form={reportForm} layout="inline" >
                                        <Form.Item  name="size" initialValue="10" label={"Show"}>
                                            <Select
                                                id="antSelect"
                                                style={{ width: "100%", background: "#F8F9FA" }}
                                                size={"small"}
                                            >
                                                <Select.Option value="10">10 Entries </Select.Option>
                                                <Select.Option value="20">20 Entries</Select.Option>
                                                <Select.Option value="50">50 Entries</Select.Option>
                                                <Select.Option value="100">100 Entries</Select.Option>
                                                <Select.Option value="300">200 Entries</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Form>
                                </div>
                                <div>
                                    <Form.Item>
                                        <Input
                                            size={"small"}
                                            placeholder="Search..."
                                            value={searchText}
                                            onChange={(e) => handleSearchTable(e.target.value)}
                                            style={{ background: "#F8F9FA" }}
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
                                <ExportButton size={"small"} onClick={() => exportToPDF( flattenedData, 'category_wise_sales_data.pdf','portrait','Seller Wise Sales Report')}>

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
                            <CustomTableSkeleton />
                        )}
                        <CustomPagination
                            current={page}
                            pageSize={per_page}
                            total={total_data}
                            onChange={paginate}
                            showSizeChanger={false}
                        />
                    </ReportCard>
                </>
            </DashboardLayout>
        </CommonLayout>
    );
};

export default SellerWiseSalesReport;