import { Table } from "antd";
import styled from "styled-components";

export const CustomTable = styled(Table)`
  .ant-table {
    width: 100%;
    overflow-x: auto;
  }
  .anticon-search svg {
    display: none;
  }
  .ant-table {
    border: 1px solid #d2dae5;
  }
  .ant-table-thead > tr > th {
    background-color: #e8e8e8;
    height: 20%;
  }
  .ant-pagination .ant-pagination-item-active a {
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
  &.ant-table-wrapper tfoot>tr>td{
    padding: 3px 3px !important;
    text-align: center;
  }
`;
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