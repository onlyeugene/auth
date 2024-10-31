import { UserRole } from '@prisma/client';
import * as z from 'zod';


export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled : z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().min(6)),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6))
})
.refine((data) => {
  // if (data.isTwoFactorEnabled) {
  //   return true;
  //   }
  if(data.password && !data.newPassword){
    return false
  }
  // if(data.newPassword && !data.password){
  //   return false
  // }

  return true;
}, {
  message: 'New password is required!',
  path: ['newPassword']
})

//OR YOU CAN ADD THIS FOR MORE REFINEMENT  see 7:09:58 of the video to understand.
.refine((data) => {
  // if (data.isTwoFactorEnabled) {
  //   return true;
  //   }
  if(data.newPassword && !data.password){
    return false
  }

  return true;
}, {
  message: 'Password is required!',
  path: ['password']
})


export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
});
export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  })
});
export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string())
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
  name: z.string().min(1, {
    message: 'Name is required'
  }),
});
