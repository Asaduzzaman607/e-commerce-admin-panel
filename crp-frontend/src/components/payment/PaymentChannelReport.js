import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Pagination,
  Row,
  Select,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import React from "react";
import {
  DownOutlined,
  FileExcelFilled,
  FilePdfFilled,
} from "@ant-design/icons";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import { CustomTable } from "../lib/common/CustomTableStyle";
import ExportToExcelButton, { ExportButton } from "../lib/common/ExportButton";
import {
  exportToExcel,
  exportToPDF,
  formatUnderLineText,
} from "../lib/common/Helper";
import ReportCard from "../lib/common/ReportCard";
import useReports from "../lib/hooks/useReports";
import { DualAxes, Line } from "@ant-design/plots";
import styled from "styled-components";
import { notifyResponseError } from "../lib/common/notifications";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import axios from "axios";
import ResetBtn from "../lib/common/button/ResetBtn";
import { useState } from "react";
import {
  paymentChannelApiKey,
  paymentChannelEndpoint,
} from "../../services/ApiEndPointService";
import { CustomDateRangeChecker } from "../lib/common/CustomDateRangeChecker";
import { CustomTableSkeleton } from "../lib/common/CustomTableSkeleton";

const PaymentChannelCustomCard = styled(Card)`
  border: 1px solid #d2dae5 !important;
  padding: 5px;
  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
  }
`;
const CustomDiv = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
     display: block
  }
`
const CustomTitleDiv = styled.div`
  font-size: 20px;
  margin-top: 8px;
  @media (max-width: 768px) {
    font-size: 15px;
  }
`
const PaymentChannelReport = () => {
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
      title: "Payment Channel",
      dataIndex: "paymentChannel",
      sorter: (a, b) => a.paymentChannel.localeCompare(b.paymentChannel),
    },
    {
      title: "GMV(BDT)",
      dataIndex: "gmv",
    },
    {
      title: "NMV(BDT)",
      dataIndex: "nmv",
      sorter: (a, b) => a.nmv.localeCompare(b.nmv),
    },
    {
      title: "GIS",
      dataIndex: "gis",
      sorter: (a, b) => a.gis.localeCompare(b.gis),
    },
    {
      title: "NIS",
      dataIndex: "nis",
      sorter: (a, b) => a.nis.localeCompare(b.nis),
    },
  ];

  const propertyNames = ["paymentChannel"];

  const [form] = Form.useForm();

  const [collection, setCollection] = useState([]);
  const customDate = Form.useWatch("created_at", form);

  const handleFinish = async (values) => {
    const data = CustomDateRangeChecker(values);
    const params = {
      api_key: paymentChannelApiKey,
      ...data,
    };
    try {
      const { data } = await axios.post(paymentChannelEndpoint, params, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCollection(data?.data);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const onReset = () => {
    form.resetFields();
    setCollection();
  };
  const modifiedData = collection?.map((item) => ({
    paymentChannel: formatUnderLineText(item.key),
    gmv: item?.values.GMV,
    nmv: item?.values.NMV,
    gis: item?.values.GIS,
    nis: item?.values.NIS,
  }));

  const paymentChannelData = modifiedData?.map((data, index) => ({
    sl: index + 1,
    ...data,
  }));

  const exportFormatData = paymentChannelData?.map((payment) => ({
    SL: payment?.sl,
    "Payment Channel": payment?.paymentChannel,
    GMV: payment?.gmv,
    NMV: payment?.nmv,
    GIS: payment?.gis,
    NIS: payment?.nis,
  }));

  const lineChartData = [];
  collection?.map((bar) => {
    lineChartData?.push({
      year: bar?.key,
      value: bar?.values.GMV,
      category: "GMV",
    });
    lineChartData?.push({
      year: bar?.key,
      value: bar?.values.NMV,
      category: "NMV",
    });
  });

  const barChartData = [];
  collection?.map((bar) => {
    barChartData?.push({
      time: bar?.key,
      value: bar?.values.GMV,
      type: "GMV",
    });
    barChartData?.push({
      time: bar?.key,
      value: bar?.values.NMV,
      type: "NMV",
    });
  });
  const {
    form: chartForm,
    handleDropdownClick,
    menu,
    columns,
    visibleColumns,
    data,
  } = useReports(
    paymentChannelData,
    customFilterOptions,
    customColumns,
    propertyNames
  );
  const graph = Form.useWatch("graph", chartForm) || "column";

  const transformData = [];
  const config = {
    data: [barChartData, transformData],
    xField: "time",
    yField: ["value"],
    geometryOptions: [
      {
        geometry: "column",
        isGroup: true,
        seriesField: "type",
        columnWidthRatio: 0.4,
        columnStyle: {
          radius: [5, 5, 0, 0],
        },
      },
    ],
    legend: {
      layout: "horizontal",
      position: "top-left",
      marker: { symbol: "square" },
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
  };

  return (
    <CommonLayout>
      <DashboardLayout>
        <>
          <ReportCard title="Filter" style={{ marginBottom: 10 }}>
            <Form form={form} onFinish={handleFinish}>
              <Row gutter={[6, 6]}>
                <Col sm={24} md={6} xs={24}>
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
                  <Col sm={24} md={6} xs={24}>
                    <Form.Item name="customDateRange">
                      <DatePicker.RangePicker />
                    </Form.Item>
                  </Col>
                )}
                <Col sm={24} md={6} xs={24}>
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
                <ExportToExcelButton
                  data={exportFormatData}
                  fileName="payment_channel_report"
                  size="small"
                ></ExportToExcelButton>
                <ExportButton
                  onClick={() =>
                    exportToPDF(
                      exportFormatData,
                      "Payment_channel",
                      "portrait",
                      "Payment Channel Report"
                    )
                  }
                >
                  <FilePdfFilled
                    style={{ fontSize: "16px", color: "#FF5733" }}
                  />
                </ExportButton>
              </div>
            </div>
            {paymentChannelData?.length > 0 ? (
              <CustomTable
                dataSource={paymentChannelData}
                columns={visibleColumns}
                pagination={false}
              />
            ) : (
              <CustomTableSkeleton />
            )}
          </ReportCard>
          <Col sm={24} xs={24} md={24} lg={24}>
            <ReportCard>
              <CustomDiv>
                <CustomTitleDiv>Payment Channel Data</CustomTitleDiv>
                <div>
                <Form
                  form={chartForm}
                  style={{ marginTop: "8px" }}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="graph" style={{ marginBottom:'7px' }}>
                        <Select style={{ width: 120 }} defaultValue="column" size="small">
                          <Select.Option value="column">
                            Bar Chart
                          </Select.Option>
                          <Select.Option value="line">Line Chart</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                </div>
              </CustomDiv>
              {paymentChannelData?.length > 0 ? (
                <PaymentChannelCustomCard>
                  {graph === "column" ? (
                    <DualAxes style={{ height: "200px" }} {...config} />
                  ) : (
                    <Line style={{ height: "200px" }} {...lineConfig} />
                  )}
                </PaymentChannelCustomCard>
              ) : (
                <CustomTableSkeleton />
              )}
            </ReportCard>
          </Col>
        </>
      </DashboardLayout>
    </CommonLayout>
  );
};

export default PaymentChannelReport;
