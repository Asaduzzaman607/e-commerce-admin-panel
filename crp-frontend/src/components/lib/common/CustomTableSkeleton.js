import React from 'react';
import {Skeleton} from "antd";

import styled from 'styled-components';

export const CustomTableSkeleton = styled(Skeleton)`
  .ant-skeleton.ant-skeleton-element.ant-skeleton-active{
    width: 100%!important;
  }
  .ant-skeleton-title{
    width: 100%!important;
  } 
  .ant-skeleton-paragraph{
    width: 100%!important;
  }
  .ant-skeleton-paragraph li{
    width: 100%!important;
  }
`;