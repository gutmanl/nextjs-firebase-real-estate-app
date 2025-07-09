import admin from "firebase-admin";
import { App, getApps, ServiceAccount } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import {Auth, getAuth} from "firebase-admin/auth";
import serviceAccountKey from "@/serviceAccountKey.json";

// Initialize Firebase
const currentApps  : App[] = getApps();
const app =
    currentApps && currentApps.length ?
        currentApps[0] :
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountKey as ServiceAccount)
        });

const firestore: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { firestore, auth };
