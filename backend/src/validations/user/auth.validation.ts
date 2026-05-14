import { z } from "zod";

export const signupSchema = z.object({
    body: z.object({
        firstName: z.string().min(2, "First name must be at least 2 characters").max(255, "First name cannot exceed 255 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters").max(255, "Last name cannot exceed 255 characters"),
        userName: z.string().min(3, "User name must be at least 3 characters").max(255, "User name cannot exceed 255 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password cannot exceed 255 characters"),
        countryCode: z.string().min(2, "Country code must be at least 2 characters").max(5, "Country code cannot exceed 10 characters"),
        mobile: z.string().min(10, "Mobile number must be at least 10 characters").max(10, "Mobile number cannot exceed 10 digits").regex(/^[0-9]+$/, "Mobile number must contain only digits"),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password cannot exceed 255 characters"),
    }),
});

export const updateProfileSchema = z.object({
    body: z.object({
        firstName: z.string().min(2, "First name must be at least 2 characters").max(255, "First name cannot exceed 255 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters").max(255, "Last name cannot exceed 255 characters"),
        userName: z.string().min(3, "User name must be at least 3 characters").max(255, "User name cannot exceed 255 characters"),
        email: z.string().email("Invalid email address"),
        countryCode: z.string().min(2, "Country code must be at least 2 characters").max(5, "Country code cannot exceed 10 characters"),
        mobile: z.string().min(10, "Mobile number must be at least 10 characters").max(10, "Mobile number cannot exceed 10 digits").regex(/^[0-9]+$/, "Mobile number must contain only digits"),
        whatsAppNumberCountryCode: z.string().min(2, "Country code must be at least 2 characters").max(5, "Country code cannot exceed 10 characters").optional(),
        whatsAppNumber: z.string().min(10, "Mobile number must be at least 10 characters").max(10, "Mobile number cannot exceed 10 digits").regex(/^[0-9]+$/, "Mobile number must contain only digits").optional(),
        gender: z.string().min(2, "Gender must be at least 2 characters").max(255, "Gender cannot exceed 255 characters").optional(),
        profilePicture: z.string().min(2, "Profile picture must be at least 2 characters").max(255, "Profile picture cannot exceed 255 characters").optional(),
        country: z.string().min(2, "Country must be at least 2 characters").max(255, "Country cannot exceed 255 characters").optional(),
        state: z.string().min(2, "State must be at least 2 characters").max(255, "State cannot exceed 255 characters").optional(),
        city: z.string().min(2, "City must be at least 2 characters").max(255, "City cannot exceed 255 characters").optional(),
        role: z.string().min(2, "Role must be at least 2 characters").max(255, "Role cannot exceed 255 characters").optional(),
        isActive: z.boolean().optional()
    }),
});

export const updatePasswordSchema = z.object({
    body: z.object({
        password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password cannot exceed 255 characters"),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
    }),
});

export default {
    signupSchema,
    loginSchema,
    updateProfileSchema,
    updatePasswordSchema,
    forgotPasswordSchema
};
