import React from "react";
import {
  Input,
  Button,
  Dropdown,
  Form,
  Row,
  Col,
  Select,
  Tooltip,
  DatePicker,
} from "antd";
import { DownOutlined, FilePdfFilled } from "@ant-design/icons";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import ReportCard from "../lib/common/ReportCard";
import CustomSelect from "../lib/common/CustomSelect";
import useReports from "../lib/hooks/useReports";
import ExportToExcelButton, { ExportButton } from "../lib/common/ExportButton";
import { exportToPDF } from "../lib/common/Helper";
import { CustomPagination } from "../lib/common/CustomPaginationStyle";
import { CustomTable } from "../lib/common/CustomTableStyle";
import { CustomTableSkeleton } from "../lib/common/CustomTableSkeleton";
import { useState } from "react";
import { useMemo } from "react";
import { usePaginateLogistic } from "../lib/hooks/usePaginationLogistic";
import { CustomDateRangeChecker } from "../lib/common/CustomDateRangeChecker";
import styled from "styled-components";
import { logisticApiKey } from "../../services/ApiEndPointService";
import SubmitBtn from "../lib/common/button/SubmitBtn";

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

const ReportFormItem = styled(Form.Item)`
  margin-left: 10px;
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

const OutsideInsideDhaka = () => {
  const customColumns = [
    {
      title: "Order Date",
      dataIndex: "order_date",
      sorter: (a, b) => a?.order_date?.localeCompare(b?.order_date),
    },
    {
      title: "Order Id",
      dataIndex: "order_code",
      sorter: (a, b) => a?.order_code?.localeCompare(b?.order_code),
    },
    {
      title: "Package Id",
      dataIndex: "package_id",
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      sorter: (a, b) => a?.name?.localeCompare(b?.name),
    },
    {
      title: "Customer Phone",
      dataIndex: "phone",
      sorter: (a, b) => a?.phone?.localeCompare(b?.phone),
    },
    {
      title: "Customer Address",
      dataIndex: "address",
      sorter: (a, b) => a?.address?.localeCompare(b?.address),
    },
    {
      title: "Customer District",
      dataIndex: "zone_districts",
      sorter: (a, b) => a?.zone_districts?.localeCompare(b?.zone_districts),
    },
    {
      title: "Customer Area",
      dataIndex: "zone_upazilas",
      sorter: (a, b) => a?.zone_upazilas?.localeCompare(b?.zone_upazilas),
    },
    {
      title: "Collection Amount",
      dataIndex: "total",
    },
  ];

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
  } = usePaginateLogistic("insideOutsideDhaka", "crp-pickup-query-v2");

  const customInsideOutsideDhakaData = collection?.map((data, index) => ({
    ...data,
    package_id: data?.package_id,
    order_code: data?.order_code,
    order_date: data?.order_date,
    phone: data?.recipient?.phone,
    address: data?.recipient?.address,
    zone_districts: data?.recipient?.recipient,
    zone_upazilas: data?.recipient?.zone_upazilas,
    name: data?.recipient?.name,
    total: data?.recipient?.total,
  }));

  const customFilterOptions = {
    zone_districts: "",
    address: "",
  };
  const propertyNames = ["zone_districts", "address"];
  const {
    form: reportForm,
    handleDropdownClick,
    menu,
    handleSearchTable,
    filteredData,
    searchText,
    columns,
    visibleColumns,
  } = useReports(
    customInsideOutsideDhakaData,
    customFilterOptions,
    customColumns,
    propertyNames
  );

  const insideDhakaData = [];
  const outsideDhakaData = [];

  filteredData?.map((data) => {
    if (data?.is_inside_dhaka === 0) {
      outsideDhakaData?.push({
        package_id: data?.package_id,
        order_code: data?.order_code,
        order_date: data?.order_date,
        name: data?.recipient?.name,
        phone: data?.recipient?.phone,
        address: data?.recipient?.address,
        zone_districts: data?.recipient?.zone_districts,
        zone_upazilas: data?.recipient?.zone_upazilas,
        total: data?.collection_amount?.total,
      });
    } else if (data?.is_inside_dhaka === 1) {
      insideDhakaData?.push({
        package_id: data?.package_id,
        order_code: data?.order_code,
        order_date: data?.order_date,
        name: data?.recipient?.name,
        phone: data?.recipient?.phone,
        address: data?.recipient?.address,
        zone_districts: data?.recipient?.zone_districts,
        zone_upazilas: data?.recipient?.zone_upazilas,
        total: data?.collection_amount?.total,
      });
    }
  });

  console.log({ insideDhakaData });
  console.log({ outsideDhakaData });

  const [check, setCheck] = useState(false);

  const data = useMemo(() => {
    return check === "outside" ? outsideDhakaData : insideDhakaData;
  }, [check, outsideDhakaData, insideDhakaData]);

  const getInsideOutsideValue = (value) => {
    setCheck(value);
  };

  const customDate = Form.useWatch("created_at", form);

  const onFinish = async (values) => {
    const data = CustomDateRangeChecker(values);
    const params = {
      rows_per_page: 10,
      page_no: 1,
      api_key: logisticApiKey,
      ...data,
    };
    fetchData(params);
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
                  <Button onClick={resetFilterForm}>Reset</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </ReportCard>
        <ReportCard>
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
              <div>
                <Form form={reportForm}>
                  <FormItem name="size" initialValue="10" label={"Show"}>
                    <Select
                      size="small"
                      id="antSelect"
                      style={{ width: "100%", background: "#F8F9FA" }}
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
                  </FormItem>
                </Form>
              </div>
              <div>
                <Form>
                  <ReportFormItem>
                    <Input
                      size="small"
                      placeholder="Search..."
                      value={searchText}
                      onChange={(e) => handleSearchTable(e.target.value)}
                      style={{ background: "#F8F9FA" }}
                    />
                  </ReportFormItem>
                </Form>
              </div>
            </CustomDiv>
            <CustomDiv>
              <Form style={{ marginTop: "-4px" }}>
                <FormItem name="insideOutsideDhaka" initialValue="inside">
                  <Select
                    size="small"
                    id="antSelect"
                    style={{ width: "100%", background: "#F8F9FA" }}
                    onChange={(value) => {
                      getInsideOutsideValue(value);
                    }}
                  >
                    <Select.Option value="inside">Inside Dhaka </Select.Option>
                    <Select.Option value="outside">Outside Dhaka</Select.Option>
                  </Select>
                </FormItem>
              </Form>
              <Dropdown overlay={menu} onClick={handleDropdownClick}>
                <Button size="small">
                  Column Options <DownOutlined />
                </Button>
              </Dropdown>
              <ExportToExcelButton
                data={data}
                fileName={check ? "outside_dhaka" : "inside_dhaka"}
                size="small"
              ></ExportToExcelButton>
              <ExportButton
                onClick={() =>
                  exportToPDF(
                    data,
                    check ? "outside_dhaka" : "inside_dhaka",
                    "landscape",
                    check ? "Outside dhaka report" : "Inside dhaka report"
                  )
                }
              >
                <FilePdfFilled style={{ fontSize: "16px", color: "#FF5733" }} />
              </ExportButton>
            </CustomDiv>
          </CustomDiv>
          {collection?.length > 0 ? (
            <CustomTable
              pagination={false}
              bordered
              dataSource={data}
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
      </DashboardLayout>
    </CommonLayout>
  );
};

export default OutsideInsideDhaka;
