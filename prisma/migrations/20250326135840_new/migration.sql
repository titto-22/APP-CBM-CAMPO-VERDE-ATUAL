/*
  Warnings:

  - You are about to drop the column `Description` on the `Occurrence` table. All the data in the column will be lost.
  - You are about to drop the column `addressLong` on the `Occurrence` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `description` to the `Occurrence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Occurrence" DROP COLUMN "Description",
DROP COLUMN "addressLong",
ADD COLUMN     "addressFull" TEXT,
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "description";
