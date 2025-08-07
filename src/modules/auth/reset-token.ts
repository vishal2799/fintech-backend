import { addMinutes } from "date-fns";
import { resetTokens } from "../../db/schema/resetTokens";
import { db } from "../../db";
import { eq } from "drizzle-orm";

export const insertResetToken = async (identifier: string, token: string) => {
  await db.insert(resetTokens).values({
    identifier,
    token,
    expiresAt: addMinutes(new Date(), 10),
  });
};

export const invalidateResetToken = async (token: string) => {
  await db.delete(resetTokens).where(eq(resetTokens.token, token));
};
