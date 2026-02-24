/*
  Warnings:

  - You are about to drop the column `referralUrl` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_referralUrl_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "referralUrl",
ADD COLUMN     "referralCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
