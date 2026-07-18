"use client";

import { Button, Form, FormListFieldData, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import Text from "antd/es/typography/Text";
import { useState } from "react";

type EditableCellRecord<TResource> = TResource & {
  field: FormListFieldData;
  resource?: TResource;
};

const EditableCell = <
  TResource,
  TDataRecord extends EditableCellRecord<TResource>
>({
  value,
  field,
  record,
  type = "text",
  enableEdit = false,
  enableSwap = false,
  size = "125px",
}: {
  value: string | number;
  field: keyof TResource;
  record: TDataRecord;
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

    if (currValue === record.resource?.[field]) {
      form.setFieldValue(["accounts", record.field.name, field], record[field]);
    } else if (currValue === value) {
      form.setFieldValue(
        ["accounts", record.field.name, field],
        record.resource?.[field]
      );
    }

    const newValue = form.getFieldValue(["accounts", record.field.name, field]);

    setVal(newValue);
  };

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
                ? !record.resource || record.resource?.[field] === value
                  ? "secondary"
                  : "warning"
                : type === "number"
                ? !record.resource || record.resource?.[field] === value
                  ? "secondary"
                  : record.resource[field] && record.resource[field] > value
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
          name={[record.field.name, field as string]}
        >
          <Input />
        </FormItem>
      )}
      {enableSwap && record.resource && disabled && (
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
