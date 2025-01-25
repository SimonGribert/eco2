import { signOut } from "@/auth";
import EcoBreadcrumb from "@/components/ui/EcoBreadcrumb";
import EcoHeader from "@/components/ui/EcoHeader";
import EcoSider from "@/components/ui/EcoSider";
import {
  AccountBookOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import MenuItem from "antd/es/menu/MenuItem";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

type MenuItem = Required<MenuProps>["items"][number];
const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const menuItems: MenuItem[] = [
    {
      key: "home",
      label: <Link href="/">Home</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "tink",
      label: "Tink",
      icon: (
        <Image
          src="/tinkicon.svg"
          width={16}
          height={16}
          alt="Picture of the author"
        />
      ),
      children: [
        {
          key: "tink-bank-accounts",
          label: <Link href="/tink-bank-accounts">Accounts</Link>,
          icon: <AccountBookOutlined />,
        },
      ],
    },
    {
      key: "signout",
      label: (
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <Button
            style={{
              width: "100%",
              padding: 0,
              display: "inline-block",
              textAlign: "start",
            }}
            danger
            icon={<LogoutOutlined />}
            type="text"
            htmlType="submit"
          >
            <span
              style={{ marginLeft: "10px" }}
              className="ant-menu-title-content"
            >
              Signout
            </span>
          </Button>
        </form>
      ),
    },
  ];

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <EcoSider>
        <Menu theme="light" mode="inline" items={menuItems} />
      </EcoSider>

      <Layout>
        <Suspense
          fallback={<Header style={{ padding: 0, background: "white" }} />}
        >
          <EcoHeader />
        </Suspense>
        <Content style={{ margin: "0 16px" }}>
          <EcoBreadcrumb />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "white",
              borderRadius: 16,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Economy Tracking @ {new Date().getFullYear()} | Created by Simon
          Gribert
        </Footer>
      </Layout>
    </div>
  );
};

export default DashboardLayout;
