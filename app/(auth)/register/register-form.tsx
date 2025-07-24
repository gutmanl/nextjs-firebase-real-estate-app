"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import ContinueWithGoogleButton from "@/components/continue-with-google-button";
import {registerUserSchema} from "@/validation/registerUser";
import {registerUser} from "@/app/(auth)/register/actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();

    const form = useForm<z.infer<typeof registerUserSchema>>(
        {
            resolver: zodResolver(registerUserSchema),
            defaultValues: {
                email: "",
                password: "",
                passwordConfirm: "",
                name: ""
            }
        });

    const handleSubmit = async (data: z.infer<typeof registerUserSchema>) => {
        const response = await registerUser(data);

        if(!!response?.error) {
            toast.error("Error!", {
                description: response.message
            });
            return;
        }

        toast.success("Success!", {
            description: "Registration successful!"
        });
        router.push("/login");

    }

    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset disabled={form.formState.isSubmitting} className={"flex flex-col gap-4"}>
            <FormField control={form.control} name="name" render={({field}) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({field}) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({field}) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type={"password"} placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="passwordConfirm" render={({field}) => (
                <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                        <Input type={"password"} placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <Button type={"submit"}>Register</Button>
            <div className={"text-center"}>or</div>
            </fieldset>
        </form>
        <ContinueWithGoogleButton />
    </Form>)
};