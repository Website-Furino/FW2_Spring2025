import { Outlet } from "react-router-dom";
import HeaderMenu from "../page/(admin)/components/Header";
import SideMenu from "../page/(admin)/components/Side";
import { Layout, theme } from "antd";
import { useState } from "react";

const { Header, Content, Sider } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  console.log(collapsed);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          background: colorBgContainer,
        }}
      >
        <HeaderMenu />
      </Header>

      {/* Main Layout */}
      <Layout>
        {/* Sidebar */}
        <Sider
          width={200}
          style={{ background: colorBgContainer }}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            setCollapsed(broken);
          }}
          onCollapse={(collapsed, type) => {
            setCollapsed(collapsed);
            console.log(type);
            
          }}
        >
          <SideMenu />
        </Sider>

        {/* Content */}
        <Layout
          style={{
            padding: "0 24px 24px",
            flexDirection: "column",
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;