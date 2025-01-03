/*
  Warnings:

  - You are about to drop the `ClausesOnContracts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClausesOnContracts" DROP CONSTRAINT "ClausesOnContracts_clauseId_fkey";

-- DropForeignKey
ALTER TABLE "ClausesOnContracts" DROP CONSTRAINT "ClausesOnContracts_contractId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_employeeId_fkey";

-- DropTable
DROP TABLE "ClausesOnContracts";

-- CreateTable
CREATE TABLE "ContractClause" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "clauseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ContractClause_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractClause" ADD CONSTRAINT "ContractClause_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractClause" ADD CONSTRAINT "ContractClause_clauseId_fkey" FOREIGN KEY ("clauseId") REFERENCES "Clause"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
