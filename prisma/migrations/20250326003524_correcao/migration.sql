/*
  Warnings:

  - The values [PENDENTE] on the enum `statusOccurrence` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `cpf` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(14)`.
  - You are about to alter the column `telephone` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - Added the required column `addressBai` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressCEP` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressCit` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressComp` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressEst` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressFull` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLog` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressNum` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "statusOccurrence_new" AS ENUM ('REGISTRADO', 'ATENDENDO', 'FINALIZADO');
ALTER TABLE "Occurrence" ALTER COLUMN "statusOccurrence" DROP DEFAULT;
ALTER TABLE "Occurrence" ALTER COLUMN "statusOccurrence" TYPE "statusOccurrence_new" USING ("statusOccurrence"::text::"statusOccurrence_new");
ALTER TYPE "statusOccurrence" RENAME TO "statusOccurrence_old";
ALTER TYPE "statusOccurrence_new" RENAME TO "statusOccurrence";
DROP TYPE "statusOccurrence_old";
ALTER TABLE "Occurrence" ALTER COLUMN "statusOccurrence" SET DEFAULT 'REGISTRADO';
COMMIT;

-- AlterTable
ALTER TABLE "Occurrence" ALTER COLUMN "statusOccurrence" SET DEFAULT 'REGISTRADO';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
ADD COLUMN     "addressBai" TEXT NOT NULL,
ADD COLUMN     "addressCEP" TEXT NOT NULL,
ADD COLUMN     "addressCit" TEXT NOT NULL,
ADD COLUMN     "addressComp" TEXT NOT NULL,
ADD COLUMN     "addressEst" TEXT NOT NULL,
ADD COLUMN     "addressFull" TEXT NOT NULL,
ADD COLUMN     "addressLog" TEXT NOT NULL,
ADD COLUMN     "addressNum" TEXT NOT NULL,
ALTER COLUMN "cpf" SET DATA TYPE VARCHAR(14),
ALTER COLUMN "telephone" SET DATA TYPE VARCHAR(15);
