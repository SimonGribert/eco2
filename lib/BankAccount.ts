"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { FormTableType, TableBankAccount } from "./Tink";

export const UpdateBankAccounts = async (accounts: FormTableType<TableBankAccount>[]) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  for (const account of accounts) {
    await UpdateBankAccount(account, Number(userId));
  }
};

const UpdateBankAccount = async (
  account: FormTableType<TableBankAccount>,
  userId: number
) => {
  if (!account.accountNumber) return;

  console.log("Upserting bank account:", account);

  const test = await prisma.bankAccount.upsert({
    where: { id: account.accountNumber, userId },
    update: {
      name: account.name ?? "Anonymous",
      type: account.type,
      bookedBalance: new Prisma.Decimal(account.bookedBalance ?? 0),
      bookedCurrency: account.bookedCurrency,
      availableBalance: new Prisma.Decimal(account.availableBalance ?? 0),
      availableCurrency: account.availableCurrency,
      refreshedAt: account.date,
    },
    create: {
      id: account.accountNumber,
      userId: userId,
      name: account.name ?? "Anonymous",
      type: account.type,
      bookedBalance: new Prisma.Decimal(account.bookedBalance ?? 0),
      bookedCurrency: account.bookedCurrency ?? "SEK",
      availableBalance: new Prisma.Decimal(account.availableBalance ?? 0),
      availableCurrency: account.availableCurrency ?? "SEK",
      refreshedAt: account.date,
    },
  });

  console.log("Upserted bank account:", test);

  if (!account.date) return;

  await prisma.bankAccountHistory.upsert({
    where: {
      id_refreshedAt: {
        id: account.accountNumber,
        refreshedAt: account.date,
      },
    },
    update: {
      bookedBalance: new Prisma.Decimal(account.bookedBalance ?? 0),
      bookedCurrency: account.bookedCurrency ?? "SEK",
      availableBalance: new Prisma.Decimal(account.availableBalance ?? 0),
      availableCurrency: account.availableCurrency ?? "SEK",
    },
    create: {
      id: account.accountNumber,
      bookedBalance: new Prisma.Decimal(account.bookedBalance ?? 0),
      bookedCurrency: account.bookedCurrency ?? "SEK",
      availableBalance: new Prisma.Decimal(account.availableBalance ?? 0),
      availableCurrency: account.availableCurrency ?? "SEK",
      refreshedAt: account.date,
    },
  });
};

export const GetBankAccounts = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const bankAccounts = await prisma.bankAccount.findMany({
    where: { userId: Number(userId) },
  });

  return bankAccounts.map((acc) => {
    return {
      ...acc,
      bookedBalance: acc.bookedBalance.toNumber(),
      availableBalance: acc.availableBalance.toNumber(),
    };
  });
};
