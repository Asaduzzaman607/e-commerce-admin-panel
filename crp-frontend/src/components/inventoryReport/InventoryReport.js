import React from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  Form,
  Row,
  Col,
  Card,
  Select,
} from "antd";
import {
  DownOutlined,
  FileExcelFilled,
  FilePdfFilled,
} from "@ant-design/icons";

import "jspdf-autotable";
import ReportCard from "../lib/common/ReportCard";
import { exportToExcel, exportToPDF } from "../lib/common/Helper";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import { ExportButton } from "../lib/common/ExportButton";
import useReports from "../lib/hooks/useReports";
import CustomSelect from "../lib/common/CustomSelect";

const InventoryReport = () => {
  const customFilterOptions = {
    name: "",
    age: "",
  };

  const customColumns = [
    {
      title: "Dummy",
      dataIndex: "dummy",
      sorter: (a, b) => a.dummy.localeCompare(b.dummy),
    },
    {
      title: "Dummy",
      dataIndex: "dummy",
    },
    {
      title: "Dummy",
      dataIndex: "dummy",
      sorter: (a, b) => a.dummy.localeCompare(b.dummy),
    },
    {
      title: "Dummy",
      dataIndex: "dummy",
      sorter: (a, b) => a.dummy.localeCompare(b.dummy),
    },
    {
      title: "Dummy",
      dataIndex: "dummy",
      sorter: (a, b) => a.dummy.localeCompare(b.dummy),
    },
    {
      title: "Dummy",
      dataIndex: "dummy",
      sorter: (a, b) => a.dummy.localeCompare(b.dummy),
    },
  ];

  const customSalesData = [
    { key: "1", dummy: "John Doe", dummy: 28, dummy: "53 Main St",dummy:"dummy",dummy:'dummy',dummy:'dummy' },
    { key: "1", dummy: "John Doe", dummy: 28, dummy: "53 Main St",dummy:"dummy",dummy:'dummy',dummy:'dummy' },
    { key: "1", dummy: "John Doe", dummy: 28, dummy: "53 Main St",dummy:"dummy",dummy:'dummy',dummy:'dummy' },
  ];

  const {
    filteredData,
    handleDropdownClick,
    handleSearchTable,
    applyFilters,
    resetFilters,
    menu,
    searchText,
    filterOptions,
    setFilterOptions,
    columns,
    visibleColumns,
    data,
  } = useReports(customSalesData, customFilterOptions, customColumns);

  return (
    <CommonLayout>
      <DashboardLayout>
        <ReportCard title="Filter" style={{ marginBottom: 10 }}>
          <Form>
            <Row gutter={[16, 16]}>
              <Col sm={20} md={5}>
                <Form.Item>
                  <CustomSelect style={{ width: "100%" }}>
                    <Select.Option>Dummy</Select.Option>
                  </CustomSelect>
                </Form.Item>
              </Col>
              <Col sm={20} md={5}>
                <Form.Item>
                  <CustomSelect style={{ width: "100%",background:'#FAFAFA' }}>
                    <Select.Option>Dummy</Select.Option>
                  </CustomSelect>
                </Form.Item>
              </Col>
              <Col sm={20} md={5}>
                <Form.Item>
                  <CustomSelect style={{ width: "100%" }}>
                    <Select.Option>Dummy</Select.Option>
                  </CustomSelect>
                </Form.Item>
              </Col>
              <Col sm={20} md={5}>
                <Form.Item>
                  <CustomSelect style={{ width: "100%" }}>
                    <Select.Option>Dummy</Select.Option>
                  </CustomSelect>
                </Form.Item>
              </Col>
              <Col sm={20} md={4}>
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={applyFilters}
                    style={{ marginRight: 8 }}
                  >
                    Apply
                  </Button>
                  <Button onClick={resetFilters}>Reset</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ReportCard>
        <ReportCard title="Summary" style={{ marginBottom: 8 }}>
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4].map((item) => (
              <Col span={6}>
                <Card
                  style={{
                    boxShadow:
                      "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                    background: "#F8F9FA",
                    borderRadius: "15px",
                    height: "100px",
                    color: "#000000",
                    border: "none",
                  }}
                >
                  <div style={{ padding: "15px" }}>
                    <span>Dummy</span>
                    <br />
                    <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                      127000
                    </span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </ReportCard>
        <ReportCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                paddingTop: "10px",
                marginRight: "5px",
              }}
            >
              <div>
                <Form layout="inline">
                  <Form.Item name="size" initialValue="10" label={"Show"}>
                    <Select
                      id="antSelect"
                      style={{ width: "100%", background: "#F8F9FA" }}
                    >
                      <Select.Option value="10">10 Entries </Select.Option>
                      <Select.Option value="20">20 Entries</Select.Option>
                      <Select.Option value="30">30 Entries</Select.Option>
                      <Select.Option value="40">40 Entries</Select.Option>
                      <Select.Option value="50">50 Entries</Select.Option>
                    </Select>
                  </Form.Item>
                </Form>
              </div>
              <div>
                <Form.Item>
                  <Input
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
                <Button>
                  Column Options <DownOutlined />
                </Button>
              </Dropdown>
              <ExportButton onClick={() => exportToExcel(columns, data)}>
                Export to Excel
                <FileExcelFilled
                  style={{ fontSize: "16px", color: "#107C41" }}
                />
              </ExportButton>
              <ExportButton onClick={() => exportToPDF(columns, data)}>
                Export to PDF
                <FilePdfFilled style={{ fontSize: "16px", color: "#FF5733" }} />
              </ExportButton>
            </div>
          </div>
          <Table dataSource={filteredData} columns={visibleColumns} />
        </ReportCard>
      </DashboardLayout>
    </CommonLayout>
  );
};
export default InventoryReport;
