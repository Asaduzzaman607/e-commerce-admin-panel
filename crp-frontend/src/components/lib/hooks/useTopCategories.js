import {useParams} from "react-router-dom";
import {Form} from "antd";
import React, {useEffect, useState} from "react";
import { useResource2, useResource3, useResourceForPost, useResourceForPostObject} from "./useInventory";
import {
    categoryWiseSalesReport, crpOrderStatusReport, sellerWiseSalesReport, topTenDistrictsEndPoint, topTenItemsEndPoint
} from "../../../services/ApiEndPointService";


export default function useTopCategories() {
    let {id} = useParams();
    const [form] = Form.useForm();

    const [showAllData, setShowAllData] = useState(false);

    const [categorySaleGraph, setcategorySaleGraph] = useState('line');
    const [orderLevelGraph, setOrderLevelGraph] = useState('line');
    const [topTenItemGraph, setTopTenItemGraph] = useState('line');
    const [topDistrictGraph, setTopDistrictGraph] = useState('line');
    const [sellersGraph, setSellersGraph] = useState('line');


    const availableGraphOptions = [
        { value: 'line', label: 'Line Chart' },
        { value: 'bar', label: 'Bar Chart' },
        // Add more dynamic options here
    ];

    const handleCategorySaleGraphChange = (value) => {
        setcategorySaleGraph(value);
    };

    const handleSellersGraphChange = (value) => {
        setSellersGraph(value);
    };

    const handleOrderLevelGraphChange = (value) => {
        setOrderLevelGraph(value);
    };

    const handleTopTenItemGraphChange = (value) => {
        setTopTenItemGraph(value);
    };

    const handleTopDistrictGraphChange = (value) => {
        setTopDistrictGraph(value);
    };

    const defaultGraphOption = 'line';


    const overview = [
            {id: 1, type: "Last year"},
            {id: 6, type: "Last 6 months"}
        ]
    ;


    const [isLoading, setIsLoading] = useState(false);

    const {data: topDistricts, initData: initTopDistricts} = useResourceForPost(topTenDistrictsEndPoint);
    const {data: crpOrderStatus, initData: initCrpOrderStatus} = useResourceForPostObject(crpOrderStatusReport);
    const {data: sales, initData: initSales} = useResource2(categoryWiseSalesReport);
    const {data: topTenItems, initData: initTopTenItems} = useResource2(topTenItemsEndPoint);
    const {data: sellersWiseSales, initData: initSellersWiseSales} = useResource3(sellerWiseSalesReport);


    const topTenDistricts = topDistricts?.filter(district => district.gmv)
        .sort((a, b) => b.gmv - a.gmv)
        .slice(0, 10);


    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    // Format the start and end dates for the last 7 days in ISO format
    const startDateISO = sevenDaysAgo.toISOString();
    const endDateISO = currentDate.toISOString();


    const filter = {
            'gte': startDateISO,
            'lte': endDateISO,
    };
    const filterString = encodeURIComponent(JSON.stringify(filter));

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



    // Example usage with two API endpoints and a JWT token
    useEffect(() => {
        // Fetch data based on created_at
        (async () => {
            setIsLoading(true); // Set loading state to true
            try {
                await initSales(['category_name', 'total_order_details_price', 'total_order_details_count'], filterString);
                await initTopDistricts(['district_id', 'district_name', 'gmv', 'order_counts'], {
                    api_key: 'ZOHYSUHIRZS_LBM!@050PA5-POMU0ZBX-@WY)=5XP&)B#05*G',
                    range_start: '',
                    range_end: '',
                    req_district: false,
                });

                await initCrpOrderStatus(['shipped', 'delivered', 'processing',
                    'out_for_deli','shipped', 'in_transit', 'hold', 'return_process', 'exception',' return_received', 'cancelled'], {
                    api_key: 'SLPSxORF2HppFbSicmxRWIwPsK990gtXGAgmth3YD',
                    range_start: '',
                    range_end: '',
                });
            } finally {
                setIsLoading(false); // Set loading state to false when data fetching is complete
            }
        })();
    }, []);


// Call initData with the required field names and the POST request body


    useEffect(() => {
        // Fetch data based on created_at
        (async () => {
            setIsLoading(true); // Set loading state to true
            try {
                await initSellersWiseSales(['seller_name', 'periodic_sales', 'periodic_gmv_bdt'], filterMonthString);
                await initTopTenItems(['item_id', 'item_name', 'periodic_sales'], filterMonthString);
            } finally {
                setIsLoading(false); // Set loading state to false when data fetching is complete
            }
        })();
    }, []);



    const toggleShowAllData = () => {
        setShowAllData(!showAllData);
    };

    const handleDelete = async (id) => {

    };


    const lineChartData = [];
    sales?.map((line) => {

        lineChartData?.push({
            year: line?.category_name,
            value: line?.total_order_details_price,
            category: "Periodic GMV BDT",
        });
        lineChartData?.push({
            year: line?.category_name,
            value: line?.total_order_details_count,
            category: "Order Count",
        });
    });

    const barChartData = [];
    sales?.map((line) => {

        barChartData?.push({
            time: line?.category_name,
            value: line?.total_order_details_price,
            type: "Periodic GMV BDT",
        });
        barChartData?.push({
            time: line?.category_name,
            value: line?.total_order_details_count,
            type: "Order Count",
        });
    });

    const colConfig = {
        data: lineChartData,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: true,
            },
            tickCount: lineChartData.length / 2,
        },
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
            marker: { symbol: "square" },
        },
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: true,
            },
            tickCount: barChartData.length / 2,
        },
    };

    const lineChartOrderData = Object.entries(crpOrderStatus).map(([year, value]) => ({ year, value}));

    const barChartOrderData =  Object.entries(crpOrderStatus).map(([type, status]) => ({ type, status }));



    const colOrderDataConfig = {
        data: lineChartOrderData,
        xField: 'year',
        yField: 'value',
        seriesField: 'value',
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: true,
            },
            tickCount: lineChartOrderData.length,
        },
        yAxis: {
            label: {
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
    };




    const barOrderDataConfig = {
        data: barChartOrderData ? barChartOrderData : [],
        xField: 'type',
        yField: 'status',
        seriesField: 'type',
        isGroup: true,
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
        legend: {
            layout: "horizontal",
            position: "top-left",
            marker: { symbol: "square" },
        },
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: true,
            },
            tickCount: barChartOrderData
        },
        minBarLength: 20,
        minBarWidth: 20
    };


    const lineChartSellerData = [];

    // eslint-disable-next-line array-callback-return
    sellersWiseSales?.slice(0, 10)?.map((line) => {

        lineChartSellerData?.push({
            year: line?.seller_name,
            value: line?.periodic_gmv_bdt,
            category: "Periodic GMV BDT",
        });
        lineChartSellerData?.push({
            year: line?.seller_name,
            value: line?.periodic_sales,
            category: "Order Count",
        });
    });

    const barChartSellerData = [];

    // eslint-disable-next-line array-callback-return
    sellersWiseSales?.slice(0, 10)?.map((line) => {

        barChartSellerData?.push({
            time: line?.seller_name,
            value: line?.periodic_gmv_bdt,
            type: "Periodic GMV BDT",
        });
        barChartSellerData?.push({
            time: line?.seller_name,
            value: line?.periodic_sales,
            type: "Order Count",
        });
    });


    const lineChartTopTenItemData = [];
    // eslint-disable-next-line array-callback-return
    topTenItems?.map((line) => {

        lineChartTopTenItemData?.push({
            year: line?.item_name,
            value: parseInt(line?.periodic_sales),
            category: "Periodic Sales",
        });
    });


    // const lineChartTopTenItemData = topTenItems?.map(item => ({
    //     time: item.item_name,
    //     value: parseInt(item.periodic_sales),
    //     category: 'Periodic Sales'
    // }));



    const colTopTenItemConfig = {
        data: lineChartTopTenItemData,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: true,
            },
            tickCount: lineChartTopTenItemData.length,
        },
        yAxis: {
            label: {
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
    };

    const barChartTopTenITemData = [];

    // eslint-disable-next-line array-callback-return
    topTenItems?.map((line) => {

        barChartTopTenITemData?.push({
            time: line?.item_name,
            value: parseInt(line?.periodic_sales),
            type: "Periodic Sales",
        });
    });



    const barTopTenItemConfig = {
        data: barChartTopTenITemData? barChartTopTenITemData: [],
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
            marker: { symbol: "square" },
        },
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: true,
            },
            tickCount: barChartTopTenITemData.length,
        },
    };


    const colSellerConfig = {
        data: lineChartSellerData,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: true,
            },
            tickCount: lineChartSellerData.length / 2,
        },
        yAxis: {
            label: {
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
    };

    const lineChartTopDistrictData = [];
    // eslint-disable-next-line array-callback-return
    topTenDistricts?.map((line) => {

        lineChartTopDistrictData?.push({
            year: line?.district_name,
            value: line?.gmv,
            category: "Periodic GMV BDT",
        });
        lineChartTopDistrictData?.push({
            year: line?.district_name,
            value: line?.order_counts,
            category: "Order Count",
        });
    });

    const colTopDistrictConfig = {
        data: lineChartTopDistrictData,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: true,
            },
            tickCount: lineChartSellerData.length / 2,
        },
        yAxis: {
            label: {
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
    };

    const barChartTopDistrictData = [];

    // eslint-disable-next-line array-callback-return
    topTenDistricts?.map((line) => {

        barChartTopDistrictData?.push({
            time: line?.district_name,
            value: line?.gmv,
            type: "Periodic GMV BDT",
        });
        barChartTopDistrictData?.push({
            time: line?.district_name,
            value: line?.order_counts,
            type: "Order Count",
        });
    });



    const barSellerConfig = {
        data: barChartSellerData? barChartSellerData: [],
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
            marker: { symbol: "square" },
        },
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: true,
            },
            tickCount: barChartSellerData.length / 2,
        },
    };


    const barTopDistrictConfig = {
        data: barChartTopDistrictData? barChartTopDistrictData: [],
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
            marker: { symbol: "square" },
        },
        xAxis: {
            label: {
                autoRotate: true,
                autoHide: false,
                autoEllipsis: true,
            },
            tickCount: barChartTopDistrictData.length / 2,
        },
    };


    return {
        id,
        form,
        handleDelete,
        lineChartData,
        colConfig,
        barConfig,
        toggleShowAllData,
        showAllData,
        overview,
        sellersGraph,
        categorySaleGraph,
        orderLevelGraph,
        topDistrictGraph,
        topTenItemGraph,
        handleCategorySaleGraphChange,
        handleSellersGraphChange,
        handleTopDistrictGraphChange,
        handleTopTenItemGraphChange,
        handleOrderLevelGraphChange,
        isLoading,
        sales,
        colSellerConfig,
        barSellerConfig,
        defaultGraphOption,
        availableGraphOptions,
        colTopDistrictConfig,
        barTopDistrictConfig,
        colTopTenItemConfig,
        barTopTenItemConfig,
        colOrderDataConfig,
        barOrderDataConfig

    };
}