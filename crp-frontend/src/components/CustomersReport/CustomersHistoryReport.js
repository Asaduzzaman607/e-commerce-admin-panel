import styled from "styled-components";
import {
    Button,
    Calendar,
    Card,
    Col,
    DatePicker,
    Dropdown,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Table,
    Tooltip
} from "antd";
import useReports from "../lib/hooks/useReports";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import ReportCard from "../lib/common/ReportCard";
import {
    DownOutlined,
    FileExcelFilled,
    FilePdfFilled,
} from "@ant-design/icons";
import {ExportButton} from "../lib/common/ExportButton";
import {exportToExcel, exportToPDF, formatUnderLineText} from "../lib/common/Helper";
import React, {useEffect} from "react";
import {usePaginate} from "../lib/hooks/usePagination";
import CustomInput from "../lib/common/CustomInput";
import {CustomPagination} from "../lib/common/CustomPaginationStyle";
import moment from "moment";
import CRPButton from "../lib/common/button/CRPButton";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import ResetBtn from "../lib/common/button/ResetBtn";
import {useCity} from "../lib/hooks/useCity";
import {retry} from "@reduxjs/toolkit/query";
import {CustomTableSkeleton} from "../lib/common/CustomTableSkeleton";
import {SummaryCard} from "../lib/common/SummaryCard";

export const CustomTable = styled(Table)`
  .ant-table {
    width: 100%;
    overflow-x: auto;
  }

  .anticon-search svg {
    display: none;
  }

  .ant-table {
    border: 1px solid #d2dae5;
  }

  .ant-table-thead > tr > th {
    background-color: #e8e8e8;
    height: 20%;
  }

  .ant-pagination .ant-pagination-item-active a {
    color: black !important;
  }

  .ant-pagination-item {
    background-color: #ffffff !important;
    color: black !important;
    border: 1px solid #f1f1f1 !important;
  }

  .ant-pagination-item-active {
    background-color: #ffc900 !important;
    color: black !important;
    border-color: transparent !important;
  }
`;

const CustomersHistoryReport = () => {

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
        summary
    } = usePaginate('customersHistoryReport', 'customers-order-history');

    const customFilterOptions = {
        name: "",
        city: "",
    };

    const customColumns = [
        {
            title: "SL",
            dataIndex: "sl",
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a?.name.localeCompare(b.name),
        },
        {
            title: 'City',
            dataIndex: 'states_name',
            key: 'states_name',
        },
        {
            title: 'Total Order',
            dataIndex: 'total_order',
            key: 'total_order',
        },

    ];


    const propertyNames = ["name", 'states_name', 'total_order'];

    const customHistoryData = collection?.map((data, index) => ({
        ...data,
        sl: index + 1,
    }));

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
        pagination
    } = useReports(customHistoryData, customFilterOptions, customColumns, propertyNames);

    const customDate = Form.useWatch("created_at", form);

    const {city, initCity} = useCity();

    useEffect(() => {
        (async () => {
            await initCity();
        })();
    }, []);

    const summaryData = summary || {}


    return (
        <CommonLayout>
            <DashboardLayout>
                <>
                    <ReportCard title="Filter" style={{marginBottom: 10}}>
                        <Form form={form} onFinish={fetchData}>
                            <Row gutter={[5, 5]}>
                                <Col sm={20} md={4} xs={20}>
                                    <Form.Item name={"name"}>
                                        <CustomInput placeholder={'Name'}/>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item name={'total_order'}>
                                        <InputNumber min={0} placeholder={'Orders'}/>
                                    </Form.Item>
                                </Col>
                                <Col sm={20} md={4} xs={20}>
                                    <Form.Item name={'states_name'}>
                                        <Select
                                            placeholder={"City"}
                                            allowClear
                                        >
                                            {
                                                city?.map(({id, name}) =>
                                                    <Select.Option value={name} key={id}>{name}</Select.Option>)
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col sm={20} md={6} xs={20}>
                                    <Form.Item label={'Date Range'} placeholder="Select Option" name="created_at"
                                               rules={[
                                                   {
                                                       required: true,
                                                       message: 'Please input your date!',
                                                   },
                                               ]}>
                                        <Select allowClear>
                                            <Select.Option value="today">Today</Select.Option>
                                            <Select.Option value="last">Yesterday</Select.Option>
                                            <Select.Option value="lastWeek">Last Week</Select.Option>
                                            <Select.Option value="lastMonth">Last Month</Select.Option>
                                            <Select.Option value="custom">
                                                <Tooltip title="Please select max 1 month for better performance">
                                                    Custom Date Range
                                                </Tooltip>
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                {customDate === 'custom' && (
                                    <Col sm={20} md={6} xs={20}>
                                        <Form.Item name="customDateRange">
                                            <DatePicker.RangePicker/>
                                        </Form.Item>

                                    </Col>
                                )}
                                <Col>
                                    <Form.Item>
                                        <SubmitBtn
                                            htmlType="submit"
                                            style={{marginRight: 8}}
                                        >
                                            Apply
                                        </SubmitBtn>
                                        <ResetBtn onClick={resetFilterForm}>Reset</ResetBtn>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </ReportCard>
                    <ReportCard title="Summary" style={{marginBottom: 8}}>
                        <Row gutter={[16, 16]}>
                            {Object?.entries(summaryData)?.map(([key, value], index) => {

                                return (
                                    (
                                        <Col sm={24} xs={24} md={6} lg={6} key={index}>
                                            <SummaryCard>
                                                <div style={{textAlign:'center'}}>
                                                    <span style={{fontWeight: "bold", fontSize: "16px"}}>{formatUnderLineText(key)}</span>
                                                    <br/>
                                                    <span >
                                                        {value}
                                                    </span>
                                                </div>
                                            </SummaryCard>
                                        </Col>
                                    )
                                )
                            })}
                        </Row>
                    </ReportCard>
                    <ReportCard>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "start",
                                }}
                            >

                                    <Form form={sizeForm} layout="inline" size={"small"}>
                                        <Form.Item name="size" initialValue="10" label={"Show"}>
                                            <Select
                                                size={"small"}
                                                id="antSelect"
                                                style={{width: "100%", background: "#F8F9FA"}}
                                                onChange={(value) => {
                                                    getSizeValue(value);
                                                }}
                                            >
                                                <Select.Option value="10">10 Entries </Select.Option>
                                                <Select.Option value="20">20 Entries</Select.Option>
                                                <Select.Option value="30">30 Entries</Select.Option>
                                                <Select.Option value="50">50 Entries</Select.Option>
                                                <Select.Option value="100">100 Entries</Select.Option>
                                            </Select>
                                        </Form.Item>


                                    <Form.Item size={"small"}>
                                        <Input
                                            size={"small"}
                                            placeholder="Search..."
                                            value={searchText}
                                            onChange={(e) => handleSearchTable(e.target.value)}
                                            style={{background: "#F8F9FA"}}
                                        />
                                    </Form.Item>
                                    </Form>
                            </div>
                            <div>
                                <Dropdown overlay={menu} onClick={handleDropdownClick}>
                                    <Button size={"small"}>
                                        Visibility <DownOutlined/>
                                    </Button>
                                </Dropdown>
                                <ExportButton size={"small"} onClick={() => exportToExcel(columns, data)}>

                                    <FileExcelFilled
                                        style={{fontSize: "16px", color: "#107C41"}}
                                    />
                                </ExportButton>
                                <ExportButton size={"small"} onClick={() => exportToPDF( data,'Customer_history','landscape','Customer History Report')}>

                                    <FilePdfFilled
                                        style={{fontSize: "16px", color: "#FF5733"}}
                                    />
                                </ExportButton>
                            </div>
                        </div>
                        {filteredData ?
                            <CustomTable
                                dataSource={filteredData}
                                columns={visibleColumns}
                                pagination={false}
                                bordered
                            /> : <CustomTableSkeleton/>}
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
export default CustomersHistoryReport;
