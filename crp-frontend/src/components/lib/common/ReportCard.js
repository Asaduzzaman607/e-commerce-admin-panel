import { Card } from 'antd';
import styled from 'styled-components';

const ReportCard = styled(Card)`
  &.ant-card {
    overflow: hidden;
    margin: 5px;
  }

  .ant-list-item:hover {
    transition: 0.3s;
    background-color: #e5f6fe;
    border-radius: 10px;
  }

  .ant-card-head-title {
    text-transform: uppercase;
    font-weight: normal;
  }

  .ant-card-body{
    padding-top: 0px;
  }
  .ant-card{
    border-bottom: 0px;
  }
  .ant-card-head {
    font-family: 'Inter', sans-serif !important;
    font-size: 18px;
    color: #334155;
    padding-top: 10px;
    padding-left: 30px;
    border-bottom: 0px;
  }

  .ant-list-item {
    cursor: pointer;
  }

  .ant-list-item a {
    text-decoration: none;
    color: #475569;
    padding-left: 10px;
    font-size: 16px;
  }
`;

export default ReportCard;
