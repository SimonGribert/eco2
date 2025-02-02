"use server";

import { FieldType } from "@/app/(dashboard)/tink-sync/SyncAccounts";
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

export const UpdateBankAccounts = async (accounts: FieldType["accounts"]) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  for (const account of accounts) {
    await UpdateBankAccount(account, Number(userId));
  }
};

const UpdateBankAccount = async (
  account: FieldType["accounts"][0],
  userId: number
) => {
  if (!account.accountNumber) return;

  await prisma.bankAccount.upsert({
    where: { id: account.accountNumber, userId },
    update: {
      name: account.name,
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
      name: account.name,
      type: account.type,
      bookedBalance: new Prisma.Decimal(account.bookedBalance ?? 0),
      bookedCurrency: account.bookedCurrency ?? "SEK",
      availableBalance: new Prisma.Decimal(account.availableBalance ?? 0),
      availableCurrency: account.availableCurrency ?? "SEK",
      refreshedAt: account.date,
    },
  });

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
