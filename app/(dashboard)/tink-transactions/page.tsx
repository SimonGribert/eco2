import { fetchTransactions } from "@/lib/Tink";
import { Table } from "antd";

const TinkTransactions = async () => {
  const transactions = await fetchTransactions();

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return <Table dataSource={transactions} columns={columns} rowKey="id" />;
};

export default TinkTransactions;
