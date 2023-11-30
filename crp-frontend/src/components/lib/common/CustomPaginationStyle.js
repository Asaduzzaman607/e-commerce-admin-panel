import { Pagination } from "antd";
import styled from "styled-components";

export const CustomSpan = styled.span`
  padding: 0 8px;
  min-width: 32px;
  height: 32px;
  border-radius: 6px;
  margin-inline-end: 8px;
  vertical-align: middle;
  display: inline-block;
  border: 1px solid #f1f1f1 !important;
`;
export const CustomPagination = styled(Pagination)`
  text-align: right;
  margin-top: 20px;
  &&.ant-pagination .ant-pagination-item-active a {
    color: black !important;
  }
  .ant-pagination-item {
    background-color: #ffffff !important;
    color: black !important;
    border: 1px solid #f1f1f1 !important;
  }
  .ant-pagination-item-active {
    background-color: #ffc900 !important;
    color: black !important;
    border-color: transparent !important;
  }
  .ant-pagination .ant-pagination-item-active:hover a {
    color: black !important;
  }
`;