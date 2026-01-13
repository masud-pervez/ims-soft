import { PrismaClient, Role, OrderType, ProductStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database state...");
  const userCount = await prisma.user.count();

  if (userCount > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  console.log("Seeding database...");
  const hashedPassword = await bcrypt.hash("12345678", 10);

  // 1. Users
  console.log("Seeding Users...");
  await prisma.user.createMany({
    data: [
      {
        username: "superadmin",
        email: "superadmin@gmail.com",
        password: hashedPassword,
        // name: "Super Admin",
        role: Role.SUPER_ADMIN,
        permissions: { all: true },
      },
      {
        username: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        // name: "Admin User",
        role: Role.ADMIN,
        permissions: {
          manage_users: true,
          manage_products: true,
        },
      },
      {
        username: "staff",
        email: "staff@gmail.com",
        password: hashedPassword,
        // name: "Staff User",
        role: Role.STAFF,
        permissions: { view_products: true, create_orders: true },
      },
    ],
  });

  // 2. Categories
  console.log("Seeding Categories...");
  const catElectronics = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Electronic gadgets and devices",
    },
  });
  const catClothing = await prisma.category.create({
    data: { name: "Clothing", description: "Apparel and fashion" },
  });
  const catGroceries = await prisma.category.create({
    data: { name: "Groceries", description: "Daily essentials" },
  });

  // 3. Products
  console.log("Seeding Products...");
  const productLaptop = await prisma.product.create({
    data: {
      name: "Laptop X1",
      sku: "LPT-X1",
      price: 1200.0,
      costPrice: 800.0, // purchase_price
      stock: 50, // stock_quantity
      minStock: 5,
      categoryId: catElectronics.id,
      status: ProductStatus.active,
    },
  });

  const productTShirt = await prisma.product.create({
    data: {
      name: "Generic T-Shirt",
      sku: "TSH-001",
      price: 15.0, // sale_price
      costPrice: 5.0, // purchase_price
      stock: 200,
      minStock: 20,
      categoryId: catClothing.id,
      status: ProductStatus.active,
    },
  });

  // 4. Customers
  console.log("Seeding Customers...");
  const custJohn = await prisma.customer.create({
    data: {
      name: "John Doe",
      phone: "1234567890",
      email: "john@gmail.com",
    },
  });
  await prisma.customer.create({
    data: {
      name: "Jane Smith",
      phone: "0987654321",
      email: "jane@gmail.com",
    },
  });

  // 5. Suppliers
  console.log("Seeding Suppliers...");
  await prisma.supplier.create({
    data: {
      name: "Global Tech Suppliers",
      phone: "1122334455",
      email: "supply@tech.com",
    },
  });

  // 6. Orders
  console.log("Seeding Orders...");
  await prisma.order.create({
    data: {
      type: OrderType.SALE,
      customerId: custJohn.id,
      totalAmount: 1200.0,
      items: {
        create: [
          {
            productId: productLaptop.id,
            quantity: 1,
            price: 1200.0,
            total: 1200.0,
          },
        ],
      },
    },
  });

  // 7. Expenses
  console.log("Seeding Expenses...");
  await prisma.expense.createMany({
    data: [
      {
        category: "Rent",
        amount: 1500.0,
        date: new Date(),
      },
      {
        category: "Utilities",
        amount: 300.0,
        date: new Date(),
      },
    ],
  });

  // 8. Income
  console.log("Seeding Income...");
  await prisma.income.create({
    data: {
      source: "Investments",
      amount: 5000.0,
      date: new Date(),
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
