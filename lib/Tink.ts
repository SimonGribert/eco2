"use server";

import { auth } from "@/auth";
import { FindAccount } from "@/lib/Account";
import {
  TinkCurrencyDenominatedAmount,
  TinkListAccountsResponse,
  TinkListTransactionsResponse,
} from "@/types/tink";
import {
  BankAccountType,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { GetBankAccounts } from "./BankAccount";
import { GetUnprocessedTransactions } from "./UnprocessedTransactions";

export const fetchBankAccounts = async (): Promise<
  FormTableType<TableBankAccount>[]
> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return [];

  const account = await FindAccount("tink", Number(userId));

  if (!account) {
    return [];
  }

  const accessToken = account.access_token;

  const response = await fetch("https://api.tink.com/data/v2/accounts", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data: TinkListAccountsResponse = await response.json();

  const bankAccounts = await GetBankAccounts();

  return (
    data.accounts?.map((acc) => {
      const bankAccount = bankAccounts.find(
        (a) => a.id === acc.identifiers?.financialInstitution?.accountNumber,
      );

      return {
        name: acc.name,
        id: acc.id,
        date: acc.dates.lastRefreshed,
        type: acc.type,
        accountNumber: acc.identifiers?.financialInstitution?.accountNumber,
        bookedBalance: formatBalance(acc.balances?.booked?.amount),
        bookedCurrency: acc.balances?.booked?.amount?.currencyCode,
        availableBalance: formatBalance(acc.balances?.available?.amount),
        availableCurrency: acc.balances?.available?.amount?.currencyCode,
        resource: bankAccount
          ? {
              name: bankAccount.name,
              id: bankAccount.id,
              date: bankAccount.refreshedAt,
              type: bankAccount.type,
              accountNumber: bankAccount.id,
              bookedBalance: bankAccount.bookedBalance,
              bookedCurrency: bankAccount.bookedCurrency,
              availableBalance: bankAccount.availableBalance,
              availableCurrency: bankAccount.availableCurrency,
            }
          : undefined,
      };
    }) ?? []
  );
};

export const fetchTransactions = async ({
  pageParam,
}: {
  pageParam: string | null;
}): Promise<{
  transactions?: FormTableType<TableTransactions>[];
  nextPageToken: string | null;
}> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { transactions: [], nextPageToken: null };

  const account = await FindAccount("tink", Number(userId));

  if (!account) {
    return { transactions: [], nextPageToken: null };
  }

  const accessToken = account.access_token;
  const query = pageParam ? `?pageToken=${pageParam}` : "";

  const response = await fetch(
    `https://api.tink.com/data/v2/transactions${query}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data: TinkListTransactionsResponse = await response.json();

  console.log({ transactions: data.transactions, first: data.transactions?.[2], });

  const tinkAccounts = await fetchBankAccounts();

  const unprocessedTransactions = await GetUnprocessedTransactions();

  const transactions =
    data.transactions?.map((transaction) => {
      const amount = formatBalance(transaction.amount);
      const bookedDate = new Date(
        transaction.bookedDateTime ?? transaction.dates?.booked ?? "",
      );

      const unprocessedTransaction = unprocessedTransactions.find((ut) => {
        return (
          ut.descriptionOriginal === transaction.descriptions?.original &&
          ut.amount === amount &&
          ut.bookedDate?.getTime() === bookedDate.getTime()
        );
      });

      return {
        id: transaction.id,
        transactionID: transaction.identifiers?.providerTransactionId,
        bankAccountID: tinkAccounts.find((a) => a.id === transaction.accountId)
          ?.accountNumber,
        currency: transaction.amount.currencyCode,
        description: transaction.descriptions?.display,
        descriptionOriginal: transaction.descriptions?.original,
        type: transaction.types.type,
        amount,
        date: transaction.bookedDateTime ?? transaction.dates?.booked,
        transactionDate:
          transaction.transactionDateTime ?? transaction.dates?.transaction,
        valueDate: transaction.valueDateTime ?? transaction.dates?.value,
        status: transaction.status,
        resource: unprocessedTransaction
          ? {
              id: unprocessedTransaction.id,
              transactionID: unprocessedTransaction.transactionId ?? undefined,
              bankAccountID: unprocessedTransaction.bankAccountId ?? undefined,
              currency: unprocessedTransaction.currency,
              description: unprocessedTransaction.descriptionDisplay,
              descriptionOriginal: unprocessedTransaction.descriptionOriginal,
              type: unprocessedTransaction.type,
              amount: unprocessedTransaction.amount,
              date: unprocessedTransaction.bookedDate?.toISOString(),
              transactionDate:
                unprocessedTransaction.transactionDate?.toISOString(),
              valueDate: unprocessedTransaction.valueDate?.toISOString(),
              status: unprocessedTransaction.status,
            }
          : undefined,
      };
    }) ?? [];

  return { transactions, nextPageToken: data.nextPageToken };
};

const formatBalance = (balance?: TinkCurrencyDenominatedAmount) => {
  if (!balance) return null;

  return (
    Math.round(
      Number(balance.value?.unscaledValue) *
        Math.pow(10, -Number(balance.value?.scale)) *
        100,
    ) / 100
  );
};

export type TableTransactions = {
  id?: string;
  transactionID?: string;
  bankAccountID?: string;
  currency?: string;
  description?: string;
  descriptionOriginal?: string;
  type: TransactionType;
  amount: number | null;
  date?: string;
  transactionDate?: string;
  valueDate?: string;
  status: TransactionStatus;
};

export type TableBankAccount = {
  name: string | null;
  id: string;
  accountNumber?: string;
  type: BankAccountType;
  bookedBalance: number | null;
  bookedCurrency?: string;
  availableBalance: number | null;
  availableCurrency?: string;
  date: Date;
};

export type FormTableType<TResource> = TResource & {
  resource?: TResource;
};
