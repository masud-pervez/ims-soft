import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { UserRoles } from "../enums/userRoles.js";
import { OrderTypes } from "../enums/orderTypes.js";

export const getSeedData = async () => {
  const hashedPassword = await bcrypt.hash("12345678", 10);

  const users = [
    {
      id: uuidv4(),
      username: "superadmin",
      email: "superadmin@gmail.com",
      password: hashedPassword,
      role: UserRoles.SUPER_ADMIN,
      permissions: JSON.stringify({ all: true }),
    },
    {
      id: uuidv4(),
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: UserRoles.ADMIN,
      permissions: JSON.stringify({
        manage_users: true,
        manage_products: true,
      }),
    },
    {
      id: uuidv4(),
      username: "staff",
      email: "staff@gmail.com",
      password: hashedPassword,
      role: UserRoles.STAFF,
      permissions: JSON.stringify({ view_products: true, create_orders: true }),
    },
  ];

  const categories = [
    { id: uuidv4(), name: "Electronics" },
    { id: uuidv4(), name: "Clothing" },
    { id: uuidv4(), name: "Groceries" },
  ];

  const products = [
    {
      id: uuidv4(),
      name: "Laptop X1",
      category_id: categories[0].id,
      purchase_price: 800.0,
      sale_price: 1200.0,
      stock_quantity: 50,
    },
    {
      id: uuidv4(),
      name: "Generic T-Shirt",
      category_id: categories[1].id,
      purchase_price: 5.0,
      sale_price: 15.0,
      stock_quantity: 200,
    },
  ];

  const customers = [
    {
      id: uuidv4(),
      name: "John Doe",
      phone: "1234567890",
      email: "john@gmail.com",
    },
    {
      id: uuidv4(),
      name: "Jane Smith",
      phone: "0987654321",
      email: "jane@gmail.com",
    },
  ];

  const suppliers = [
    {
      id: uuidv4(),
      name: "Global Tech Suppliers",
      phone: "1122334455",
      email: "supply@tech.com",
    },
  ];

  // Sample Order
  const orders = [
    {
      id: uuidv4(),
      type: OrderTypes.SALE,
      customer_id: customers[0].id,
      total_amount: 1200.0,
      order_items: [
        {
          id: uuidv4(),
          product_id: products[0].id,
          quantity: 1,
          price: 1200.0,
          total: 1200.0,
        },
      ],
    },
  ];

  const expenses = [
    {
      id: uuidv4(),
      category: "Rent",
      amount: 1500.0,
    },
    {
      id: uuidv4(),
      category: "Utilities",
      amount: 300.0,
    },
  ];

  const income = [
    {
      id: uuidv4(),
      source: "Investments",
      amount: 5000.0,
    },
  ];

  return {
    users,
    categories,
    products,
    customers,
    suppliers,
    orders,
    expenses,
    income,
  };
};
