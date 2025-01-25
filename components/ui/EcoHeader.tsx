import { auth } from "@/auth";
import { Avatar } from "antd";
import { Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import Image from "next/image";
import TinkTokenTime from "./TinkTokenTime";
import { Suspense } from "react";

const EcoHeader = async () => {
  const session = await auth();

  return (
    <Header style={{ padding: "0 16px", background: "white" }}>
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <TinkTokenTime />
        </Suspense>
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Title style={{ margin: 0 }} level={5}>
            {session?.user?.name ?? "First Last"}
          </Title>
          <Avatar
            src={
              <Image
                width={30}
                height={30}
                src={session?.user?.image ?? ""}
                alt="avatar"
              />
            }
            shape="circle"
          />
        </div>
      </div>
    </Header>
  );
};

export default EcoHeader;
