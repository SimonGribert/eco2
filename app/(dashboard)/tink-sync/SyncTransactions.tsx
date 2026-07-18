"use client";

import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Button, Form, FormProps, Table, TableProps } from "antd";
import FormItem from "antd/es/form/FormItem";
import FormList, { FormListFieldData } from "antd/es/form/FormList";
import Text from "antd/es/typography/Text";
import {
  fetchTransactions,
  FormTableType,
  TableTransactions,
} from "@/lib/Tink";
import { useEffect } from "react";
import { UpdateUnprocessedTransactions } from "@/lib/UnprocessedTransactions";
import EditableCell from "./EditableCell";

type DataTypeTransaction = FormTableType<TableTransactions> & {
  field: FormListFieldData;
};
type ColumnTypes = Exclude<
  TableProps<DataTypeTransaction>["columns"],
  undefined
>;

export type FieldType = {
  transactions: FormTableType<TableTransactions>[];
};

const SyncTransactions = ({ next }: { next: () => void }) => {
  const [form] = Form.useForm();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["tink-transactions"],
      queryFn: fetchTransactions,
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextPageToken,
    });

  const upsertTransactions = useMutation({
    mutationFn: async (transactions: FormTableType<TableTransactions>[]) => {
      return await UpdateUnprocessedTransactions(transactions);
    },
  });

  const transactions = data?.pages.reduce(
    (acc, p) => [...acc, ...(p.transactions ?? [])],
    [] as FormTableType<TableTransactions>[]
  );

  useEffect(() => {
    form.setFieldsValue({ transactions });
  }, [form, transactions]);

  if (!transactions || transactions.length <= 0) {
    return <span>No transactions found</span>;
  }

  const columns: ColumnTypes[number][] = [
    {
      title: "Description",
      dataIndex: "descriptionGroup",
      key: "descriptionGroup",
      children: [
        {
          title: "Display",
          dataIndex: "description",
          key: "description",
        },
        {
          title: "Original",
          dataIndex: "descriptionOriginal",
          key: "descriptionOriginal",
        },
      ],
    },
    {
      title: "Amount",
      dataIndex: "amountGroup",
      key: "amountGroup",
      children: [
        {
          title: "Amount",
          dataIndex: "amount",
          key: "amount",
          render: (value, record) => {
            return (
              <EditableCell
                type="number"
                value={value}
                record={record}
                field="amount"
                size="75px"
              />
            );
          },
        },
        {
          title: "Currency",
          dataIndex: "currency",
          key: "currency",
        },
      ],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value, record) => {
        return (
          <EditableCell
            type="text"
            value={value}
            record={record}
            field="status"
            size="65px"
          />
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      console.log(JSON.stringify(values));
      await upsertTransactions.mutateAsync(values.transactions);
      next();
    } catch (error) {
      console.error("Syncing Transactions Failed:", error);
    }
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          transactions: transactions,
        }}
      >
        <FormList name="transactions">
          {(fields) => {
            return (
              <>
                <Table
                  onRow={(record) => {
                    return {
                      style: {
                        background: record.resource ? "#d9f7be" : "#bae0ff",
                      },
                    };
                  }}
                  size="small"
                  pagination={false}
                  style={{ margin: "16px 0" }}
                  dataSource={fields.map((field) => {
                    const row = transactions[field.key];

                    return {
                      ...row,
                      field: field,
                    };
                  })}
                  columns={columns}
                  rowKey="id"
                />
              </>
            );
          }}
        </FormList>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleLoadMore}
              disabled={!hasNextPage || isFetchingNextPage}
              type="primary"
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </Button>
          </div>
          <Text>{transactions.length}</Text>
          {upsertTransactions.isError && (
            <Text style={{ margin: "0 16px" }} type="danger">
              Something went wrong with updating your transactions
            </Text>
          )}
          <FormItem style={{ margin: 0 }} label={null}>
            <Button
              htmlType="submit"
              type="primary"
              loading={upsertTransactions.isPending}
            >
              Next
            </Button>
          </FormItem>
        </div>
      </Form>
    </div>
  );
};

export default SyncTransactions;
