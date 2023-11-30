import { Button } from 'antd';
import styled, {css} from 'styled-components';

const SubmitBtn = styled(Button)`
  &.ant-btn {
    border-radius: 4px;
    width: 112px;
    background: #093441;
    color: white;
    text-align: center;
    
  }

  /* Remove hover effect */
  &:hover {
    ${css`
      color: white!important;
      background-color:#093441;
      text-decoration: none;
    `}
  }
  
  &:active {
    ${css`
      color: white;
      text-decoration: none; 
      background-color:#093441;
    `}
  }
`;

export default SubmitBtn;
