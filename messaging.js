import { app } from "./firebase.js";
import { auth } from "./firebase.js";
import { saveFCMToken } from "./firestore.js";

import {
    getMessaging,
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

const messaging = getMessaging(app);

export async function initNotifications() {

    try {

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            console.log("Notification permission denied");
            return;
        }

        const token = await getToken(messaging, {
            vapidKey: "BDed33jD0LKEEx_SjxT9WXjVMtpRY0mPSlHnWRTRMmV_0nst6Tg1jilDrAcat5kugFY_XEFPPRk7PIFwSYt4fow"
        });

        if (token && auth.currentUser) {

            await saveFCMToken(token);

            console.log("FCM Token saved successfully.");
        }

    } catch (e) {

        console.error(e);

    }

}

onMessage(messaging, (payload) => {

    if (navigator.vibrate) {
        navigator.vibrate([1000,300,1000,300,1000]);
    }

    const data = payload.data || {};

    const open = confirm(
        "🚨 EMERGENCY ALERT\n\n" +
        (payload.notification?.title || "SafeAlert") +
        "\n\n" +
        (payload.notification?.body || "Someone needs your help.") +
        "\n\nOpen Emergency Screen?"
    );

    if (open) {

        window.location.href =
            `emergency.html?name=${encodeURIComponent(data.name || "Unknown")}` +
            `&phone=${encodeURIComponent(data.phone || "")}` +
            `&lat=${encodeURIComponent(data.latitude || "")}` +
            `&lng=${encodeURIComponent(data.longitude || "")}`;

    }

});