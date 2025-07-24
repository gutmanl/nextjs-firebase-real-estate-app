"use client"

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import ContinueWithGoogleButton from "@/components/continue-with-google-button";
import Link from "next/link";
import {useAuth} from "@/context/auth";
import {toast} from "sonner";
import {useRouter} from "next/navigation";


//The course's solution applies the password validation from the register form
//here as well. I don't think that makes sense, and it's also pretty uncommon
//in real apps. So I'm leaving it out.
const formSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export default function LoginForm() {
    const auth = useAuth();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

/* <<<<<<<<<<<<<<  ✨ Windsurf Command ⭐ >>>>>>>>>>>>>>>> */
    /**
     * Handles the form submission for logging in a user.
     *
     * @param data - The form data containing user's email and password based on `formSchema`.
     *
     * Attempts to authenticate the user using email and password.
     * If authentication fails, it displays an error toast with a relevant message.
     */

/* <<<<<<<<<<  c1feff66-b3cb-4057-b2bf-0dde46883f70  >>>>>>>>>>> */
    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await auth?.loginWithEmailAndPassword(data.email, data.password);
            router.refresh();

        } catch (e: any) {
            toast.error("Error!", {
                description: e.code === "auth/invalid-credential" ? "Invalid email or password" : "An error occurred while trying to log in"
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <fieldset disabled={form.formState.isSubmitting} className={"flex flex-col gap-4"}>
                <FormField control={form.control} name={"email"} render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder={"Email"}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <FormField control={form.control} name={"password"} render={({field}) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder={"Password"} type={"password"}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <Button type={"submit"}>Log In</Button>
                <div>
                    Forgotten your password? <Link href={"/forgot-password"} className={"pl-2 underline"}>Reset it here</Link>
                </div>
                <div className={"text-center pb-5"}>or</div>
                </fieldset>
            </form>
            <ContinueWithGoogleButton />
        </Form>
    )
}