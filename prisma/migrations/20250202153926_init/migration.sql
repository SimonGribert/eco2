-- AlterTable
ALTER TABLE "BankAccount" ALTER COLUMN "availableBalance" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "bookedBalance" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "BankAccountHistory" ALTER COLUMN "availableBalance" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "bookedBalance" SET DATA TYPE DOUBLE PRECISION;
