import { signOut } from "@/auth";
import EcoBreadcrumb from "@/components/ui/EcoBreadcrumb";
import EcoHeader from "@/components/ui/EcoHeader";
import EcoSider from "@/components/ui/EcoSider";
import {
  AccountBookOutlined,
  HomeOutlined,
  LogoutOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import MenuItem from "antd/es/menu/MenuItem";
import { SessionProvider } from "next-auth/react";
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
          width={14}
          height={14}
          alt="Picture of the author"
        />
      ),
      children: [
        {
          key: "tink-bank-accounts",
          label: <Link href="/tink-bank-accounts">Accounts</Link>,
          icon: <AccountBookOutlined />,
        },
        {
          key: "tink-transactions",
          label: <Link href="/tink-transactions">Transactions</Link>,
          icon: <TransactionOutlined />,
        },
      ],
    },
    {
      key: "signout",
      className: "eco-hover-red",
      label: (
        <Link
          style={{ color: "#ff4d4f" }}
          onClick={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
          href=""
        >
          Signout
        </Link>
      ),
      icon: <LogoutOutlined style={{ color: "#ff4d4f" }} />,
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
        <Content style={{ margin: "0 16px", height: "100%" }}>
          <EcoBreadcrumb />
          <SessionProvider>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: "white",
                borderRadius: 16,
                height: "90%",
                overflow: "scroll",
              }}
            >
              {children}
            </div>
          </SessionProvider>
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
