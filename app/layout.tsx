import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
