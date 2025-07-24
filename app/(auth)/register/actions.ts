"use server"

import {registerUserSchema} from "@/validation/registerUser";
import {auth} from "@/firebase/server";

export const registerUser = async (data: {
    email: string,
    name: string,
    password: string,
    passwordConfirm: string
}) => {
    const validation = registerUserSchema.safeParse(data);
    if(!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0]?.message ?? "An error occurred while trying to register"
        }
    }

    try {
        await auth.createUser({
            displayName: data.name,
            email: data.email,
            password: data.password
        });
    }
    catch (e: any) {
        return {
            error: true,
            message: e.message ?? "An error occurred while trying to register"
        }
    }

}