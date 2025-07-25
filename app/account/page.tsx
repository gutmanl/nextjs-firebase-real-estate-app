import {cookies} from "next/headers";
import {auth} from "@/firebase/server";
import { redirect } from "next/navigation";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {DecodedIdToken} from "firebase-admin/auth";
import UpdatePasswordForm from "@/app/account/update-password-form";
import DeleteAccountButton from "@/app/account/delete-account-button";

export default async function Account() {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseAuthToken")?.value;

    if (!token) {
        redirect("/");
    }

    let verifiedToken: DecodedIdToken;

    try {
        verifiedToken = await auth.verifyIdToken(token);
        if (!verifiedToken) {
            redirect("/");
        }
    } catch (e) {
        console.error(e);
        redirect("/");
    }

    const user = await auth.getUser(verifiedToken.uid);
    const isPasswordProvider = !!user.providerData.find(provider => provider.providerId === "password");


    return <div className={"max-w-screen-sm mx-auto"}>
        <Card className={"mt-10"}>
            <CardHeader>
                <CardTitle className={"text-3xl font-bold"}>My Account</CardTitle>
            </CardHeader>
            <CardContent>
                <Label>Email</Label>
                <div>{verifiedToken.email}</div>
                {isPasswordProvider && <UpdatePasswordForm />}
            </CardContent>
            {!verifiedToken.admin && <CardFooter className={"flex flex-col items-start"}>
                <h2 className={"text-red-500 text-2xl font-bold mb-2"}>Danger Zone</h2>
                <DeleteAccountButton />
            </CardFooter>}
        </Card>
    </div>
}