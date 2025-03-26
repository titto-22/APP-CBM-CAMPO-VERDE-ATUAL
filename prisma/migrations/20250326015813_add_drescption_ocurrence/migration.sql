/*
  Warnings:

  - You are about to drop the column `Informante` on the `Occurrence` table. All the data in the column will be lost.
  - You are about to drop the column `addressDescr` on the `Occurrence` table. All the data in the column will be lost.
  - Added the required column `Description` to the `Occurrence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `informant` to the `Occurrence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Occurrence" DROP CONSTRAINT "Occurrence_Informante_fkey";

-- AlterTable
ALTER TABLE "Occurrence" DROP COLUMN "Informante",
DROP COLUMN "addressDescr",
ADD COLUMN     "Description" TEXT NOT NULL,
ADD COLUMN     "informant" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_informant_fkey" FOREIGN KEY ("informant") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
