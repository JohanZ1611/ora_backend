import type { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../config/supabase";
import { prisma } from "../config/prisma";
import { AppError } from "./error.middleware";

export interface AuthRequest extends Request {
  userId?: string;
  supabaseId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Token no proporcionado", 401);
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      throw new AppError("Token inválido o expirado", 401);
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId: data.user.id },
    });

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    req.userId = user.id;
    req.supabaseId = data.user.id;

    next();
  } catch (err) {
    next(err);
  }
};