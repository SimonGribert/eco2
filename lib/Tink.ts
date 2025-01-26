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
      bookedBalance: formatBalance(acc.balances?.booked?.amount),
      availableBalance: formatBalance(acc.balances?.available?.amount),
    })) ?? []
  );
};

export const fetchTransactions = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return [];

  const account = await FindAccount("tink", Number(userId));

  if (!account) {
    return [];
  }

  const accessToken = account.access_token;

  const response = await fetch("https://api.tink.com/data/v2/transactions", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data: TinkListTransactionsResponse = await response.json();

  console.log(JSON.stringify(data));

  return (
    data.transactions?.map((transaction) => ({
      id: transaction.id,
      description: transaction.descriptions?.display,
      amount: formatBalance(transaction.amount),
      date: transaction.dates?.booked,
      status: transaction.status,
    })) ?? []
  );
};

const formatBalance = (balance?: TinkCurrencyDenominatedAmount) => {
  if (!balance) return null;

  return `${
    Number(balance.value?.unscaledValue) * (10 ^ -Number(balance.value?.scale))
  } ${balance.currencyCode}`;
};
