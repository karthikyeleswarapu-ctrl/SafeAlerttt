import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let openedAlerts = [];

const q = query(
    collection(db, "emergencies"),
    where("active", "==", true)
);

onSnapshot(q, (snapshot) => {

    snapshot.docChanges().forEach((change) => {

        if (change.type !== "added") return;

        const data = change.doc.data();

        if (openedAlerts.includes(change.doc.id)) return;

        openedAlerts.push(change.doc.id);

        const openAlert = confirm(

`🚨 EMERGENCY ALERT

${data.senderName}

needs immediate help.

Open Emergency Screen?`

        );

        if (!openAlert) return;

        window.open(

`emergency.html?uid=${data.senderUID}&lat=${data.latitude}&lng=${data.longitude}&name=${encodeURIComponent(data.senderName)}&phone=${data.senderPhone}`,

"_blank"

        );

    });

});