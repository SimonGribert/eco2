"use client";

import Sider from "antd/es/layout/Sider";
import { useState } from "react";

const EcoSider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      {children}
    </Sider>
  );
};

export default EcoSider;
