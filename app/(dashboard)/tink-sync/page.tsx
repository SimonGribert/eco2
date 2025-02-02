"use client";

import { Steps } from "antd";
import { useState } from "react";
import SyncAccounts from "./SyncAccounts";

const TinkSync = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1 >= steps.length ? prev : prev + 1));
  };

  const steps = [
    {
      title: "Sync accounts",
      key: "sync-accounts",
      content: <SyncAccounts next={next} />,
    },
    {
      title: "Sync transactions",
      key: "sync-transactions",
      content: "Second-content",
    },
    {
      title: "Process transactions",
      key: "process-transactions",
      content: "Third-content",
    },
    {
      title: "Finished",
      key: "finished",
      content: "Last-content",
    },
  ];

  return (
    <div>
      <Steps current={current} items={steps} />
      <div>{steps[current].content}</div>
    </div>
  );
};

export default TinkSync;
