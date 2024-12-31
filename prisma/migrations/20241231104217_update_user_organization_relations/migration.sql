/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Clause` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,userId]` on the table `Clause` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Clause" DROP CONSTRAINT "Clause_organizationId_fkey";

-- DropIndex
DROP INDEX "Clause_title_userId_organizationId_key";

-- AlterTable
ALTER TABLE "Clause" DROP COLUMN "organizationId";

-- CreateIndex
CREATE UNIQUE INDEX "Clause_title_userId_key" ON "Clause"("title", "userId");
