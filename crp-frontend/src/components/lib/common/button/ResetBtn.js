import { Button } from 'antd';
import styled, {css} from 'styled-components';

const ResetBtn = styled(Button)`
  &.ant-btn {
    border-radius: 4px;
    background: white;
    color: #093441;
    text-align: center;
  }

  &:hover {
    ${css`
      color: #093441!important;
      background-color:white;
      text-decoration: none; 
    `}
  }
  
  &:active {
    ${css`
      color: #093441;
      text-decoration: none; 
      background-color:white;
    `}
  }
`;

export default ResetBtn;
