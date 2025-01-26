"use client";

import { fetchTransactions } from "@/lib/Tink";
import { TinkStatus } from "@/types/tink";
import { Button, Table } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { useCallback, useState } from "react";

type TableTransactions = {
  id: string;
  description: string | undefined;
  amount: string | null;
  date: string | undefined;
  status: TinkStatus;
};

const TinkTransactionsTable = ({
  initTransactions,
  nextPage,
}: {
  initTransactions: TableTransactions[];
  nextPage: string | null;
}) => {
  const [transactions, setTransactions] =
    useState<TableTransactions[]>(initTransactions);
  const [nextPageToken, setNextPageToken] = useState<string | null>(nextPage);
  const [isLoading, setIsLoading] = useState(false);

  const loadTransactions = useCallback(async (pageToken: string | null) => {
    setIsLoading(true);
    const { transactions: newTransactions, nextPageToken: newNextPageToken } =
      await fetchTransactions(pageToken);
    setTransactions((prev) => [...prev, ...newTransactions]);
    setNextPageToken(newNextPageToken);
    setIsLoading(false);
  }, []);

  const columns = [
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

  return (
    <div>
      <Table
        dataSource={transactions}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paragraph style={{ margin: "16px 0"}}>Transaction Count: {transactions.length}</Paragraph>
        {(nextPageToken || isLoading) && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => loadTransactions(nextPageToken)}
              disabled={isLoading}
              type="primary"
            >
              {isLoading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TinkTransactionsTable;
