"use client";

import { Breadcrumb } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const EcoBreadcrumb = () => {
  const pathname = usePathname();

  const pathSnippets = pathname.split("/").filter((i) => i);

  const breadcrumbItems = pathSnippets.map((path, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

    const routeName = path
      .replaceAll("-", " ")
      .split(" ")
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(" ");

    if (pathSnippets.length === index + 1) {
      return {
        title: routeName,
      };
    }

    return {
      title: <Link href={url}>{routeName}</Link>,
    };
  });

  const items = [
    ...(pathSnippets.length === 0
      ? [
          {
            title: "Home",
          },
        ]
      : [
          {
            title: <Link href="/">Home</Link>,
          },
        ]),
    ...breadcrumbItems,
  ];

  return <Breadcrumb items={items} style={{ margin: "16px 0" }} />;
};

export default EcoBreadcrumb;
