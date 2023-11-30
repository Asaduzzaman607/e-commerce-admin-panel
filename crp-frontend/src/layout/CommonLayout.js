import { Layout } from 'antd';
import { useAppContext } from '../contexts/apps';
import AppHeader from './AppHeader';
import Sidebar from './Sidebar';

const { Content, Footer } = Layout;

export default function CommonLayout({ children }) {
  const { logo, collapsed, setCollapsed } = useAppContext();

  return (
    <Layout
      style={{
        minHeight: '100vh',
        //marginLeft: collapsed ? 80 : 200,
        marginTop: -8,
        // marginTop: -44.5,
        transition: '.4s',
      }}
    >
      <Sidebar
        collapsed={collapsed}
        logo={logo}
      />
      <Layout className="site-layout">
        <AppHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          logo={logo}
        />
        <Content
          style={{
            margin: collapsed ? '0.1em 0.01em 0.1em 5em' : '1em 1em 0.01em 20em',
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          © All rights reserved for Shop Lover 2023
        </Footer>
      </Layout>
    </Layout>
  );
}
