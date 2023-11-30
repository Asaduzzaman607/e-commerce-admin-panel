import {
    DownOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {
    Avatar,
    Divider,
    Dropdown,
    Layout,
    Menu,
    Row,
    Typography,
} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {capitalizeString} from "../components/lib/common/Helper";
import { removeUser } from '../redux/reducers/user.reducer';


const LOGOUT = 'logout';
const {Text} = Typography;

export default function AppHeader({collapsed, setCollapsed,logo}) {
    const dispatch = useDispatch();
    const selectedMenu = useSelector((state) => state.menu.selectedMenu);
    const userId = localStorage.getItem('userName');
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            localStorage.clear();
            dispatch(removeUser());
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    };

    const avoidHighpehn = '-'

    const handleMenuClick = async (selected) => {
        const {key} = selected;

        if (key === LOGOUT) {
            await handleLogOut();
        }

    };

    const menu = (
        <Menu
            style={{
                cursor: 'pointer',
                marginTop:'-19px'
            }}
            onClick={handleMenuClick}
            items={[
                {
                    label: (
                        <div
                            style={{
                                margin: '3px 15px',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                        >
                            <LogoutOutlined style={{color: 'red'}}/>{' '}
                            <Text type="danger">Log Out</Text>
                        </div>
                    ),
                    key: LOGOUT,
                },
            ]}
        />
    );

    return (
        <>
            <Layout.Header
                className="site-layout-background"
                style={{
                    color: '#ffffff',
                    backgroundColor: '#23303E',
                    fontSize: '16px',
                    position: 'sticky',
                    width:'100%',
                    top: 0,
                    bottom: 0,
                    zIndex: 9999999,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: collapsed? '41.5px' : '60px',
                    margin:'0px',
                    padding:'0px'
                }}
            >
                
              <Row>
                <div className="logo" style={{ height: '60px',alignItems:'center'}}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={
                            collapsed
                                ? {  margin: '15px', marginTop: '12px',width: '50px', transition: '.3s', textAlign: 'left', color: 'white',alignItems:'center'}
                                : { margin: '15px', marginTop: '15px', width: '132px', transition: '.3s', textAlign: 'left', color: 'white',alignItems:'center' }
                        }
                    />
                </div>
                  <div style={collapsed?{color: 'white',float:'left',margin:'0px',padding:'0px'}:{color: 'white',float:'left',marginLeft:'120px',padding:'0px'}}>
                       {React.createElement(
                           collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                            {
                               className: 'trigger',
                              onClick: () => setCollapsed(!collapsed),
                           }
                      )
                       }
                   </div>
                    <div
                        style={{
                            cursor: 'pointer',
                            padding: '0 24px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#1E1E1E',
                        
                        }}
                    >
                        <span style={{color: 'white'}}>{selectedMenu[0] === '' ? 'Dashboard' : capitalizeString(selectedMenu, avoidHighpehn)}</span>
                    </div>

                </Row>
                <Row
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Dropdown
                        overlay={menu}
                        placement="top"
                    >
                        <Row
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            {/* <Avatar
                                style={{marginRight: '1px', width: '22px', height: '22px', color: 'white',alignItems:'center',marginTop:'4px'}}
                                size="large"
                            /> */}
                            <p
                                style={{
                                    color: 'white',
                                    marginTop: '16px',
                                    marginRight: '10px',
                                    fontSize:'12px',
                                    marginLeft: '10px'
                                }}
                            >{userId}
                            </p>

                            <DownOutlined style={{color: 'white',alignItems:'center',marginTop:'3px'}}/>
                        </Row>
                    </Dropdown>
                    <Divider type="vertical"/>
                </Row>
            </Layout.Header>
        </>
    );
}
