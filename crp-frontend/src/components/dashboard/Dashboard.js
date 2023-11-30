import {Card, Col, Form, Row, Select, Table} from "antd";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import ReportCard from "../lib/common/ReportCard";
import {Column, DualAxes, Line, Pie} from "@ant-design/plots";
import lineChart from "../../assets/images/lineChart.PNG";
import singleLineChart1 from "../../assets/images/single.svg";
import pieChart1 from "../../assets/images/pi.svg";
import barChart1 from "../../assets/images/bar.svg";
import increase from "../../assets/images/increase.png";
import decrease from "../../assets/images/decrease.png";
import {RightOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import styled from "styled-components";
import useDashboard from "../lib/hooks/useDashboard";
import {formatMoneyInMillion, formatUnderLineText} from "../lib/common/Helper";
import Loading from "../lib/common/Loading";
import useTrackApiData from "../lib/hooks/useTrackApiData";
import React from "react";


const CustomTable = styled(Table)`
  .ant-table {
    width: 100%;
    overflow-x: auto;
    border: 1px solid #d2dae5;
  }

  .ant-table-thead > tr > th {
    background-color: #e8e8e8;
    height: 15% !important;
  }

  .ant-table-thead > tr > td {
    background-color: #e8e8e8;
    height: 15% !important;
  }
`;
export default function Dashboard() {
    const {
        form,
        columns,
        colConfig,
        barConfig,
        configPublishedProductsChartData,
        configPendingProductsChartData,
        configDailyMonthlyNewCustomersData,
        toggleShowAllData,
        showAllData,
        overview,
        orderedProductData,
        isLoading,
        dailyGraph,
        orderChannelGraph,
        handleDailyGraph,
        handleOrderChannelGraph,
        sessionTime,
        goalActiveUser,
        sourceAnalytic,
        pageViews,
        activeVisitorData,
        orderChannelBarConfig,
        orderChannelColConfig,
        availableGraphOptions
    } = useDashboard();


    const cardColors = ["#a727de", "#3ea1e3", "#e82889", "#ef7e42"];


    const DailyCustomerContent = () => {
        if (dailyGraph === "line") {
            return <Line style={{height: "200px"}} {...colConfig} />;
        } else {
            return <Column style={{height: "200px"}} {...barConfig} />;
        }
    };

    const OrderChannelContent = () => {
        if (orderChannelGraph === "line") {
            return <Line style={{height: "200px"}} {...orderChannelColConfig} />;
        } else {
            return <Column style={{height: "200px"}} {...orderChannelBarConfig} />;
        }
    };


    return (
        <CommonLayout>
            <DashboardLayout>
                <>
                    <Row gutter={[10, 10]}>
                        {
                            orderedProductData[0] && Object?.entries(orderedProductData[0]).map(([key, value], index) =>
                                    <Col xs={24} md={6} sm={24} lg={6} key={index}>
                                        <Card
                                            style={{
                                                boxShadow:
                                                    "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                                                background: cardColors[index % cardColors?.length], // Assign a color based on the index
                                                borderRadius: "15px",
                                                height: "110px",
                                                color: "white",
                                                border: "none",
                                            }}
                                        >
                                            <div
                                                style={{display: "flex", justifyContent: "space-between"}}
                                            >
                                                <div>
                                                    <span style={{color: "white"}}>{formatUnderLineText(key)}</span>
                                                    <br/>
                                                    <span style={{fontWeight: "bold", fontSize: "16px"}}>
                      {key === 'total_sales' ? formatMoneyInMillion(value) : value}
                    </span>
                                                    <br/>
                                                    <span style={{fontWeight: "bold", fontSize: "10px"}}>
                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                            )
                        }
                    </Row>
                    <br/>
                    <Row gutter={[10, 10]}>
                        <Col xs={24} md={6} sm={24} lg={6}>
                            <Card
                                style={{
                                    boxShadow:
                                        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                                    background: "#FFFFFF",
                                    borderRadius: "15px",
                                    height: "110px",
                                    color: "#000000",
                                    border: "none",
                                }}
                            >
                                <div
                                    style={{display: "flex", justifyContent: "space-between"}}
                                >
                                    <div>
                                        <span style={{color: "#6C757D"}}>Page Views</span>
                                        <br/>
                                        <span style={{fontWeight: "bold", fontSize: "16px"}}>
                      {pageViews?.totalPage}
                    </span>
                                        <br/>
                                        <span style={{fontWeight: "bold", fontSize: "10px"}}>
                      <div style={{display: "flex"}}>
                        <div style={{marginRight: "3px"}}>
                          <img alt="" src={pageViews?.pagePercentage > 0 ? increase : decrease}/>
                        </div>
                        <div>{pageViews?.pagePercentage?.toFixed(2)}%</div>
                      </div>
                    </span>
                                    </div>
                                    <div>
                                        <img
                                            alt=""
                                            style={{
                                                width: "90%",
                                                height: "50px",
                                                backgroundColor: "#FFFFFF",
                                            }}
                                            src={lineChart}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={6} sm={24} lg={6}>
                            <Card
                                style={{
                                    boxShadow:
                                        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                                    background: "#FFFFFF",
                                    borderRadius: "15px",
                                    height: "110px",
                                    color: "#000000",
                                    border: "none",
                                }}
                            >
                                <div
                                    style={{display: "flex", justifyContent: "space-between"}}
                                >
                                    <div>
                                        <span style={{color: "#6C757D"}}>Visitors</span>
                                        <br/>
                                        <span style={{fontWeight: "bold", fontSize: "16px"}}>
                      {activeVisitorData?.totalActiveVisitor}
                    </span>
                                        <br/>
                                        <span style={{fontWeight: "bold", fontSize: "10px"}}>
                      <div style={{display: "flex"}}>
                        <div style={{marginRight: "3px"}}>
                          <img alt="" src={activeVisitorData?.activeVisitorPercentage >0 ? increase: decrease}/>
                        </div>
                      <div>{activeVisitorData?.activeVisitorPercentage?.toFixed(2)}%</div>
                      </div>
                    </span>
                                    </div>
                                    <div>
                                        <img
                                            alt=""
                                            style={{
                                                width: "90%",
                                                height: "50px",
                                                backgroundColor: "#FFFFFF",
                                            }}
                                            src={singleLineChart1}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={6} sm={24} lg={6}>
                            <Card
                                style={{
                                    boxShadow:
                                        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                                    background: "#FFFFFF",
                                    borderRadius: "15px",
                                    height: "110px",
                                    color: "#000000",
                                    border: "none",
                                }}
                            >
                                <div
                                    style={{display: "flex", justifyContent: "space-between"}}
                                >
                                    <div>
                                        <span style={{color: "#6C757D"}}>Active Users</span>
                                        <br/>
                                        <span style={{fontWeight: "bold", fontSize: "16px"}}>
                      {goalActiveUser?.totalActiveUser}
                    </span>
                                        <br/>
                                        <span style={{fontWeight: "bold", fontSize: "10px"}}>
                      <div style={{display: "flex"}}>
                        <div style={{marginRight: "3px"}}>
                            {
                                goalActiveUser?.activeUserPercentage<0?
                                <img alt="" src={decrease}/>:
                                <img alt="" src={increase}/>
                            }
                          
                        </div>
                        <div>{goalActiveUser?.activeUserPercentage} %</div>
                      </div>
                    </span>
                                    </div>
                                    <div>
                                        <img
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "50%",
                                                backgroundColor: "#FFFFFF",
                                            }}
                                            src={pieChart1}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={6} sm={24} lg={6}>
                            <Card
                                style={{
                                    boxShadow:
                                        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                                    background: "#FFFFFF",
                                    borderRadius: "15px",
                                    height: "110px",
                                    color: "#000000",
                                    border: "none",
                                }}
                            >
                                <div
                                    style={{display: "flex", justifyContent: "space-between"}}
                                >
                                    <div>
                                        <span style={{color: "#6C757D"}}>Avg. Time</span>
                                        <br/>
                                        <span style={{fontWeight: "bold", fontSize: "16px"}}>
                      {sessionTime?.totalSessionTime} 
                    </span>
                                        <br/>
                                        <span style={{fontWeight: "bold", fontSize: "10px"}}>
                      <div style={{display: "flex"}}>
                        <div style={{marginRight: "3px"}}>
                          { (sessionTime?.sessionTimePercentage)?.toFixed(2) < 0?
                              <img alt="" src={decrease}/>:
                              <img alt="" src={increase}/>
                          }
                        </div>
                        <div>{(sessionTime?.sessionTimePercentage)?.toFixed(2)} %</div>
                      </div>
                    </span>
                                    </div>
                                    <div>
                                        <img
                                            alt=""
                                            style={{
                                                width: "90%",
                                                height: "50px",
                                                backgroundColor: "#FFFFFF",
                                            }}
                                            src={barChart1}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <br/>

                    <Row gutter={[10, 10]}>
                        <Col sm={24} xs={24} md={8} lg={8}>
                            <Card title="Products">
                                <div>
                                    <Pie style={{height: "208px"}} {...configPublishedProductsChartData} />
                                </div>
                            </Card>
                        </Col>

                        <Col sm={24} xs={24} md={8} lg={8}>
                            <Card title="Sellers">
                                <div>
                                    <Pie style={{height: "208px"}} {...configPendingProductsChartData} />
                                </div>
                            </Card>
                        </Col>
                        <Col sm={24} xs={24} md={8} lg={8}>
                            <Card title="New Customers">
                                <div>
                                    <Pie style={{height: "208px"}} {...configDailyMonthlyNewCustomersData} />
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <br/>

                    <Row gutter={[16, 16]}>
                        <Col sm={24} xs={24} md={12} lg={12}>
                            <Card
                                title="Daily Order Overview"
                                extra={
                                    <Form
                                        form={form}
                                        style={{marginTop: "8px", display: "flex"}}
                                    >
                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item style={{ marginRight: '3px' }}>
                                                    <Select style={{ width: 120 }} defaultValue={dailyGraph} onChange={ handleDailyGraph}>
                                                        {availableGraphOptions.map((option) => (
                                                            <Select.Option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <Form.Item name="created_at">
                                                    <Select style={{width: 120}} defaultValue={6}>
                                                        {overview.map((item) => (
                                                            <Select.Option key={item.id} value={item.id}>
                                                                {item.type}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                }
                            >
                                <div>
                                    {isLoading ? <Loading/> : <DailyCustomerContent/>}
                                </div>
                            </Card>
                        </Col>

                        <Col sm={24} xs={24} md={12} lg={12}>
                            <Card
                                title="Monthly Order Overview"
                                extra={
                                    <Form
                                        form={form}
                                        style={{marginTop: "8px", display: "flex"}}
                                    >
                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item style={{ marginRight: '3px' }}>
                                                    <Select style={{ width: 120 }} defaultValue={dailyGraph} onChange={handleDailyGraph}>
                                                        {availableGraphOptions.map((option) => (
                                                            <Select.Option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <Form.Item name="created_at">
                                                    <Select style={{width: 120}} defaultValue={6}>
                                                        {overview.map((item) => (
                                                            <Select.Option key={item.id} value={item.id}>
                                                                {item.type}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                }
                            >
                                <div>
                                    {isLoading ? <Loading/> : <DailyCustomerContent/>}
                                </div>
                            </Card>
                        </Col>

                        <Col sm={24} xs={24} md={12} lg={12}>
                            <Card
                                title="Order Channel"
                                extra={
                                    <Form
                                        form={form}
                                        style={{marginTop: "8px", display: "flex"}}
                                    >
                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item style={{ marginRight: '3px' }}>
                                                    <Select style={{ width: 120 }} defaultValue={orderChannelGraph} onChange={handleOrderChannelGraph}>
                                                        {availableGraphOptions.map((option) => (
                                                            <Select.Option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                }
                            >
                                <div>
                                    {isLoading ? <Loading/> : <OrderChannelContent/>}
                                </div>
                            </Card>
                        </Col>


                    </Row>
                    <br/>
                    <ReportCard title="Sources">
                        <div>
                            <CustomTable
                                dataSource={showAllData ? sourceAnalytic : sourceAnalytic.slice(0, 4)}
                                columns={columns}
                                pagination={false}
                            />
                            <div style={{textAlign: "center", marginTop: "10px"}}>
                                <Link to="" onClick={toggleShowAllData}>
                  <span style={{color: "#0D6EFD", fontWeight: "bold"}}>
                    {showAllData ? "Show less data" : "See all data"}{" "}
                      <RightOutlined
                          style={{
                              fontSize: "12px",
                              marginLeft: "10px",
                              color: "black",
                          }}
                      />
                  </span>
                                </Link>
                            </div>
                        </div>
                    </ReportCard>
                </>
            </DashboardLayout>
        </CommonLayout>
    );
}
