"use server";

import { auth } from "@/auth";
import { FindAccount } from "@/lib/Account";
import {
  TinkCurrencyDenominatedAmount,
  TinkListAccountsResponse,
  TinkListTransactionsResponse,
} from "@/types/tink";

export const fetchBankAccounts = async () => {
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

  return (
    data.accounts?.map((acc) => ({
      name: acc.name,
      id: acc.id,
      date: acc.dates.lastRefreshed,
      type: acc.type,
      accountNumber: acc.identifiers?.financialInstitution?.accountNumber,
      bookedBalance: formatBalance(acc.balances?.booked?.amount),
      bookedCurrency: acc.balances?.booked?.amount?.currencyCode,
      availableBalance: formatBalance(acc.balances?.available?.amount),
      availableCurrency: acc.balances?.available?.amount?.currencyCode,
    })) ?? []
  );
};

export const fetchTransactions = async (pageToken: string | null) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { transactions: [], nextPageToken: null };

  const account = await FindAccount("tink", Number(userId));

  if (!account) {
    return { transactions: [], nextPageToken: null };
  }

  const accessToken = account.access_token;
  const query = pageToken ? `?pageToken=${pageToken}` : "";

  const response = await fetch(
    `https://api.tink.com/data/v2/transactions${query}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data: TinkListTransactionsResponse = await response.json();

  const transactions =
    data.transactions?.map((transaction) => ({
      id: transaction.id,
      description: transaction.descriptions?.display,
      amount: formatBalance(transaction.amount),
      date: transaction.dates?.booked,
      status: transaction.status,
    })) ?? [];

  return { transactions, nextPageToken: data.nextPageToken };
};

const formatBalance = (balance?: TinkCurrencyDenominatedAmount) => {
  if (!balance) return null;

  return (
    Math.round(
      Number(balance.value?.unscaledValue) *
        Math.pow(10, -Number(balance.value?.scale)) *
        100
    ) / 100
  );
};
