import { fetchBankAccounts } from "@/lib/Tink";
import { Table } from "antd";

const TinkBankAccounts = async () => {
  const bankAccounts = await fetchBankAccounts();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Booked Balance",
      dataIndex: "bookedBalance",
      key: "bookedBalance",
    },
    {
      title: "Available Balance",
      dataIndex: "availableBalance",
      key: "availableBalance",
    },
  ];

  return <Table dataSource={bankAccounts} columns={columns} rowKey="id" />;
};

export default TinkBankAccounts;
