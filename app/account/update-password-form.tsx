"use client"

import {z} from "zod";
import {passwordSchema} from "@/validation/registerUser";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/context/auth";
import {EmailAuthProvider, reauthenticateWithCredential, updatePassword} from "@firebase/auth";
import {toast} from "sonner";

const formSchema = z.object({
    //The course uses the password schema for the current password too.
    //I think that's nonsense because that would prevent an invalid password
    //from being changed, especially if the password criteria ever change.
    currentPassword: z.string(),
    newPassword: passwordSchema,
    newPasswordConfirm: z.string()

}).superRefine((data, ctx) => {
    if (data.newPassword !== data.newPasswordConfirm) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords don't match",
            path: ["newPasswordConfirm"]
        })
    }
})

export default function UpdatePasswordForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            newPasswordConfirm: ""
        }
    });

    const auth = useAuth();

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const user = auth?.currentUser;
        if(!user?.email) {
            return;
        }

        try {
            await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, data.currentPassword));
            await updatePassword(user, data.newPassword);
            toast.success("Password updated successfully");
            form.reset();
        }
        catch(e: any) {
            toast.error((e?.code ?? "") === "auth/invalid-credential" ? "Your current password is incorrect" : "Error updating password");
        }
    }

    return <div className={"pt-5 mt-5 border-t"}>
        <h2 className={"text-2xl font-bold pb-2"}>Update Password</h2>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <fieldset className={"flex flex-col gap-4"} disabled={form.formState.isSubmitting}>
                    <FormField control={form.control} name="currentPassword" render={({field}) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="newPassword" render={({field}) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="newPasswordConfirm" render={({field}) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <Button type={"submit"}>Update Password</Button>
                </fieldset>
            </form>
        </Form>
    </div>

}
