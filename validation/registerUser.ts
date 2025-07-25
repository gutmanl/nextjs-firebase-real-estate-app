import z from "zod";

export const passwordSchema = z.string().refine(
    (password) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(password);
    },
    {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 6 characters long"
    }
);

export const registerUserSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: passwordSchema,
    passwordConfirm: z.string()
}).refine(
    (data) => data.password === data.passwordConfirm,
    {
        message: "Passwords don't match",
        path: ["passwordConfirm"]
    }
);