import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import LoginForm from "@/app/(auth)/login/login-form";
import Link from "next/link";

export default function Login() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Log In</CardTitle>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
            <CardFooter>
                Don&apos;t have an account?
                <Link href="/register" className={"underline pl-2"}>Register here</Link>
            </CardFooter>
        </Card>
    );
}
