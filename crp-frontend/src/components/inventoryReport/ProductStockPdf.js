import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import solaimanlipiFont from "../../assets/fonts/solaimanlipi.ttf";

Font.register({
  family: "SolaimanLipi",
  fonts: [
    {
      src: solaimanlipiFont,
      fontWeight: "normal",
    },
  ],
});

const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    pageBreakInside: "avoid",
  },
  tableRow: {
    flexDirection: "row",
    pageBreakInside: "avoid",
    textAlign: "left",
  },
  headerTableRow: {
    flexDirection: "row",
    pageBreakInside: "avoid",
    textAlign: "left",
    backgroundColor: "#2980BA",
    color: "white",
    height: "25px"
  },
  tableCol: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    fontFamily: "SolaimanLipi",
    pageBreakInside: "avoid",
    whiteSpace: "pre-wrap",
  },
  tableCol2: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    fontFamily: "SolaimanLipi",
    whiteSpace: "normal",
  },
  tableCell2: {
    margin: "auto",
    fontSize: 9,
    whiteSpace: "pre-wrap",
    fontFamily: "SolaimanLipi",
    textAlign: "left",
    pageBreakAfter: "auto",
    textOverflow: "ellipsis",
    paddingLeft: "1px",
    paddingRight: "1px",
  },
  tableCell: {
    margin: "auto",
    fontSize: 9,
    whiteSpace: "pre-wrap",
    fontFamily: "SolaimanLipi",
    pageBreakInside: "avoid",
    textAlign: "left",
    pageBreakAfter: "auto",
    paddingLeft: "1px",
    paddingRight: "1px",
  },
  tableHeader: {
    backgroundColor: "#333",
    color: "white",
    fontWeight: "bold",
    fontFamily: "SolaimanLipi",
  },
  reportTitle: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  reportTitleText: {
    fontSize: 18,
    fontFamily: "SolaimanLipi",
  },
});

function insertLineBreaks(text, lineBreakAfter) {
  let result = "";
  for (let i = 0; i < text?.length; i += lineBreakAfter) {
    result += text?.slice(i, i + lineBreakAfter) + "\n";
  }
  return result;
}

const ProductStockPdf = ({ data }) => (
  <Document>
    {data?.map((pageData, pageIndex) => (
      <Page
        wrap
        size="A4"
        orientation="landscape"
        style={{ padding: "0.2in" }}
        key={pageIndex}
      >
        <View style={styles.reportTitle}>
          <Text style={styles.reportTitleText}>Product Stock Report</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.headerTableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>SKU</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Category</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Product</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Product Variation</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Location</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Unit Seeling price</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Stock</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Stock Price</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Total Unit Sold</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Total Unit Trensfered</Text>
            </View>
          </View>

          {pageData?.map((product, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell2}>
                  {insertLineBreaks(product?.sku, 15)}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{product?.category_name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{product?.product}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {product?.product_variation}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{product?.location_name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{product?.unit_price}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{product?.stock}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{product?.stock_price}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{product?.total_sold}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {product?.total_transfered}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    ))}
  </Document>
);

export default ProductStockPdf;
