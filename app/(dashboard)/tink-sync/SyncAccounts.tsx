"use client";

import { fetchBankAccounts } from "@/lib/Tink";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, FormProps, Table, TableProps } from "antd";
import FormItem from "antd/es/form/FormItem";
import FormList, { FormListFieldData } from "antd/es/form/FormList";
import Text from "antd/es/typography/Text";
import EditableCell from "./EditableCell";
import { BankAccountType } from "@prisma/client";
import { GetBankAccounts, UpdateBankAccounts } from "@/lib/BankAccount";

export interface DataType {
  name: string | null;
  id: string;
  accountNumber: string | undefined;
  type: BankAccountType;
  bookedBalance: number | null;
  bookedCurrency: string | undefined;
  availableBalance: number | null;
  availableCurrency: string | undefined;
  date: Date;
  field: FormListFieldData;
  currentAccount:
    | {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        type: BankAccountType;
        availableBalance: number;
        availableCurrency: string;
        bookedBalance: number;
        bookedCurrency: string;
        refreshedAt: Date;
      }
    | undefined;
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

export type FieldType = {
  accounts: {
    name: string;
    id: string;
    date: Date;
    type: BankAccountType;
    accountNumber: string | undefined;
    bookedBalance: number | null;
    bookedCurrency: string | undefined;
    availableBalance: number | null;
    availableCurrency: string | undefined;
  }[];
};

const SyncAccounts = ({ next }: { next: () => void }) => {
  const tinkBankAccounts = useQuery({
    queryKey: ["tink-back-accounts"],
    queryFn: fetchBankAccounts,
  });

  const bankAccounts = useQuery({
    queryKey: ["back-accounts"],
    queryFn: GetBankAccounts,
  });

  const upsertBankAccounts = useMutation({
    mutationFn: async (bankAccounts: FieldType["accounts"]) => {
      return await UpdateBankAccounts(bankAccounts);
    },
  });

  if (tinkBankAccounts.isPending || bankAccounts.isPending) {
    return <span>Loading...</span>;
  }

  if (tinkBankAccounts.isError || bankAccounts.isError) {
    return (
      <span>
        Error: {tinkBankAccounts.error?.message || bankAccounts.error?.message}
      </span>
    );
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
                    const currentAccount = bankAccounts.data?.find(
                      (acc) => acc.id === row.accountNumber
                    );

                    return {
                      ...row,
                      field: field,
                      currentAccount: currentAccount
                        ? {
                            ...currentAccount,
                            availableBalance: Number(
                              currentAccount?.availableBalance
                            ),
                            bookedBalance: Number(
                              currentAccount?.bookedBalance
                            ),
                          }
                        : undefined,
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
