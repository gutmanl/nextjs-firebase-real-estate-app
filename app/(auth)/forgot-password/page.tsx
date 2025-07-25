import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import ForgotPasswordForm from "@/app/(auth)/forgot-password/forgot-password-form";

export default function ForgotPassword() {
    return <Card>
        <CardHeader>
            <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
            <CardDescription>Enter your email and we&apos;ll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
            <ForgotPasswordForm />
        </CardContent>
    </Card>
}