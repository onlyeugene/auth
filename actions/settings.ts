"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from 'bcrypt'
// import { unstable_update} from '@/auth'


export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized user!" };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized user!" };
  }

  if(user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.password = undefined
    values.isTwoFactorEnabled = undefined
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email)

    if(existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use!'}
    }

    const verificationToken = await generateVerificationToken(values.email)

    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return {success: 'Verification Email Sent!'}
  }

  if(values.password && values.newPassword && dbUser.password){
    const passwordsMatch = await bcrypt.compare(values.password, dbUser.password)

    
    if(!passwordsMatch){
      return {error: 'Incorrect Password'}
    }
    
    if (await bcrypt.compare(values.newPassword, dbUser.password)) {
      return { error: "New password cannot be the same as the current password" };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10)
    values.password = hashedPassword
    values.newPassword = undefined
  }


  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...values,
    },
  });

  // unstable_update({
  //   user: {
  //     name: updatedUser.name,
  //     email: updatedUser.email
  //   }
  // })

  return { success: "Settings updated!"}
};
