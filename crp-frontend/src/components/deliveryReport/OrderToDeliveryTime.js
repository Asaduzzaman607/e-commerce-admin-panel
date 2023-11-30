import React from "react";
import {
  Input,
  Button,
  Dropdown,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
  Tooltip,
} from "antd";
import { DownOutlined, FilePdfFilled } from "@ant-design/icons";
import "jspdf-autotable";
import ReportCard from "../lib/common/ReportCard";
import { exportToPDF } from "../lib/common/Helper";
import ExportToExcelButton from "../lib/common/ExportButton";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import { ExportButton } from "../lib/common/ExportButton";
import useReports, { LOGISTICS_PAYMENT_TYPES } from "../lib/hooks/useReports";
import CustomSelect from "../lib/common/CustomSelect";
import { CustomTable } from "../lib/common/CustomTableStyle";
import { CustomPagination } from "../lib/common/CustomPaginationStyle";
import { CustomTableSkeleton } from "../lib/common/CustomTableSkeleton";
import { usePaginateLogistic } from "../lib/hooks/usePaginationLogistic";
import { useEffect } from "react";

import { useCity } from "../lib/hooks/useCity";
import { CustomDateRangeChecker } from "../lib/common/CustomDateRangeChecker";
import styled from "styled-components";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import { logisticApiKey } from "../../services/ApiEndPointService";

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
  @media (max-width: 768px) {
    .ant-form-item-label {
      height: 40px;
    }
    &&.ant-form-item {
      margin-bottom: 7.5px !important;
    }
  }
`;
const ReportFormItem = styled(Form.Item)`
  width: 100%;
  @media (max-width: 768px) {
    margin-left: 0px;
    width: 100%;
    .ant-form-item-label {
      height: 40px;
    }
    &&.ant-form-item {
      margin-bottom: 7.5px !important;
    }
  }
`;

const OrderToDeliveryTime = () => {
  const customFilterOptions = {
    city_name: "",
    customer_address: "",
  };
  const {
    form,
    fetchData,
    collection,
    page,
    total_data,
    paginate,
    resetFilter: resetFilterForm,
    per_page,
    getSizeValue,
  } = usePaginateLogistic("orderToDeliveryTime", "crp-pickup-query-v2");

  const customColumns = [
    {
      title: "SL",
      dataIndex: "sl",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Order Date",
      dataIndex: "order_date",
      sorter: (a, b) => a.order_date.localeCompare(b.order_date),
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
    },
    {
      title: "Delivered Order Item",
      dataIndex: "order_item",
      sorter: (a, b) => a.order_item.localeCompare(b.order_item),
    },
    {
      title: "Last Category L4",
      dataIndex: "last_category",
      sorter: (a, b) => a.last_category.localeCompare(b.last_category),
    },
    {
      title: "Customer Address",
      dataIndex: "customer_address",
      sorter: (a, b) => a.customer_address.localeCompare(b.customer_address),
    },
    {
      title: "City Name",
      dataIndex: "city_name",
      sorter: (a, b) => a.city_name.localeCompare(b.city_name),
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      sorter: (a, b) => a.payment_method.localeCompare(b.payment_method),
    },
    {
      title: "Status Update Time",
      dataIndex: "status_update_time",
    },
    {
      title: "Required Delivered Time",
      dataIndex: "delivery_time",
    },
  ];

  const orderToDeliveredTimeData = collection?.map((data, index) => ({
    ...data,
    sl: index + 1,
  }));

  const propertyNames = [
    "order_item",
    "last_category",
    "customer_address",
    "city_name",
  ];

  const {
    form: reportForm,
    handleDropdownClick,
    applyFilters,
    menu,
    handleSearchTable,
    filteredData,
    searchText,
    visibleColumns,
  } = useReports(
    orderToDeliveredTimeData,
    customFilterOptions,
    customColumns,
    propertyNames
  );
  const customDate = Form.useWatch("created_at", form);

  const { city, initCity } = useCity();

  useEffect(() => {
    (async () => {
      await initCity();
    })();
  }, []);

  const modifiedData = filteredData.map((order) => ({
    "Order Date": order?.order_date,
    "Order Id": order?.order_id,
    "Order Item": order?.order_item,
    "Last Category": order?.last_category,
    "Customer Address": order?.customer_address,
    "City Name": order?.city_name,
    "Payment Method": order?.payment_method,
    "Status Update Time": order?.status_update_time,
    "Delivery Time": order?.delivery_time,
  }));

  const onFinish = async (values) => {
    const data = CustomDateRangeChecker(values);
    const params = {
      rows_per_page: 10,
      page_no: 1,
      i_payment_method: values?.payment_type,
      recipient_district_id: values?.city_id,
      api_key: logisticApiKey,
      ...data,
    };
    fetchData(params);
  };

  return (
    <CommonLayout>
      <DashboardLayout>
        <>
          <ReportCard title="Filter" style={{ marginBottom: 10 }}>
            <Form form={form} onFinish={onFinish}>
              <Row gutter={[10, 10]}>
                <Col sm={24} xs={24} md={5}>
                  <FormItem
                    name="created_at"
                    rules={[
                      {
                        required: false,
                        message: "Please input your date!",
                      },
                    ]}
                  >
                    <CustomSelect allowClear placeholder="Select Date Range">
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
                    </CustomSelect>
                  </FormItem>
                </Col>
                {customDate === "custom" && (
                  <Col sm={24} md={5} xs={24}>
                    <FormItem name="customDateRange">
                      <DatePicker.RangePicker />
                    </FormItem>
                  </Col>
                )}
                <Col sm={24} md={5} xs={24}>
                  <FormItem name="city_id">
                    <CustomSelect
                      style={{ width: "100%" }}
                      placeholder="Select District"
                    >
                      {city?.map((city, index) => (
                        <Select.Option value={city?.id} key={index}>
                          {city?.name}
                        </Select.Option>
                      ))}
                    </CustomSelect>
                  </FormItem>
                </Col>
                <Col sm={24} md={5} xs={24}>
                  <FormItem name="payment_type">
                    <CustomSelect
                      style={{ width: "100%", background: "#FAFAFA" }}
                      placeholder=" Select Payment Method"
                    >
                      {LOGISTICS_PAYMENT_TYPES?.map((payment, index) => (
                        <Select.Option value={payment?.value} key={index}>
                          {payment?.name}
                        </Select.Option>
                      ))}
                    </CustomSelect>
                  </FormItem>
                </Col>
                <Col sm={24} md={6} xs={24} style={{ display: "flex" }}>
                  <SubmitBtn
                    htmlType="submit"
                    onClick={applyFilters}
                    style={{ marginRight: 8 }}
                  >
                    Apply
                  </SubmitBtn>
                  <Button onClick={resetFilterForm}>Reset</Button>
                </Col>
              </Row>
            </Form>
          </ReportCard>
          <ReportCard>
            <CustomDiv
              style={{
                justifyContent: "space-between",
                paddingTop: "10px",
                marginBottom: "-10px",
              }}
            >
              <CustomDiv
                style={{
                  justifyContent: "start",
                  marginBottom: "-10px",
                }}
              >
                <CustomDiv>
                  <ReportFormItem>
                    <Input
                      size="small"
                      placeholder="Search..."
                      value={searchText}
                      onChange={(e) => handleSearchTable(e.target.value)}
                      style={{ background: "#F8F9FA" }}
                    />
                  </ReportFormItem>
                </CustomDiv>
              </CustomDiv>
              <CustomDiv>
                <Dropdown overlay={menu} onClick={handleDropdownClick}>
                  <Button size="small">
                    Column Options <DownOutlined />
                  </Button>
                </Dropdown>
                <ExportToExcelButton
                  data={modifiedData}
                  fileName="Order_to_delivery_time"
                  size="small"
                ></ExportToExcelButton>
                <ExportButton
                  onClick={() =>
                    exportToPDF(
                      modifiedData,
                      "order_to_delivery_time",
                      "landscape",
                      "Order to delivery time report"
                    )
                  }
                >
                  <FilePdfFilled
                    style={{ fontSize: "16px", color: "#FF5733" }}
                  />
                </ExportButton>
              </CustomDiv>
            </CustomDiv>
            {filteredData?.length > 0 ? (
              <CustomTable
                pagination={false}
                bordered
                dataSource={filteredData}
                columns={visibleColumns}
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
export default OrderToDeliveryTime;
