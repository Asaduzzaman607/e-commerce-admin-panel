import {Card, Col, Form, Row, Select} from "antd";
import {Column, Line} from "@ant-design/plots";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import Loading from "../lib/common/Loading";
import useTopCategories from "../lib/hooks/useTopCategories";
import React from "react";


export default function TopCategoriesReport() {
    const {
        form,
        colConfig,
        barConfig,
        isLoading,
        colSellerConfig,
        barSellerConfig,
        availableGraphOptions,
        sellersGraph,
        categorySaleGraph,
        handleCategorySaleGraphChange,
        handleSellersGraphChange,
        colTopDistrictConfig,
        barTopDistrictConfig,
        colTopTenItemConfig,
        barTopTenItemConfig,
        colOrderDataConfig,
        barOrderDataConfig,
        handleTopDistrictGraphChange,
        handleTopTenItemGraphChange,
        handleOrderLevelGraphChange,
        orderLevelGraph,
        topDistrictGraph,
        topTenItemGraph,
    } = useTopCategories();



    const Content = () => {
        const chartConfig = categorySaleGraph === 'line' ? colConfig : barConfig;

        return (
            <div style={{ height: '300px' }}>
                {categorySaleGraph === 'line' ? <Line {...chartConfig} /> : <Column {...chartConfig} />}
            </div>
        );
    };

    const SellersContent = () => {
        const chartConfig = sellersGraph === 'line' ? colSellerConfig : barSellerConfig;

        return (
            <div style={{ height: '300px' }}>
                {sellersGraph === 'line' ? <Line {...chartConfig} /> : <Column {...chartConfig} />}
            </div>
        );
    };


    const TopDistrictsContent = () => {
        const chartConfig = topDistrictGraph === 'line' ? colTopDistrictConfig : barTopDistrictConfig;

        return (
            <div style={{ height: '300px' }}>
                {topDistrictGraph === 'line' ? <Line {...chartConfig} /> : <Column {...chartConfig} />}
            </div>
        );
    };

    const TopItemsContent = () => {
        const chartConfig = topTenItemGraph === 'line' ?    colTopTenItemConfig: barTopTenItemConfig;

        return (
            <div style={{ height: '300px' }}>
                {topTenItemGraph === 'line' ? <Line {...chartConfig} /> : <Column {...chartConfig} />}
            </div>
        );
    };
const OrderLevelContent = () => {
        const chartConfig = orderLevelGraph === 'line' ?  colOrderDataConfig: barOrderDataConfig;

        return (
            <div style={{ height: '300px' }}>
                {orderLevelGraph === 'line' ? <Line {...chartConfig} /> : <Column {...chartConfig} />}
            </div>
        );
    };


    return (
        <CommonLayout>
            <DashboardLayout>
                <>
                    <Row gutter={[16, 16]}>
                        <Col sm={24} xs={24} md={12} lg={12}>
                            <Card
                                title="Last 7 days Category Sales"
                                extra={
                                    <Form
                                        form={form}
                                        style={{marginTop: "8px", display: "flex"}}
                                    >
                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item style={{ marginRight: '3px' }}>
                                                    <Select style={{ width: 120 }} defaultValue={categorySaleGraph} onChange={handleCategorySaleGraphChange}>
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
                                    {isLoading ? <Loading/> : <Content/>}
                                </div>
                            </Card>
                        </Col>

                        <Col sm={24} xs={24} md={12} lg={12}>
                            <Card
                                title="Top 10 Sellers"
                                extra={
                                    <Form
                                        form={form}
                                        style={{marginTop: "8px", display: "flex"}}
                                    >
                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item  style={{ marginRight: '3px' }}>
                                                    <Select style={{ width: 120 }} defaultValue={sellersGraph} onChange={handleSellersGraphChange}>
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
                                {isLoading ? <Loading/> : <SellersContent/>}
                            </div>
                            </Card>
                        </Col>

                        <Col sm={24} xs={24} md={12} lg={12}>
                            <Card
                                title="Top 10 Districts"
                                extra={
                                    <Form
                                        form={form}
                                        style={{marginTop: "8px", display: "flex"}}
                                    >
                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item  style={{ marginRight: '3px' }}>
                                                    <Select style={{ width: 120 }} defaultValue={topDistrictGraph} onChange={handleTopDistrictGraphChange}>
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
                                    {isLoading ? <Loading/> : <TopDistrictsContent/>}
                                </div>
                            </Card>
                        </Col>

                        <Col sm={24} xs={24} md={12} lg={12}>
                            <Card
                                title="Top 10 Items"
                                extra={
                                    <Form
                                        form={form}
                                        style={{marginTop: "8px", display: "flex"}}
                                    >
                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item  style={{ marginRight: '3px' }}>
                                                    <Select style={{ width: 120 }} defaultValue={topTenItemGraph} onChange={handleTopTenItemGraphChange}>
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
                                    {isLoading ? <Loading/> : <TopItemsContent/>}
                                </div>
                            </Card>
                        </Col>  <Col sm={24} xs={24} md={12} lg={12}>
                            <Card
                                title="Order Level Report"
                                extra={
                                    <Form
                                        form={form}
                                        style={{marginTop: "8px", display: "flex"}}
                                    >
                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item  style={{ marginRight: '3px' }}>
                                                    <Select style={{ width: 120 }} defaultValue={orderLevelGraph} onChange={handleOrderLevelGraphChange}>
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
                                    {isLoading ? <Loading/> : <OrderLevelContent/>}
                                </div>
                            </Card>
                        </Col>


                    </Row>
                </>
            </DashboardLayout>
        </CommonLayout>
    );
}
