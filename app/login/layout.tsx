import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";

const LoginLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 48px",
        }}
      >
        <div> {children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Economy Tracking @ {new Date().getFullYear()} | Created by Simon Gribert
      </Footer>
    </Layout>
  );
};

export default LoginLayout;
