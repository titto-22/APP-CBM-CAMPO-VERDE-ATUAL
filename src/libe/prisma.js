const { PrismaClient } = require("@prisma/client/extension");

const prisma = new PrismaClient({ log: ["query"] });
module.exports = { prisma };