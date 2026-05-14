import { z } from "zod";


export const signupSchema = z.object({
    body: z.object({
        firstName: z.string().min(2, "First name must be at least 2 characters").max(255, "First name cannot exceed 255 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters").max(255, "Last name cannot exceed 255 characters"),
        userName: z.string().min(3, "User name must be at least 3 characters").max(255, "User name cannot exceed 255 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password cannot exceed 255 characters"),
        countryCode: z.string().min(2, "Country code must be at least 2 characters").max(5, "Country code cannot exceed 10 characters"),
        mobile: z.string().min(10, "Mobile number must be at least 10 characters").max(15, "Mobile number cannot exceed 10 characters"),
    }),
});


export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password cannot exceed 255 characters"),
    }),
});


export default {
    signupSchema,
    loginSchema
};
