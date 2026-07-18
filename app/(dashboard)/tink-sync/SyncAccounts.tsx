"use client";

import { fetchBankAccounts, FormTableType, TableBankAccount } from "@/lib/Tink";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, FormProps, Table, TableProps } from "antd";
import FormItem from "antd/es/form/FormItem";
import FormList, { FormListFieldData } from "antd/es/form/FormList";
import Text from "antd/es/typography/Text";
import EditableCell from "./EditableCell";
import { UpdateBankAccounts } from "@/lib/BankAccount";

type DataTypeBankAccount = FormTableType<TableBankAccount> & {
  field: FormListFieldData;
};

type ColumnTypes = Exclude<
  TableProps<DataTypeBankAccount>["columns"],
  undefined
>;

type FieldType = {
  accounts: FormTableType<TableBankAccount>[];
};

const SyncAccounts = ({ next }: { next: () => void }) => {
  const tinkBankAccounts = useQuery({
    queryKey: ["tink-back-accounts"],
    queryFn: fetchBankAccounts,
  });

  const upsertBankAccounts = useMutation({
    mutationFn: async (bankAccounts: FormTableType<TableBankAccount>[]) => {
      return await UpdateBankAccounts(bankAccounts);
    },
  });

  if (tinkBankAccounts.isPending) {
    return <span>Loading...</span>;
  }

  if (tinkBankAccounts.isError) {
    return <span>Error: {tinkBankAccounts.error?.message}</span>;
  }

  if (tinkBankAccounts.data.length <= 0) {
    return <span>No accounts found</span>;
  }

  const columns: ColumnTypes[number][] = [
    {
      title: "Current Account",
      dataIndex: "currentAccount",
      key: "currentAccount",
      hidden: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (value, record) => {
        return (
          <EditableCell
            enableEdit
            enableSwap
            value={value}
            record={record}
            field="name"
          />
        );
      },
    },
    {
      title: "Booked",
      dataIndex: "booked",
      key: "booked",
      children: [
        {
          title: "Balance",
          dataIndex: "bookedBalance",
          key: "bookedBalance",
          render: (value, record) => {
            return (
              <EditableCell
                type="number"
                value={value}
                record={record}
                field="bookedBalance"
                size="75px"
              />
            );
          },
        },
        {
          title: "Currency",
          dataIndex: "bookedCurrency",
          key: "bookedCurrency",
        },
      ],
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
      children: [
        {
          title: "Balance",
          dataIndex: "availableBalance",
          key: "availableBalance",
          render: (value, record) => {
            return (
              <EditableCell
                type="number"
                value={value}
                record={record}
                field="availableBalance"
                size="75px"
              />
            );
          },
        },
        {
          title: "Currency",
          dataIndex: "availableCurrency",
          key: "availableCurrency",
        },
      ],
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

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await upsertBankAccounts.mutateAsync(values.accounts);

      next();
    } catch (error) {
      console.error("Syncing Bank Accounts Failed:", error);
    }
  };

  return (
    <div>
      <Form
        onFinish={onFinish}
        initialValues={{ accounts: tinkBankAccounts.data }}
      >
        <FormList name="accounts">
          {(fields) => {
            return (
              <>
                <Table
                  size="small"
                  pagination={false}
                  style={{ margin: "16px 0" }}
                  dataSource={fields.map((field) => {
                    const row = tinkBankAccounts.data[field.key];

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
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          {upsertBankAccounts.isError && (
            <Text style={{ margin: "0 16px" }} type="danger">
              Something went wrong with updating your bank accounts
            </Text>
          )}
          <FormItem style={{ margin: 0 }} label={null}>
            <Button
              htmlType="submit"
              type="primary"
              loading={upsertBankAccounts.isPending}
            >
              Next
            </Button>
          </FormItem>
        </div>
      </Form>
    </div>
  );
};

export default SyncAccounts;
