import {
  DownOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Row,
  Select,
  Tooltip,
} from "antd";
import React from "react";
import styled from "styled-components";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import ResetBtn from "../lib/common/button/ResetBtn";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import { CustomPagination } from "../lib/common/CustomPaginationStyle";
import CustomSelect from "../lib/common/CustomSelect";
import { CustomTableSkeleton } from "../lib/common/CustomTableSkeleton";
import { CustomTable } from "../lib/common/CustomTableStyle";
import ExportToExcelButton, { ExportButton } from "../lib/common/ExportButton";
import { exportToExcel, exportToPDF } from "../lib/common/Helper";
import ReportCard from "../lib/common/ReportCard";
import { usePaginate } from "../lib/hooks/usePagination";
import useReports from "../lib/hooks/useReports";

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

const CategoryWiseSalesReport = () => {
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
    per_page,
    getSizeValue,
  } = usePaginate(
    "categoryWiseSalesReport",
    "customers/category-wise-item-sales-summery"
  );
  const customFilterOptions = {
    category_name: "",
  };

  const customColumns = [
    {
      title: "SL",
      dataIndex: "sl",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category",
      dataIndex: "parent_category_name",
      sorter: (a, b) =>
        a.parent_category_name.localeCompare(b.parent_category_name),
    },
    {
      title: "Sub Category",
      dataIndex: "category_name",
      sorter: (a, b) => a.category_name.localeCompare(b.category_name),
    },
    {
      title: "Item Name",
      dataIndex: "product_name",
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
    },
    {
      title: "Total Order Count",
      dataIndex: "order_details_count",
    },
    {
      title: "Total Sales Value",
      dataIndex: "total_price",
    },
    {
      title: "Total Cancel Order Count",
      dataIndex: "canceled_order_count",
    },
    {
      title: "Total Cancel Order Value",
      dataIndex: "canceled_grand_total",
    },
  ];

  const salesSummary = [];
  if (collection) {
    collection?.map((c) => {
      salesSummary.push({
        parent_category_name: c?.parent_category_name,
        category_name: c?.category_name,
        product_name: c?.product_name,
        order_details_count: c?.order_details_count,
        total_price: c?.total_price,
        canceled_order_count: c?.canceled_order_count,
        canceled_grand_total: c?.canceled_grand_total,
      });
    });
  }

  const customSalesSummaryData = salesSummary.map((data, index) => ({
    ...data,
    sl: index + 1,
  }));

  const propertyNames = ["category_name","product_name","parent_category_name"];

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
    customSalesSummaryData,
    customFilterOptions,
    customColumns,
    propertyNames
  );


  const flattenedData = filteredData?.map((summary) => ({
    SL: summary.sl,
    Category: summary.parent_category_name,
    "Sub Category": summary.category_name,
    "Item Name": summary.product_name,
    "Total Order Count": summary.order_details_count,
    "Total Sales Value": summary.total_price,
    "Total Cancel Order Count": summary.canceled_order_count,
    "Total Cancel Order Value": summary.canceled_grand_total,
  }));

  const customDate = Form.useWatch("created_at", form);
  return (
    <CommonLayout>
      <DashboardLayout>
        <>
          <ReportCard title="Filter" style={{ marginBottom: 10 }}>
            <Form form={form} onFinish={fetchData}>
              <Row gutter={[6, 6]}>
                <Col sm={24} md={6} xs={24}>
                  <Form.Item name={"category_name"}>
                    <CustomSelect
                        placeholder={"Category Name"}
                        allowClear
                    >
                      {
                        topCategoriesData?.map(({id, category_name}) =>
                            <Select.Option value={category_name} key={id}>{category_name}</Select.Option>)
                      }
                    </CustomSelect>
                  </Form.Item>
                </Col>
                <Col sm={24} md={6} xs={24}>
                  <Form.Item
                    name="created_at"
                    rules={[
                      {
                        required: false,
                        message: "Please input your date!",
                      },
                    ]}
                  >
                    <CustomSelect allowClear  placeholder="Select date">
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
                  </Form.Item>
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
                    <SubmitBtn htmlType="submit" style={{ marginRight: 8 }}>
                      Apply
                    </SubmitBtn>
                    <ResetBtn onClick={resetFilterForm}>Reset</ResetBtn>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </ReportCard>
          <ReportCard>
            <CustomDiv
              style={{
                justifyContent: "space-between",
                paddingTop: "10px",
                marginBottom:"-10px"
              }}
            >
              <CustomDiv
                style={{
                  justifyContent: "start",
                  marginBottom:"-10px"
                }}
              >
                <CustomDiv>
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
                </CustomDiv>
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
                    Visibility<DownOutlined />
                  </Button>
                </Dropdown>
                <ExportToExcelButton
                  data={flattenedData}
                  fileName="excel_sales_data"
                  size="small"
                ></ExportToExcelButton>
                <ExportButton onClick={() => exportToPDF(flattenedData, 'category_wise_sales_report','landscape','Category wise Sales Report')}>
                  <FilePdfFilled
                    style={{ fontSize: "16px", color: "#FF5733" }}
                  />
                </ExportButton>
              </CustomDiv>
            </CustomDiv>
            {filteredData?.length > 0 ? (
              <CustomTable
                dataSource={filteredData}
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

export default CategoryWiseSalesReport;
