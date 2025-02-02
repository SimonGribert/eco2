-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('UNDEFINED', 'SAVINGS', 'CHECKING', 'CREDIT_CARD');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('UNDEFINED', 'PENDING', 'BOOKED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('UNDEFINED', 'CREDIT_CARD', 'PAYMENT', 'WITHDRAWAL', 'DEFAULT', 'TRANSFER');

-- AlterTable
ALTER TABLE "Session" ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken");

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BankAccountType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "availableBalance" INTEGER NOT NULL,
    "availableCurrency" TEXT NOT NULL,
    "bookedBalance" INTEGER NOT NULL,
    "bookedCurrency" TEXT NOT NULL,
    "refreshedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccountHistory" (
    "id" TEXT NOT NULL,
    "refreshedAt" TIMESTAMP(3) NOT NULL,
    "availableBalance" INTEGER NOT NULL,
    "availableCurrency" TEXT NOT NULL,
    "bookedBalance" INTEGER NOT NULL,
    "bookedCurrency" TEXT NOT NULL,

    CONSTRAINT "BankAccountHistory_pkey" PRIMARY KEY ("id","refreshedAt")
);

-- CreateTable
CREATE TABLE "UnprocessedTransaction" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "descriptionOriginal" TEXT NOT NULL,
    "descriptionDisplay" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "type" "TransactionType" NOT NULL,
    "bookedDate" TIMESTAMP(3) NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "valueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnprocessedTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_id_key" ON "BankAccount"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UnprocessedTransaction_id_key" ON "UnprocessedTransaction"("id");

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccountHistory" ADD CONSTRAINT "BankAccountHistory_id_fkey" FOREIGN KEY ("id") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnprocessedTransaction" ADD CONSTRAINT "UnprocessedTransaction_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnprocessedTransaction" ADD CONSTRAINT "UnprocessedTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
