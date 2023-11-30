import React from 'react';
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import ReportCard from "../lib/common/ReportCard";
import {Button, Col, DatePicker, Dropdown, Form, Input, Row, Select, Tooltip} from "antd";
import CustomInput from "../lib/common/CustomInput";
import {DownOutlined, FileExcelFilled, FilePdfFilled, SmallDashOutlined} from "@ant-design/icons";
import ExportToExcelButton, {ExportButton} from "../lib/common/ExportButton";
import { exportToPDF, formatMoney, formatUnderLineText} from "../lib/common/Helper";
import {CustomPagination} from "../lib/common/CustomPaginationStyle";
import {CustomTable} from "../CustomersReport/CustomersHistoryReport";
import {usePaginate} from "../lib/hooks/usePagination";
import useReports, {DELIVERY_OPTIONS, PAYMENT_TYPES} from "../lib/hooks/useReports";
import moment from "moment/moment";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import ResetBtn from "../lib/common/button/ResetBtn";
import {CustomTableSkeleton} from "../lib/common/CustomTableSkeleton";
import {SummaryCard} from '../lib/common/SummaryCard';


const SalesReport = () => {

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
    } = usePaginate('salesReport', 'customers/recent-orders');

    const customDate = Form.useWatch("created_at", form);

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
            title: 'Order Date',
            width: 150,
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => (moment(text).format('YYYY-MMM-DD hh:mm'))
            // sorter: (a, b) => a.created_at.localeCompare(b.created_at),
        },
        {
            title: 'Order Code',
            dataIndex: 'code',
            key: 'code',
            render: (text, record) => (record.code ? record.code : ''),
            sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: 'Shop Name',
            dataIndex: ['shop', 'name'],
            key: 'shop_name',
            render: (text, record) => (record ? record?.shop?.name + `(${record?.seller_id})` : ''),
        },
        // {
        //     title: 'Customer Details',
        //     // children: [
        //     //     {
        //     //         title: "Name",
        //     //         dataIndex: 'name',
        //     //         key: 'customer_name',
        //     //         render: (text, record) => (record?.user_info ? record?.user_info?.name : ''),
        //     //         sorter: (a, b) => a.user_info?.name.localeCompare(b.user_info?.name),
        //     //         sortDirections: ['ascend', 'descend'],
        //     //     },
        //     //     {
        //     //         title: "Phone" ,
        //     //         dataIndex: 'phone',
        //     //         key: 'phone',
        //     //         render: (text, record) => (record.user_info ? record.user_info.phone : ''),
        //     //     }
        //     // ],
        //
        //     children: [
        //         {
        //             title: 'Name',
        //             dataIndex: ['user_info', 'name'], // Access the nested 'name' property
        //             key: 'customer_name',
        //             render: (text, record) => (record.user_info ? record.user_info.name : ''),
        //             sorter: (a, b) => a.user_info?.name.localeCompare(b.user_info?.name),
        //             sortDirections: ['ascend', 'descend'],
        //         },
        //         {
        //             title: 'Phone',
        //             dataIndex: ['user_info', 'phone'], // Access the nested 'phone' property
        //             key: 'phone',
        //             render: (text, record) => (record.user_info ? record.user_info.phone : ''),
        //         },
        //     ],
        // },

        {
            title: 'Customer Name',
            dataIndex: ['user_info', 'name'],
            key: 'customer_name',
            render: (text, record) => (record?.user_info ? record?.user_info?.name : ''),
            sorter: (a, b) => a.user_info?.name.localeCompare(b.user_info?.name),
            sortDirections: ['ascend', 'descend'],
        },

        {
            title: " Customer's Phone No",
            dataIndex: ['user_info', 'phone'],
            key: 'phone',
            render: (text, record) => (record.user_info ? record.user_info.phone : ''),
        },
        {
            title: 'Grand Total',
            dataIndex: 'grand_total',
            render: (text, record) => (
                record.grand_total ? formatMoney(record.grand_total) : ''
            ),
            key: 'grand_total',
        },
        {
            title: 'Payment Method',
            dataIndex: 'payment_type',
            key: 'payment_type',
        },
        {
            title: 'Payment Status',
            dataIndex: 'payment_status',
            key: 'payment_status',
        },
        {
            title: 'Delivery Status',
            dataIndex: 'delivery_status',
            key: 'delivery_status',
        }
    ];


    const propertyNames = ['created_at', 'code', 'user_info.name', 'shop.name', "payment_type", "payment_status", 'delivery_status'];

    const customSalesData = collection?.map((data, index) => ({
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
        pagination,
        PAYMENT_OPTIONS
    } = useReports(customSalesData, customFilterOptions, customColumns, propertyNames);


    const modifiedData = filteredData?.map(item => ({
        ...item,
        payment_type: item?.payment_type === "bkash" ? "bKash" : formatUnderLineText(item?.payment_type),
        grand_total: formatMoney(item?.grand_total),
        created_at: item.created_at ? moment(item.created_at).format('YYYY-MMM-DD hh:mm') : '',
        delivery_status: formatUnderLineText(item.delivery_status),
        payment_status: formatUnderLineText(item.payment_status),
    }));
    console.log({modifiedData})
    const order_summary = [];
    const delivery_summary = summary?.delivery_summary || {};
    const payment_summary = summary?.payment_summary || {};
    order_summary.push(summary?.order_summary);


    const flattenedData = modifiedData?.map(item => ({
        'sl': item?.sl,
        'Code': item?.code,
        'Order Date': item?.created_at,
        'Seller Id': item?.seller_id,
        'Shop Name': item.shop?.name,
        'User Name': item.user_info?.name,
        'User Phone': item.user_info?.phone,
        'Grand Total': item?.grand_total,
        'Payment Method': item?.payment_type,
        'Payment Status': item?.payment_status,
        'Delivery Status': item?.delivery_status,

    }));

    console.log(flattenedData);

    return (
        <CommonLayout>
            <DashboardLayout>
                <>
                    <ReportCard title="Filter" style={{marginBottom: 10}}>
                        <Form form={form} onFinish={fetchData}>
                            <Row gutter={[6, 6]}>
                                <Col sm={20} md={4} xs={20}>
                                    <Form.Item name={"code"}>
                                        <CustomInput placeholder={'Order Code'}/>
                                    </Form.Item>
                                </Col>
                                <Col sm={20} md={4} xs={20}>
                                    <Form.Item name={"shop"}>
                                        <CustomInput placeholder={'Shop Name'}/>
                                    </Form.Item>
                                </Col>
                                <Col sm={20} md={4} xs={20}>
                                    <Form.Item name={"payment_status"}>
                                        <Select
                                            placeholder={"Payment Status"}
                                            allowClear
                                        >
                                            {
                                                PAYMENT_OPTIONS?.map(({id, name, value}) =>
                                                    <Select.Option value={value} key={id}>{name}</Select.Option>)
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col sm={20} md={4} xs={20}>
                                    <Form.Item name={'payment_type'}>
                                        <Select
                                            placeholder={"Payment Type"}
                                            allowClear
                                        >
                                            {
                                                PAYMENT_TYPES?.map(({id, name, value}) =>
                                                    <Select.Option value={value} key={id}>{name}</Select.Option>)
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col sm={20} md={4} xs={20}>
                                    <Form.Item name={'delivery_status'}>
                                        <Select
                                            placeholder={"Delivery Status"}
                                            allowClear
                                        >
                                            {
                                                DELIVERY_OPTIONS?.map(({id, name, value}) =>
                                                    <Select.Option value={value} key={id}>{name}</Select.Option>)
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col sm={20} md={6} xs={20}>
                                    <Form.Item label={'Date Range'} placeholder="Select date" name="created_at"
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
                                                <Tooltip
                                                    title="Please select max 1 month for better performance">
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
                                <Col sm={20} md={6} xs={20}>
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
                    <ReportCard title="Order Summary" style={{marginBottom: 8}}>
                        <Row gutter={[16, 16]}>
                            {
                                order_summary && order_summary?.map((o, index) => (
                                    <Col sm={24} xs={24} md={6} lg={6} key={index}>
                                        <SummaryCard
                                        >
                                            <p style={{textAlign: 'center'}}>Total Count: {o?.count}</p>
                                            <p style={{textAlign: 'center'}}>Total
                                                Value: {formatMoney(Math.floor(o?.value))}</p>
                                        </SummaryCard>
                                    </Col>
                                ))
                            }
                        </Row>
                    </ReportCard>
                    <ReportCard title="Delivery Summary" style={{marginBottom: 8}}>
                        <Row gutter={[16, 16]}>
                            {
                                delivery_summary && Object?.keys(delivery_summary)?.map(d => (
                                    <Col sm={24} xs={24} md={6} lg={6} key={d}>
                                        <SummaryCard
                                        >
                                            <p style={{
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                fontSize: '14px',
                                                marginTop: '6px'
                                            }}>{formatUnderLineText(d)}</p>
                                            <p style={{textAlign: 'center', marginTop: '7px'}}>Total
                                                Count: {delivery_summary[d]?.count}</p>
                                            <p style={{textAlign: 'center'}}>Total
                                                Value: {formatMoney(Math.floor(delivery_summary[d]?.value))}</p>
                                        </SummaryCard>
                                    </Col>
                                ))
                            }
                        </Row>
                    </ReportCard>
                    <ReportCard title="Payment Summary" style={{marginBottom: 8}}>
                        <Row gutter={[16, 16]}>
                            {
                                payment_summary && Object?.keys(payment_summary)?.map(p => (
                                    <Col sm={24} xs={24} md={6} lg={6} key={p}>
                                        <SummaryCard
                                        >
                                            {
                                                p === 'bkash' ? <p style={{
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                        fontSize: '14px',
                                                        marginTop: '6px'
                                                    }}>
                                                        {p?.charAt(0)?.toLowerCase() + (p?.charAt(1) || '').toUpperCase() + p?.slice(2)?.replace(/_/g, ' ')}
                                                    </p>
                                                    :
                                                    <p style={{
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                        fontSize: '14px',
                                                        marginTop: '6px'
                                                    }}>{formatUnderLineText(p)}</p>
                                            }
                                            <p style={{textAlign: 'center', marginTop: '7px'}}>Total
                                                Count: {payment_summary[p]?.count}</p>
                                            <p style={{textAlign: 'center'}}>Total
                                                Value: {formatMoney(Math.floor(payment_summary[p]?.value))}</p>
                                        </SummaryCard>
                                    </Col>
                                ))
                            }
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
                                            <Select.Option value="50">50 Entries</Select.Option>
                                            <Select.Option value="100">100 Entries</Select.Option>
                                            <Select.Option value="200">200 Entries</Select.Option>
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
                                <ExportToExcelButton
                                    data={flattenedData}
                                    fileName="excel_sales_data"
                                    size="small"
                                >

                                </ExportToExcelButton>
                                <ExportButton size={"small"} onClick={() => exportToPDF( flattenedData, 'sales_data.pdf','landscape','Sales Report')}>

                                    <FilePdfFilled
                                        style={{fontSize: "16px", color: "#FF5733"}}
                                    />
                                </ExportButton>
                            </div>
                        </div>
                        {modifiedData ?
                            <CustomTable
                                dataSource={modifiedData}
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

export default SalesReport;