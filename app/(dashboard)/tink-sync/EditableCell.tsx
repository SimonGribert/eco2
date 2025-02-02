"use client";

import { Button, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import Text from "antd/es/typography/Text";
import { useState } from "react";
import { DataType } from "./SyncAccounts";

const EditableCell = ({
  value,
  field,
  record,
  type = "text",
  enableEdit = false,
  enableSwap = false,
  size = "125px",
}: {
  value: string | number;
  field: "name" | "bookedBalance" | "availableBalance";
  record: DataType;
  type?: "text" | "number";
  enableEdit?: boolean;
  enableSwap?: boolean;
  size?: string;
}) => {
  const [disabled, setDisabled] = useState(true);
  const [val, setVal] = useState(value);
  const form = Form.useFormInstance();

  const swapValue = () => {
    const currValue = form.getFieldValue([
      "accounts",
      record.field.name,
      field,
    ]);

    if (currValue === record.currentAccount?.[field]) {
      form.setFieldValue(["accounts", record.field.name, field], record[field]);
    } else if (currValue === value) {
      form.setFieldValue(
        ["accounts", record.field.name, field],
        record.currentAccount?.[field]
      );
    }

    const newValue = form.getFieldValue(["accounts", record.field.name, field]);

    setVal(newValue);
  };

  console.log(record.currentAccount?.[field], value);

  return (
    <div style={{ display: "flex" }}>
      {disabled ? (
        <div
          style={{ margin: 0, width: size }}
          {...(enableEdit && {
            className: "editable-row",
            onClick: () => setDisabled(false),
          })}
        >
          <Text
            type={
              type === "text"
                ? !record.currentAccount ||
                  record.currentAccount?.[field] === value
                  ? "secondary"
                  : "warning"
                : type === "number"
                ? !record.currentAccount ||
                  record.currentAccount?.[field] === value
                  ? "secondary"
                  : record.currentAccount[field] &&
                    record.currentAccount[field] > value
                  ? "danger"
                  : "success"
                : "secondary"
            }
          >
            {val}
          </Text>
        </div>
      ) : (
        <FormItem
          style={{ margin: 0, width: size }}
          key={record.field.key}
          label={null}
          name={[record.field.name, field]}
        >
          <Input />
        </FormItem>
      )}
      {enableSwap && record.currentAccount && disabled && (
        <Button
          style={{ alignSelf: "center" }}
          size="small"
          type="link"
          onClick={swapValue}
        >
          Swap
        </Button>
      )}
    </div>
  );
};

export default EditableCell;
