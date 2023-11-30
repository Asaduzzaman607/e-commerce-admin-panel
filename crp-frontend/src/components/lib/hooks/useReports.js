import React, {useEffect, useRef, useState} from "react";
import {Button, Form, Input, Menu, Space} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import moment from "moment";
import {useResource} from "./useInventory";
import { topCategories} from "../../../services/ApiEndPointService";

export const PAYMENT_OPTIONS = [
    {
        id:1,
        name : 'Paid',
        value: 'paid'
    },
    {
        id:2,
        name : 'Unpaid',
        value: 'unpaid'
    }
]

export const PAYMENT_TYPES = [
    {
        id:1,
        name : 'Cash On Delivery',
        value: 'cash_on_delivery'
    },
    {
        id:2,
        name : 'bKash',
        value: 'bkash'
    }
    ,
    {
        id:3,
        name : 'Upay',
        value: 'upay'
    }
    ,
    {
        id:4,
        name : 'Nagad',
        value: 'nagad'
    },
    {
        id:5,
        name : 'Sslcommerz',
        value: 'sslcommerz'
    }
]
export const DELIVERY_OPTIONS = [
    {
        id:1,
        name : 'Pending',
        value: 'pending'
    },
    {
        id:2,
        name : 'Confirmed',
        value: 'confirmed'
    },
    {
        id:3,
        name : 'Picked Up',
        value: 'picked_up'
    },
    {
        id:4,
        name : 'On The Way',
        value: 'on_the_way'
    },
    {
        id:5,
        name : 'Delivered',
        value: 'delivered'
    }
    ,
    {
        id:6,
        name : 'Cancelled',
        value: 'cancelled'
    }
]
export const LOGISTICS_PAYMENT_TYPES = [
    {
        id:1,
        name : 'Prepaid',
        value: 'Prepaid'
    },
    {
        id:2,
        name : 'Cash on delivery',
        value: 'Cash on delivery'
    }
    ,
    {
        id:3,
        name : 'SslCommerz',
        value: 'SslCommerz'
    }
    ,
    {
        id:4,
        name : 'bkash',
        value: 'bkash'
    },
    {
        id:5,
        name : 'Upay',
        value: 'Upay'
    },
    {
        id:5,
        name : 'Nagad',
        value: 'Nagad'
    }
]
export default function useReports(initialData = [], initialFilterOptions = {}, initialColumns = [], filterPropertyNames = [] ) {
    const [searchedColumn, setSearchedColumn] = useState('');
    const [showColumns, setShowColumns] = useState( Object?.fromEntries(initialColumns?.map(col => [col.dataIndex, true])));
    const [filterOptions, setFilterOptions] = useState(initialFilterOptions);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchText, setSearchText] = useState("");
    const [form] = Form.useForm();
    const size = Form.useWatch("size", form);

    const {data: topCategoriesData, initData: initTopCategoriesData} = useResource(topCategories);


    useEffect(() => {
        (async () => {
                await initTopCategoriesData(['id', 'category_name']);
        })();
    }, []);

    const handleSearchTable = (value) => {
        setSearchText(value);
    };

    function filterDataByProperties(initialData, searchText, propertyNames) {
        return initialData.filter((item) => {
            return propertyNames.some((propertyName) => {
                const propertyValue = getProperty(item, propertyName);
                if (propertyValue !== undefined && propertyValue !== null) {
                    if (Array.isArray(propertyValue)) {
                        // Handle array of objects
                        return propertyValue.some((subItem) =>
                            objectContainsText(subItem, searchText)
                        );
                    } else if (typeof propertyValue === 'object') {
                        // Handle object of objects
                        return objectContainsText(propertyValue, searchText);
                    } else if(propertyName === 'created_at') {
                        // Custom date format parsing
                        const formattedDate = moment(item[propertyName]).format('YYYY-MMM-DD hh:mm');
                        return formattedDate.toLowerCase().includes(searchText.toLowerCase());
                    }else {
                        // Handle scalar values
                        return propertyValue.toString().toLowerCase().includes(searchText.toLowerCase());
                    }
                }
                return false;
            });
        });
    }

    function getProperty(obj, path) {
        const parts = path.split('.');
        let value = obj;

        for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
                value = value[part];
            } else {
                return undefined; // Property not found
            }
        }

        return value;
    }

    function objectContainsText(obj, searchText) {
        for (const key in obj) {
            const value = obj[key];
            if (value !== undefined && value !== null) {
                if (typeof value === 'string') {
                    if (value.toLowerCase().includes(searchText.toLowerCase())) {
                        return true;
                    }
                } else if (typeof value === 'object') {
                    if (objectContainsText(value, searchText)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }


    const filteredData = filterDataByProperties(initialData, searchText, filterPropertyNames);

    // const filteredData = initialData.filter(
    //     (item) =>
    //         item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    //         item.address.toLowerCase().includes(searchText.toLowerCase()) ||
    //         item.city.toLowerCase().includes(searchText.toLowerCase())
    // );

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
        form.resetFields()
    };

    const resetFilterForm = () => {
        form.resetFields()
    };

    const searchInput = useRef(null);


    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <span style={{backgroundColor: '#ffc069', padding: 0}}>{text}</span>
            ) : (
                text
            ),
    });

    const generateColumns = (columns, parentKey = '') => {
        return columns.map((col) => {
            const fullKey = parentKey ? `${parentKey}.${col.dataIndex}` : col.dataIndex;

            if (col.children) {
                // Handle nested columns
                const childColumns = generateColumns(col.children, fullKey);
                return {
                    ...col,
                    children: childColumns,
                    visible: childColumns.some((childCol) => showColumns[childCol.dataIndex]),
                };
            } else {
                // Handle leaf columns
                const dataIndexArray = Array.isArray(col.dataIndex) ? col.dataIndex : [col.dataIndex];
                return {
                    ...col,
                    dataIndex: dataIndexArray,
                    filteredValue: searchedColumn === fullKey ? [searchText] : null,
                    render: (text, record) => {
                        // Traverse the nested properties to get the final value
                        let value = record;
                        for (const dataIndex of dataIndexArray) {
                            if (value) {
                                value = value[dataIndex];
                            } else {
                                break;
                            }
                        }
                        return searchedColumn === fullKey ? (
                            <span style={{ backgroundColor: '#ffc069', padding: 0 }}>{value}</span>
                        ) : (
                            value
                        );
                    },
                    visible: showColumns[fullKey],
                    ...getColumnSearchProps(fullKey),
                };
            }
        });
    };


    const columns = generateColumns(initialColumns);


    const menu = (
        <Menu>
            {columns.map((col) => (
                <Menu.Item key={col.dataIndex}>
                    <div
                        onClick={(e) => handleMenuItemClick(col.dataIndex, e)}
                        onMouseDown={(e) => e.stopPropagation()} // Prevent focus shift
                    >
                        <input
                            type="checkbox"
                            checked={showColumns[col.dataIndex]}
                            onChange={() => handleCheckboxChange(col.dataIndex)}
                            onClick={(e) => e.stopPropagation()} // Prevent extra toggles
                        />
                        {col.title}
                    </div>
                </Menu.Item>
            ))}
        </Menu>
    );


    const handleMenuItemClick = (dataIndex, e) => {
        e.stopPropagation(); // Prevent the click event from closing the menu
        handleCheckboxChange(dataIndex);
    };

    const handleDropdownClick = (e) => {
        e.stopPropagation(); // Prevent the click event from closing the menu
    };
    const handleCheckboxChange = (dataIndex) => {
        setShowColumns((prev) => {
            // Toggle the visibility of the clicked column
            const updatedShowColumns = { ...prev, [dataIndex]: !prev[dataIndex] };

            // If the clicked column is a parent column, also toggle its children
            if (columns.some((col) => col.dataIndex === dataIndex && col.children)) {
                columns
                    .filter((col) => col.dataIndex === dataIndex && col.children)
                    .forEach((parentCol) => {
                        parentCol.children.forEach((childCol) => {
                            updatedShowColumns[childCol.dataIndex] = !prev[dataIndex];
                        });
                    });
            }

            return updatedShowColumns;
        });
    };


    const visibleColumns = columns.filter((col) => col.visible);

    console.log({visibleColumns})

    useEffect(() => {
        setPagination({ ...pagination, pageSize: size });
    }, [size]);

    const handleTableChange = (page) => {
        if (page === "prev_5") {
            setPagination({ ...pagination, current: pagination.current - 3 });
        } else if (page === "next_5") {
            setPagination({ ...pagination, current: pagination.current + 3 });
        } else {
            setPagination(page);
        }
    };



    return {
        data: initialData,
        filteredData,
        form,
        handleTableChange,
        handleDropdownClick,
        handleSearchTable,
        menu,
        searchText,
        filterOptions,
        setFilterOptions,
        columns,
        visibleColumns,
        pagination,
        handleReset,
        resetFilterForm,
        PAYMENT_OPTIONS,
        topCategoriesData,
        LOGISTICS_PAYMENT_TYPES
    };
}