import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterPayload } from "@/types/api";
import { Role } from "@prisma/client";

import { withApiLogger } from "@/lib/api-logger";

async function registerHandler(req: Request) {
  try {
    const body: RegisterPayload = await req.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Simple username generation strategy
    const username =
      name.toLowerCase().replace(/\s/g, "") + Math.floor(Math.random() * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        role: (role as Role) || Role.STAFF,
        permissions: {},
      },
    });

    const { password: userPassword, ...userWithoutPassword } = user;
    void userPassword;

    return NextResponse.json({
      message: "User created successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    // Logger handles generic error logging, but we ensure specific response
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     description: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [STAFF, SUPER_ADMIN, ADMIN]
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Missing fields or user exists
 *       500:
 *         description: Server error
 */
export const POST = withApiLogger(registerHandler, "Register");
