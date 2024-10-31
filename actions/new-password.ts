"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";
import bcrypt from 'bcryptjs'
import { z } from "zod";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  
    if(!token) {
        return{error : 'Missing token!'}
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if(!validatedFields.success){
        return{
            error: 'Invalid fields!'
        }
    }

    const { password } = validatedFields.data;

    const existingToken = await getPasswordResetTokenByToken(token)

    if(!existingToken) {
        return{
            error: 'Token does not exist'
        }
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date();

    if(hasExpired){
        return {
            error: 'Token has expired!'
        }
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if(!existingUser){
        return {
            error: 'Email does not exist!'
        }
    }

    // Check if the new password matches the previous password
    // const isSameAsOldPassword = await bcrypt.compare(password, existingUser.password);
    // if(isSameAsOldPassword) {
    //     return { error: 'You cannot use a previous password' };
    // }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(password, 10)

    // Delete the password reset token after successful update
    await prisma.user.update({
        where: { id: existingUser.id},
        data: {password: hashedPassword}
    });

    await prisma.passwordResetToken.delete({
        where: {
            id: existingToken.id
        }
    })

    return {
        success: 'Password updated successfully'
    }
};
