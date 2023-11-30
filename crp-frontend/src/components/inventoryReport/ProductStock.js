import { DownOutlined, FilePdfFilled } from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import React from "react";
import CommonLayout from "../../layout/CommonLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import { CustomTable } from "../lib/common/CustomTableStyle";
import ResetBtn from "../lib/common/button/ResetBtn";
import SubmitBtn from "../lib/common/button/SubmitBtn";
import { CustomPagination } from "../lib/common/CustomPaginationStyle";
import { CustomTableSkeleton } from "../lib/common/CustomTableSkeleton";
import ExportToExcelButton, { ExportButton } from "../lib/common/ExportButton";
import ReportCard from "../lib/common/ReportCard";
import useReports from "../lib/hooks/useReports";
import { usePaginateInventory } from "../lib/hooks/usePaginationInventory";
import { useResource } from "../lib/hooks/useInventory";
import { useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import {
  brandUrlEndpoint,
  categoryUrlEndpoint,
  locationUrlEndpoint,
  subcategoryUrlEndpoint,
} from "../../services/ApiEndPointService";
import { notifyResponseError } from "../lib/common/notifications";
import ProductStockPdf from "./ProductStockPdf";
import styled from "styled-components";
const { Text } = Typography;

const CustomDiv = styled.div`
  display: flex;
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    padding-bottom: 7px;
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

const ProductStock = () => {
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
  } = usePaginateInventory("productStockReport", "product_stock_report");

  const customColumns = [
    {
      title: "SL",
      dataIndex: "sl",
      render: (_, __, index) => index + 1,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    {
      title: "Category",
      dataIndex: "category_name",
    },
    {
      title: "Product",
      dataIndex: "product",
      sorter: (a, b) => a.product.localeCompare(b.product),
    },
    {
      title: "Product Variation",
      dataIndex: "product_variation",
      sorter: (a, b) => a.product_variation.localeCompare(b.product_variation),
    },

    {
      title: "Location",
      dataIndex: "location_name",
    },
    {
      title: "Unit Selling Price",
      dataIndex: "unit_price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Stock Price",
      dataIndex: "stock_price",
    },
    {
      title: "Total Unit Sold",
      dataIndex: "total_sold",
    },
    {
      title: "Total Unit Transfered",
      dataIndex: "total_transfered",
    },
  ];
  const customProductStockData = collection?.map((data, index) => ({
    ...data,
    unit_price: data?.unit_price && Math.floor(data?.unit_price),
    stock_price: data?.stock_price && Math.floor(data?.stock_price),
    sl: index + 1,
  }));

  const customFilterOptions = {
    category_name: "",
    product: "",
  };

  const propertyNames = ["category_name", "product"];

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
    customProductStockData,
    customFilterOptions,
    customColumns,
    propertyNames
  );

  const parent_id = Form.useWatch("category_id", form);

  const { data: categoryData, initData: initCategory } =
    useResource(categoryUrlEndpoint);
  const { data: subcategoryData, initData: initSubCategory } = useResource(
    subcategoryUrlEndpoint
  );
  const { data: locationData, initData: initLocation } =
    useResource(locationUrlEndpoint);
  const { data: brandData, initData: initBrand } =
    useResource(brandUrlEndpoint);

  useEffect(() => {
    if (!parent_id) return;
    (async () => {
      await initSubCategory(["id", "name"], parent_id);
    })();
  }, [parent_id]);

  useEffect(() => {
    (async () => {
      await initCategory(["id", "name"]);
      await initLocation(["id", "name"]);
      await initBrand(["id", "name"]);
    })();
  }, []);

  const onFinish = (values) => {
    try {
      const fieldsToCheck = [
        "category_id",
        "sub_category_id",
        "location_id",
        "brand_id",
        "unit_id",
      ];

      fieldsToCheck.forEach((field) => {
        if (values[field] === "all") {
          values[field] = null;
        }
      });
      fetchData(values);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const modifiedData = collection?.map((item) => ({
    sku: item?.sku,
    category_name: item?.category_name,
    product: item?.product,
    product_variation: item?.product_variation ==='DUMMY'? null : item?.product_variation,
    location_name: item?.location_name,
    unit_price: item?.unit_price && Math.floor(item?.unit_price),
    stock: item?.stock,
    stock_price: item?.stock_price && Math.floor(item?.stock_price),
    total_sold: item?.total_sold,
    total_transfered: item?.total_transfered,
  }));
  const tableData = filteredData?.map((item) => ({
    sl:item?.sl,
    sku: item?.sku,
    category_name: item?.category_name,
    product: item?.product,
    product_variation: item?.product_variation ==='DUMMY'? null : item?.product_variation,
    location_name: item?.location_name,
    unit_price: item?.unit_price && Math.floor(item?.unit_price),
    stock: item?.stock,
    stock_price: item?.stock_price && Math.floor(item?.stock_price),
    total_sold: item?.total_sold,
    total_transfered: item?.total_transfered,
  }));

  const handleDownloadPdf = async () => {
    const pages = [];
    for (let i = 0; i < modifiedData?.length; i += 10) {
      const pageData = modifiedData?.slice(i, i + 10);
      pages.push(pageData);
    }
    const doc = <ProductStockPdf data={pages} />;
    const blob = await pdf(doc).toBlob();
    saveAs(blob, "product_stock.pdf");
    const blobURL = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.style.display = "none";
    iframe.src = blobURL;
  };

  return (
    <CommonLayout>
      <DashboardLayout>
        <>
          <ReportCard title="Filter" style={{ marginBottom: 10 }}>
            <Form form={form} onFinish={onFinish}>
              <Row gutter={[6, 6]}>
                <Col sm={24} md={4} xs={24}>
                  <FormItem name={"category_id"}>
                    <Select
                      placeholder="Category"
                      allowClear
                      showSearch
                      filterOption={(inputValue, option) =>
                        option?.children
                          .toString("")
                          .toLowerCase()
                          .includes(inputValue?.toLowerCase())
                      }
                    >
                      <Select.Option value="all" key="all">
                        All
                      </Select.Option>
                      {categoryData?.map((cat) => (
                        <Select.Option value={cat.id} key={cat.id}>
                          {cat.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={24} md={4} xs={24}>
                  <FormItem name={"sub_category_id"}>
                    <Select
                      placeholder={"Sub-Category"}
                      allowClear
                      showSearch
                      filterOption={(inputValue, option) =>
                        option?.children
                          .toString("")
                          .toLowerCase()
                          .includes(inputValue?.toLowerCase())
                      }
                    >
                      <Select.Option value="all" key="all">
                        All
                      </Select.Option>
                      {subcategoryData?.map((sub) => (
                        <Select.Option value={sub.id} key={sub.id}>
                          {sub.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={24} md={4} xs={24}>
                  <FormItem name={"location_id"}>
                    <Select
                      placeholder={"Location"}
                      allowClear
                      showSearch
                      filterOption={(inputValue, option) =>
                        option?.children
                          .toString("")
                          .toLowerCase()
                          .includes(inputValue?.toLowerCase())
                      }
                    >
                      <Select.Option value="all" key="all">
                        All
                      </Select.Option>
                      {locationData?.map((loc) => (
                        <Select.Option value={loc.id} key={loc.id}>
                          {loc.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={24} md={4} xs={24}>
                  <FormItem name={"brand_id"}>
                    <Select
                      placeholder={"Brand"}
                      allowClear
                      showSearch
                      filterOption={(inputValue, option) =>
                        option?.children
                          .toString("")
                          .toLowerCase()
                          .includes(inputValue?.toLowerCase())
                      }
                    >
                      <Select.Option value="all" key="all">
                        All
                      </Select.Option>
                      {brandData?.map((brand) => (
                        <Select.Option value={brand.id} key={brand.id}>
                          {brand.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
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
                    Column Options <DownOutlined />
                  </Button>
                </Dropdown>
                <ExportToExcelButton
                  data={filteredData}
                  fileName="product_stock_data"
                  size="small"
                ></ExportToExcelButton>
                <ExportButton onClick={handleDownloadPdf}>
                  <FilePdfFilled
                    style={{ fontSize: "16px", color: "#FF5733" }}
                  />
                </ExportButton>
              </CustomDiv>
            </CustomDiv>
            {tableData?.length > 0 ? (
              <CustomTable
                dataSource={tableData}
                columns={visibleColumns}
                pagination={false}
                bordered
                scroll={{
                  x: 1300,
                }}
                summary={(pageData) => {
                  let total_stock = 0;
                  let total_stock_price = 0;
                  let total_unit_sold = 0;
                  let total_unit_transfered = 0;
                  pageData?.forEach(
                    ({ stock, stock_price, total_sold, total_transfered }) => {
                      total_stock += stock;
                      total_stock_price += stock_price;
                      total_unit_sold += total_sold;
                      total_unit_transfered += total_transfered;
                    }
                  );
                  return (
                    <>
                      <CustomTable.Summary.Row>
                        <CustomTable.Summary.Cell
                          colSpan={7}
                          style={{ height: "10px" }}
                        >
                          <Text style={{ fontWeight: "bold" }}>Total</Text>
                        </CustomTable.Summary.Cell>
                        <CustomTable.Summary.Cell>
                          <Text>{total_stock}</Text>
                        </CustomTable.Summary.Cell>
                        <CustomTable.Summary.Cell>
                          <Text>ট {total_stock_price}</Text>
                        </CustomTable.Summary.Cell>
                        <CustomTable.Summary.Cell>
                          <Text>ট {total_unit_sold}</Text>
                        </CustomTable.Summary.Cell>
                        <CustomTable.Summary.Cell>
                          <Text>ট {total_unit_transfered}</Text>
                        </CustomTable.Summary.Cell>
                      </CustomTable.Summary.Row>
                    </>
                  );
                }}
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

export default ProductStock;
