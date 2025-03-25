-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADM', 'USR', 'SUPPORT');

-- CreateEnum
CREATE TYPE "statusOccurrence" AS ENUM ('PENDENTE', 'ATENDENDO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "statusIncidentResponse" AS ENUM ('INICIO', 'COMUNICACAO', 'OBSERVACAO', 'LIGACAO', 'FINALIZACAO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "Role" NOT NULL DEFAULT 'USR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Master" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "matricula" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "createdNewUser" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" INTEGER,

    CONSTRAINT "Master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "placa" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occurrence" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Informante" INTEGER NOT NULL,
    "natOco" TEXT NOT NULL,
    "geoLat" INTEGER,
    "geoLong" INTEGER,
    "addressLong" TEXT,
    "addressNum" TEXT,
    "addressLog" TEXT,
    "addressBairro" TEXT,
    "addressCity" TEXT,
    "addressState" TEXT,
    "addressCEP" TEXT,
    "addressComp" TEXT,
    "addressDescr" TEXT NOT NULL,
    "statusOccurrence" "statusOccurrence" NOT NULL DEFAULT 'PENDENTE',

    CONSTRAINT "Occurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentResponse" (
    "id" SERIAL NOT NULL,
    "dateInit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atendente" INTEGER NOT NULL,
    "occurrenceId" INTEGER NOT NULL,
    "vehicleId" INTEGER,
    "dateStartDisplacement" TIMESTAMP(3),
    "dateArrivalOccurrence" TIMESTAMP(3),
    "arrivalHospital" TIMESTAMP(3),
    "dateReturn" TIMESTAMP(3),

    CONSTRAINT "IncidentResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incidentResponseId" INTEGER NOT NULL,
    "statusIncidentResponse" "statusIncidentResponse" NOT NULL,
    "description" TEXT,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Master_userId_key" ON "Master"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Master_matricula_key" ON "Master"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_placa_key" ON "Vehicle"("placa");

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_Informante_fkey" FOREIGN KEY ("Informante") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentResponse" ADD CONSTRAINT "IncidentResponse_atendente_fkey" FOREIGN KEY ("atendente") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentResponse" ADD CONSTRAINT "IncidentResponse_occurrenceId_fkey" FOREIGN KEY ("occurrenceId") REFERENCES "Occurrence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentResponse" ADD CONSTRAINT "IncidentResponse_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_incidentResponseId_fkey" FOREIGN KEY ("incidentResponseId") REFERENCES "IncidentResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
