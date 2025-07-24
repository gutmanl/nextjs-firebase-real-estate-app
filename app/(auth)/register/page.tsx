import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import RegisterForm from "@/app/(auth)/register/register-form";
import Link from "next/link";

export default function Register() {
    return <Card>
        <CardHeader>
            <CardTitle className={"text-3xl font-bold"}>
                Register
            </CardTitle>
        </CardHeader>
        <CardContent>
            <RegisterForm />
        </CardContent>
        <CardFooter>
            Already have an account?
            <Link href="/login" className={"underline pl-2"}>Log in here</Link>
        </CardFooter>
    </Card>;
}
