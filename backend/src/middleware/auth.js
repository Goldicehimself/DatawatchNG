import User from "../models/User.js";
import { httpError } from "../utils/httpError.js";
import { verifySession } from "../utils/token.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    const session = verifySession(token);

    if (!session?.userId) {
      throw httpError(401, "Authentication required");
    }

    const user = await User.findById(session.userId);

    if (!user) {
      throw httpError(401, "Session user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
