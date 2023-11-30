import {Form} from "antd";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import facebook from "../../../assets/images/facebook.png";
import youtube from "../../../assets/images/youtube.png";
import google from "../../../assets/images/google.png";
import direct from "../../../assets/images/direct.png";
import other from "../../../assets/images/web.png";
import {useResource, useResource2} from "./useInventory";
import {
    dailyMonthlyNewCustomers, monthlyOrders, orderChannel,
    orderedProductEndpoint,
    pendingProductEndpoint,
    publishedProductEndpoint
} from "../../../services/ApiEndPointService";
import useTrackApiData from "./useTrackApiData";

const CustomImg = styled.img`
  vertical-align: middle;
  height: 24px;
  width: 24px;
`;

export default function useDashboard() {
    let {id} = useParams();
    const [form] = Form.useForm();
    const [showAllData, setShowAllData] = useState(false);
    const [dailyGraph, setDailyGraph] = useState('line');
    const [orderChannelGraph, setOrderChannelGraph] = useState('line');

    const created_at = Form.useWatch("created_at", form);
    const handleDailyGraph = (value) => {
        setDailyGraph(value);
    };
    const handleOrderChannelGraph = (value) => {
        setOrderChannelGraph(value);
    };
    const overview = [
            {id: 1, type: "Last year"},
            {id: 6, type: "Last 6 months"}
        ]
    ;


    const {data: orderedProductData, initData: initOrderedProduct} = useResource(orderedProductEndpoint,);
    const {data: publishedProductData, initData: initPublishedProduct} = useResource(publishedProductEndpoint);
    const {data: pendingProductData, initData: initPendingProduct} = useResource(pendingProductEndpoint);
    const {
        data: dailyMonthlyNewCustomersData,
        initData: initDailyMonthlyNewCustomersData
    } = useResource(dailyMonthlyNewCustomers);
    const {data: monthlyOrdersData, initData: initMonthlyOrdersData} = useResource2(monthlyOrders);
    const {data: orderChannelData, initData: initOrderChannelData} = useResource2(orderChannel);

    const {
        collection: activeVisitorData,
        handleLastVisitor,
        sessionTime,
        handleSessionTimeComparison,
        goalActiveUser,
        handleGoalsActiveUserComparison,
        sourceAnalytic,
        handleSourceAnalyticComparison,
        handlePageViews,
        pageViews
    } = useTrackApiData()

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true); // Set loading state to true
            try {
                await initOrderedProduct(['total_customer', 'total_order', 'total_product_category', 'total_sales']);
                await initPublishedProduct(['total_sellers_product', 'total_published_products', 'total_admin_products']);
                await initPendingProduct(['total_seller_approve', 'total_pending_sellers', 'total_sellers']);
                await initDailyMonthlyNewCustomersData(['todays_new_customers', 'monthly_new_customers']);
                await handleLastVisitor();
                await handleSessionTimeComparison();
                await handleGoalsActiveUserComparison();
                await handleSourceAnalyticComparison();
                await handlePageViews();
            } finally {
                setIsLoading(false); // Set loading state to false when data fetching is complete
            }
        })();
    }, []);

    const currentDate = new Date();
    const currentMonth = new Date();
    const threeMonthsAgo = new Date(currentMonth);
    threeMonthsAgo.setMonth(currentDate.getMonth() - 6);

// Format the start and end dates for the last 3 months in ISO format
    const startMonthISO = threeMonthsAgo.toISOString();
    const endMonthISO = currentDate.toISOString();

    const filterMonth = {
        'gte': startMonthISO,
        'lte': endMonthISO,
    };
    const filterMonthString = encodeURIComponent(JSON.stringify(filterMonth));

    useEffect(() => {
        // Fetch data based on created_at
        (async () => {
            setIsLoading(true); // Set loading state to true
            try {
                await initMonthlyOrdersData(['month', 'total_order', 'total_deliver', 'total_cancel'], created_at);
                await initOrderChannelData(['order_mode', 'gmv', 'nmv', 'gis', 'nis'], filterMonthString);
            } finally {
                setIsLoading(false); // Set loading state to false when data fetching is complete
            }
        })();
    }, [created_at]);


    const toggleShowAllData = () => {
        setShowAllData(!showAllData);
    };

    const handleDelete = async (id) => {

    };

    const lineChartData = [];
    monthlyOrdersData?.map((line) => {
        const orderValue = parseInt(line?.total_order);
        const deliverValue = parseInt(line?.total_deliver);
        const cancelValue = parseInt(line?.total_cancel);

        if (!isNaN(orderValue) && !isNaN(deliverValue) && !isNaN(cancelValue)) {
            lineChartData?.push({
                year: line?.month.toString(),
                value: orderValue,
                category: "Total Order",
            });
            lineChartData?.push({
                year: line?.month.toString(),
                value: deliverValue,
                category: "Total Deliver",
            });
            lineChartData?.push({
                year: line?.month.toString(),
                value: cancelValue,
                category: "Total Cancel",
            });
        }
    });


    const orderChannelChartData = [];
    orderChannelData?.map((line) => {
        const gisValue = parseInt(line?.gis);
        const gmvValue = parseInt(line?.gmv);
        const nisValue = parseInt(line?.nis);
        const nmvValue = parseInt(line?.nmv);

        if (!isNaN(gisValue) && !isNaN(gmvValue) && !isNaN(nisValue) && !isNaN(nmvValue)) {
            orderChannelChartData?.push({
                year: line?.order_mode,
                value: gisValue,
                category: "GIS",
            });
            orderChannelChartData?.push({
                year: line?.order_mode,
                value: gmvValue,
                category: "GMV",
            });
            orderChannelChartData?.push({
                year: line?.order_mode,
                value: nisValue,
                category: "NIS",
            });
            orderChannelChartData?.push({
                year: line?.order_mode,
                value: nmvValue,
                category: "NMV",
            });
        }
    });


    const barChartData = [];
    monthlyOrdersData?.map((line) => {
        const orderValue = parseInt(line?.total_order);
        const deliverValue = parseInt(line?.total_deliver);
        const cancelValue = parseInt(line?.total_cancel);

        if (!isNaN(orderValue) && !isNaN(deliverValue) && !isNaN(cancelValue)) {
            barChartData?.push({
                time: line?.month.toString(),
                value: orderValue,
                type: "Total Order",
            });
            barChartData?.push({
                time: line?.month.toString(),
                value: deliverValue,
                type: "Total Deliver",
            });
            barChartData?.push({
                time: line?.month.toString(),
                value: cancelValue,
                type: "Total Cancel",
            });
        }
    });

    const orderChannelBarChartData = [];
    orderChannelData?.map((line) => {
        const gisValue = parseInt(line?.gis);
        const gmvValue = parseInt(line?.gmv);
        const nisValue = parseInt(line?.nis);
        const nmvValue = parseInt(line?.nmv);

        if (!isNaN(gisValue) && !isNaN(gmvValue) && !isNaN(nisValue) && !isNaN(nmvValue)) {
            orderChannelBarChartData?.push({
                time: line?.order_mode,
                value: gisValue,
                type: "gisValue",
            });
            orderChannelBarChartData?.push({
                time: line?.order_mode,
                value: gmvValue,
                type: "gmvValue",
            });
            orderChannelBarChartData?.push({
                time: line?.order_mode,
                value: nisValue,
                type: "nisValue",
            });
            orderChannelBarChartData?.push({
                time: line?.order_mode,
                value: nmvValue,
                type: "nmvValue",
            });
        }
    });


    const colConfig = {
        data: lineChartData,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
        yAxis: {
            label: {
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
    };
    const orderChannelColConfig = {
        data: orderChannelChartData,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
        yAxis: {
            label: {
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
    };


    const barConfig = {
        data: barChartData ? barChartData : [],
        xField: 'time',
        yField: 'value',
        seriesField: 'type',
        isGroup: true,
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
        legend: {
            layout: "horizontal",
            position: "top-left",
            marker: {symbol: "square"},
        },
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: false,
            },
            tickCount: barChartData.length / 2,
        },
    };
    const orderChannelBarConfig = {
        data: orderChannelBarChartData ? orderChannelBarChartData : [],
        xField: 'time',
        yField: 'value',
        seriesField: 'type',
        isGroup: true,
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
        legend: {
            layout: "horizontal",
            position: "top-left",
            marker: {symbol: "square"},
        },
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: false,
            },
            tickCount: orderChannelBarChartData.length / 2,
        },
    };


    const columns = [
        {
            title: "Source",
            dataIndex: "source_name",
            key: "source",
            render: (text, record) => (
                <span>
          {getIcon(record.source_name)} {text}
        </span>
            ),
        },
        {
            title: "Visitors",
            dataIndex: "totalPageCount",
            key: "visitors",
            sorter: (a, b) => a?.totalPageCount?.toString()?.localeCompare(b?.totalPageCount),
        },
        {
            title: "Page Views",
            dataIndex: "totalVisitorCount",
            key: "views",
            sorter: (a, b) => a.views - b.views,
        },
        {
            title: "Traffic Ratio",
            dataIndex: "percentage",
            key: "trafficRatio",
            sorter: (a, b) => a?.percentage?.toString()?.localeCompare(b?.percentage?.toString()),
            render: (text, record) => <span style={getColor(text)}>{text}%</span>,
        },
        {
            title: "Average Session",
            dataIndex: "totalAverageDuration",
            key: "duration",
            sorter: (a, b) => a?.totalAverageDuration?.toString()?.localeCompare(b?.totalAverageDuration),
        },
    ];


    const getColor = (percentage) => {
        if (parseFloat(percentage) < 0) {
            return {backgroundColor: "#FFE0E3", padding: "3px", color: "red"};
        } else if (parseFloat(percentage) > 0) {
            return {backgroundColor: "#DCFFF5", padding: "3px", color: "#20C997"};
        }
    };

    const getIcon = (name) => {
        switch (name) {
            case "Facebook":
                return <CustomImg src={facebook}/>;
            case "Google":
                return <CustomImg src={google}/>;
            case "Youtube":
                return <CustomImg src={youtube}/>;
            case "Direct":
                return <CustomImg src={direct}/>;
            default:
                return <CustomImg src={other}/>;
        }
    };


    const dailyMonthlyNewCustomersChart = [
        {
            type: "Today's",
            value: parseInt(dailyMonthlyNewCustomersData[0]?.todays_new_customers)
        },
        {
            type: "Monthly",
            value: parseInt(dailyMonthlyNewCustomersData[0]?.monthly_new_customers)
        }
    ];

// Add data validation to ensure the values are valid numbers
    dailyMonthlyNewCustomersChart.forEach((dataPoint) => {
        if (isNaN(dataPoint.value)) {
            // Handle the case where the value is not a valid number, e.g., set it to 0 or handle the error.
            dataPoint.value = 0;
        }
    });


    const publishedProductsChart = [
        {
            type: "Total Products",
            value: parseInt(publishedProductData[0]?.total_sellers_product)
        },
        {
            type: "Published Products",
            value: parseInt(publishedProductData[0]?.total_published_products)
        }
    ];

    publishedProductsChart.forEach((dataPoint) => {
        if (isNaN(dataPoint.value)) {
            // Handle the case where the value is not a valid number, e.g., set it to 0 or handle the error.
            dataPoint.value = 0;
        }
    });

    const pendingProductsChart = [
        {
            type: "Total Approve",
            value: parseInt(pendingProductData[0]?.total_seller_approve)
        },
        {
            type: "Total Pending",
            value: parseInt(pendingProductData[0]?.total_pending_sellers)
        },
        {
            type: "Total Sellers",
            value: parseInt(pendingProductData[0]?.total_sellers)
        },
    ];

    pendingProductsChart.forEach((dataPoint) => {
        if (isNaN(dataPoint.value)) {
            // Handle the case where the value is not a valid number, e.g., set it to 0 or handle the error.
            dataPoint.value = 0;
        }
    });


    const configDailyMonthlyNewCustomersData = {
        appendPadding: 10,
        data: dailyMonthlyNewCustomersChart,
        angleField: 'value',
        colorField: 'type',
        color: ["#43ab65", "#e018ee", "#3485FD"],
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({percent}) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };


    const configPublishedProductsChartData = {
        appendPadding: 10,
        data: publishedProductsChart,
        angleField: 'value',
        colorField: 'type',
        color: ["#43ab65", "#e018ee"],
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({percent}) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };

    const configPendingProductsChartData = {
        appendPadding: 10,
        data: pendingProductsChart,
        angleField: 'value',
        colorField: 'type',
        color: ["#43ab65", "#e018ee", "#3485FD"],
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({percent}) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };
    const availableGraphOptions = [
        { value: 'line', label: 'Line Chart' },
        { value: 'bar', label: 'Bar Chart' },
        // Add more dynamic options here
    ];

    return {
        id,
        form,
        handleDelete,
        lineChartData,
        colConfig,
        barConfig,
        configPublishedProductsChartData,
        configPendingProductsChartData,
        configDailyMonthlyNewCustomersData,
        columns,
        toggleShowAllData,
        showAllData,
        overview,
        orderedProductData,
        dailyGraph,
        orderChannelGraph,
        handleDailyGraph,
        handleOrderChannelGraph,
        isLoading,
        sessionTime,
        handleGoalsActiveUserComparison,
        goalActiveUser,
        sourceAnalytic,
        pageViews,
        activeVisitorData,
        orderChannelBarConfig,
        orderChannelColConfig,
        availableGraphOptions
    };
}
