"use server";

import { auth } from "@/auth";
import { FormTableType, TableTransactions } from "./Tink";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

export const UpdateUnprocessedTransactions = async (
  transactions: FormTableType<TableTransactions>[]
) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const updatePromises: Promise<void>[] = [];
  for (const transaction of transactions) {
    updatePromises.push(UpdateTransaction(transaction, Number(userId)));
  }

  await Promise.all(updatePromises);
};

const UpdateTransaction = async (
  transaction: FormTableType<TableTransactions>,
  userId: number
) => {
  await prisma.unprocessedTransaction.upsert({
    where: { id: transaction.id, userId },
    update: {
      id: transaction.id,
      transactionId: transaction.transactionID,
      bankAccountId: transaction.bankAccountID,
      amount: new Prisma.Decimal(transaction.amount ?? 0),
      currency: transaction.currency,
      descriptionDisplay: transaction.description,
      descriptionOriginal: transaction.descriptionOriginal,
      status: transaction.status,
      type: transaction.type,
      bookedDate: transaction.date ? new Date(transaction.date ?? "") : null,
      transactionDate: transaction.transactionDate
        ? new Date(transaction.transactionDate ?? "")
        : null,
      valueDate: transaction.valueDate
        ? new Date(transaction.valueDate ?? "")
        : null,
    },
    create: {
      id: transaction.id ?? "asdas",
      transactionId: transaction.transactionID,
      bankAccountId: transaction.bankAccountID,
      userId: userId,
      amount: new Prisma.Decimal(transaction.amount ?? 0),
      currency: transaction.currency ?? "",
      descriptionDisplay: transaction.description ?? "",
      descriptionOriginal: transaction.descriptionOriginal ?? "",
      status: transaction.status,
      type: transaction.type,
      bookedDate: transaction.date ? new Date(transaction.date ?? "") : null,
      transactionDate: transaction.transactionDate
        ? new Date(transaction.transactionDate ?? "")
        : null,
      valueDate: transaction.valueDate
        ? new Date(transaction.valueDate ?? "")
        : null,
    },
  });
};

export const GetUnprocessedTransactions = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const transactions = await prisma.unprocessedTransaction.findMany({
    where: { user: { id: { equals: Number(userId) } } },
  });

  return transactions.map((trans) => {
    return {
      ...trans,
      amount: trans.amount.toNumber(),
    };
  });
};
