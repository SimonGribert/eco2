-- AlterTable
ALTER TABLE "UnprocessedTransaction" ALTER COLUMN "bookedDate" DROP NOT NULL,
ALTER COLUMN "transactionDate" DROP NOT NULL,
ALTER COLUMN "valueDate" DROP NOT NULL;
