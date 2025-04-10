import admin from "firebase-admin";
import { App, getApps, ServiceAccount } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
    "type": "service_account",
    "project_id": "nextjs-15-and-firebase-6d96e",
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40nextjs-15-and-firebase-6d96e.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

// Initialize Firebase
const currentApps  : App[] = getApps();
const app =
    currentApps && currentApps.length ?
        currentApps[0] :
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as ServiceAccount)
        });

const firestore: Firestore = getFirestore(app);

export { firestore};
