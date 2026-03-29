import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpia datos existentes en orden correcto
  await prisma.transaction.deleteMany();
  await prisma.group.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.debt.deleteMany();
  await prisma.todo.deleteMany();

  // Busca el usuario de prueba
  const user = await prisma.user.findUnique({
    where: { email: "johan@test.com" },
  });

  if (!user) {
    console.error("❌ Usuario johan@test.com no encontrado. Regístralo primero via API.");
    process.exit(1);
  }

  console.log(`✅ Usuario encontrado: ${user.name}`);

  // Transacciones
  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        type: "INCOME",
        frequency: "MONTHLY",
        amount: 3500000,
        category: "Salario",
        description: "Salario AssetMinder",
        date: new Date("2026-03-01"),
        reminderOn: false,
      },
      {
        userId: user.id,
        type: "INCOME",
        frequency: "ONCE",
        amount: 800000,
        category: "Freelance",
        description: "Proyecto web cliente",
        date: new Date("2026-03-10"),
        reminderOn: false,
      },
      {
        userId: user.id,
        type: "EXPENSE",
        frequency: "MONTHLY",
        amount: 650000,
        category: "Hogar",
        description: "Arriendo",
        date: new Date("2026-03-05"),
        dueDate: new Date("2026-04-05"),
        reminderOn: true,
      },
      {
        userId: user.id,
        type: "EXPENSE",
        frequency: "MONTHLY",
        amount: 85000,
        category: "Servicios",
        description: "Internet + TV",
        date: new Date("2026-03-08"),
        dueDate: new Date("2026-04-08"),
        reminderOn: true,
      },
      {
        userId: user.id,
        type: "EXPENSE",
        frequency: "ONCE",
        amount: 45000,
        category: "Comida",
        description: "Mercado semanal",
        date: new Date("2026-03-07"),
        reminderOn: false,
      },
      {
        userId: user.id,
        type: "EXPENSE",
        frequency: "ONCE",
        amount: 32000,
        category: "Transporte",
        description: "Recarga transporte",
        date: new Date("2026-03-09"),
        reminderOn: false,
      },
      {
        userId: user.id,
        type: "EXPENSE",
        frequency: "MONTHLY",
        amount: 37900,
        category: "Ocio",
        description: "Netflix",
        date: new Date("2026-03-15"),
        dueDate: new Date("2026-04-15"),
        reminderOn: true,
      },
      {
        userId: user.id,
        type: "EXPENSE",
        frequency: "ONCE",
        amount: 120000,
        category: "Salud",
        description: "Consulta médica",
        date: new Date("2026-03-20"),
        reminderOn: false,
      },
      {
        userId: user.id,
        type: "EXPENSE",
        frequency: "ONCE",
        amount: 280000,
        category: "Ropa",
        description: "Tenis nuevos",
        date: new Date("2026-03-22"),
        reminderOn: false,
      },
      {
        userId: user.id,
        type: "INCOME",
        frequency: "ONCE",
        amount: 200000,
        category: "Otro",
        description: "Venta artículo usado",
        date: new Date("2026-02-15"),
        reminderOn: false,
      },
      {
        userId: user.id,
        type: "EXPENSE",
        frequency: "ONCE",
        amount: 55000,
        category: "Comida",
        description: "Restaurante cumpleaños",
        date: new Date("2026-02-20"),
        reminderOn: false,
      },
      {
        userId: user.id,
        type: "INCOME",
        frequency: "MONTHLY",
        amount: 3500000,
        category: "Salario",
        description: "Salario AssetMinder",
        date: new Date("2026-02-01"),
        reminderOn: false,
      },
    ],
  });

  console.log("✅ Transacciones creadas");

  // Grupo
  const group = await prisma.group.create({
    data: {
      userId: user.id,
      name: "Tienda Don Jorge",
      type: "EXPENSE",
      category: "Mercado",
      dueDate: new Date("2026-04-30"),
      reminderOn: true,
      description: "Fiado mensual mercado",
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        groupId: group.id,
        type: "EXPENSE",
        frequency: "ONCE",
        amount: 25000,
        category: "Mercado",
        description: "Aceite y arroz",
        date: new Date("2026-03-12"),
        reminderOn: true,
        dueDate: new Date("2026-04-30"),
      },
      {
        userId: user.id,
        groupId: group.id,
        type: "EXPENSE",
        frequency: "ONCE",
        amount: 18000,
        category: "Mercado",
        description: "Azúcar y café",
        date: new Date("2026-03-18"),
        reminderOn: true,
        dueDate: new Date("2026-04-30"),
      },
      {
        userId: user.id,
        groupId: group.id,
        type: "EXPENSE",
        frequency: "ONCE",
        amount: 32000,
        category: "Mercado",
        description: "Varios",
        date: new Date("2026-03-25"),
        reminderOn: true,
        dueDate: new Date("2026-04-30"),
      },
    ],
  });

  console.log("✅ Grupo y transacciones de grupo creadas");

  // Presupuestos
  await prisma.budget.createMany({
    data: [
      { userId: user.id, category: "Comida", limitAmount: 300000, month: 3, year: 2026 },
      { userId: user.id, category: "Transporte", limitAmount: 150000, month: 3, year: 2026 },
      { userId: user.id, category: "Ocio", limitAmount: 100000, month: 3, year: 2026 },
      { userId: user.id, category: "Salud", limitAmount: 200000, month: 3, year: 2026 },
      { userId: user.id, category: "Mercado", limitAmount: 400000, month: 3, year: 2026 },
    ],
  });

  console.log("✅ Presupuestos creados");

  // Metas
  await prisma.goal.createMany({
    data: [
      {
        userId: user.id,
        name: "Laptop nueva",
        targetAmount: 2000000,
        savedAmount: 500000,
        deadline: new Date("2026-12-31"),
      },
      {
        userId: user.id,
        name: "Fondo de emergencia",
        targetAmount: 5000000,
        savedAmount: 1200000,
        deadline: new Date("2026-12-31"),
      },
      {
        userId: user.id,
        name: "Viaje a Bogotá",
        targetAmount: 800000,
        savedAmount: 800000,
      },
    ],
  });

  console.log("✅ Metas creadas");

  // Deudas
  await prisma.debt.createMany({
    data: [
      {
        userId: user.id,
        name: "Tarjeta de crédito",
        totalAmount: 800000,
        paidAmount: 200000,
        dueDate: new Date("2026-04-15"),
        reminderOn: true,
      },
      {
        userId: user.id,
        name: "Préstamo familiar",
        totalAmount: 1500000,
        paidAmount: 500000,
        dueDate: new Date("2026-06-30"),
        reminderOn: false,
      },
    ],
  });

  console.log("✅ Deudas creadas");

  // To-dos
  await prisma.todo.createMany({
    data: [
      {
        userId: user.id,
        title: "Pagar arriendo",
        date: new Date("2026-04-05"),
        done: false,
      },
      {
        userId: user.id,
        title: "Revisar extracto tarjeta",
        date: new Date("2026-03-29"),
        done: false,
      },
      {
        userId: user.id,
        title: "Transferir a fondo de emergencia",
        date: new Date("2026-03-29"),
        done: false,
      },
      {
        userId: user.id,
        title: "Pagar Netflix",
        date: new Date("2026-04-15"),
        done: false,
      },
      {
        userId: user.id,
        title: "Cobrar proyecto freelance",
        date: new Date("2026-04-01"),
        done: false,
      },
    ],
  });

  console.log("✅ To-dos creados");
  console.log("🎉 Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });