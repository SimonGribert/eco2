/*
  Warnings:

  - You are about to alter the column `availableBalance` on the `BankAccount` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,2)`.
  - You are about to alter the column `bookedBalance` on the `BankAccount` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,2)`.
  - You are about to alter the column `availableBalance` on the `BankAccountHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,2)`.
  - You are about to alter the column `bookedBalance` on the `BankAccountHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,2)`.
  - You are about to alter the column `amount` on the `UnprocessedTransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,2)`.

*/
-- AlterTable
ALTER TABLE "BankAccount" ALTER COLUMN "availableBalance" SET DATA TYPE DECIMAL(65,2),
ALTER COLUMN "bookedBalance" SET DATA TYPE DECIMAL(65,2);

-- AlterTable
ALTER TABLE "BankAccountHistory" ALTER COLUMN "availableBalance" SET DATA TYPE DECIMAL(65,2),
ALTER COLUMN "bookedBalance" SET DATA TYPE DECIMAL(65,2);

-- AlterTable
ALTER TABLE "UnprocessedTransaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,2);
