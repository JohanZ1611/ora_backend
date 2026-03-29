import type { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../config/supabase";
import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body as RegisterInput;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) throw new AppError(error.message, 400);

    const user = await prisma.user.create({
      data: {
        supabaseId: data.user.id,
        email,
        name,
      },
    });

    return res.status(201).json({
      ok: true,
      message: "Usuario registrado exitosamente",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as LoginInput;

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new AppError("Credenciales inválidas", 401);

    return res.json({
      ok: true,
      message: "Sesión iniciada exitosamente",
      data: {
        token: data.session.access_token,
        refreshToken: data.session.refresh_token,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (token) {
      await supabaseAdmin.auth.admin.signOut(token);
    }

    return res.json({
      ok: true,
      message: "Sesión cerrada exitosamente",
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        currency: true,
        themeConfig: true,
        createdAt: true,
      },
    });

    if (!user) throw new AppError("Usuario no encontrado", 404);

    return res.json({
      ok: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};