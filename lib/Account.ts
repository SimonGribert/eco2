import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

export const CreateAccount = async (account: Prisma.AccountCreateInput) => {
  const newAccount = await prisma.account.create({
    data: account,
  });

  return newAccount;
};

export const DeleteAccount = async (
  accountUnique: Prisma.AccountWhereUniqueInput
) => {
  await prisma.account.delete({
    where: accountUnique,
  });
};

export const FindAccounts = async (findAccount: Prisma.AccountWhereInput) => {
  const accounts = await prisma.account.findMany({
    where: findAccount,
  });

  return accounts;
};

export const FindAccount = async (provider: string, userId: number) => {
  const accounts = await FindAccounts({
    userId,
    provider,
  });

  if (accounts.length === 0) {
    return null;
  }

  const account = accounts[0];

  const createdAt = account.createdAt;
  const expiredAt = account.expires_at ?? 0;

  const now = new Date();
  const expiryTime = new Date(createdAt.getTime() + expiredAt * 1000);
  const difference = expiryTime.getTime() - now.getTime();

  if (difference <= 0) {
    await DeleteAccount({
      provider_providerAccountId: {
        provider,
        providerAccountId: account.providerAccountId,
      },
    });

    return null;
  }

  return account;
};
