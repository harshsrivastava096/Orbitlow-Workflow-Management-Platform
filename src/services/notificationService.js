import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

const listenNotifications = (uid, callback) => {
  const ref = collection(db, "notifications");

  const unsubscribe = onSnapshot(ref, async (snapshot) => {
    const result = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const id = docSnap.id;
      const docRef = docSnap.ref;

      /* ================= AUTO DELETE LOGIC ================= */

      // Case A: FROM + TO_MEMBER both true
      if (
        data.fromreadreceipt === true &&
        data.toMemberreadreceipt === true
      ) {
        await deleteDoc(docRef);
        continue;
      }

      // Case B: FROM + TO_TEAM both true
      if (
        data.fromreadreceipt === true &&
        Array.isArray(data.toTeamreadreceipt) &&
        data.toTeamreadreceipt.every((v) => v === true)
      ) {
        await deleteDoc(docRef);
        continue;
      }

      /* ================= DISPLAY LOGIC ================= */

      // CASE 1
      if (
        data.fromUserId === uid &&
        data.fromreadreceipt === false
      ) {
        result.push({
          id,
          caseType: "FROM",
          message: data.frommessage,
          title: data.title,
          createdAt: data.createdAt,
        });
      }

      // CASE 2
      if (
        data.toMemberId === uid &&
        data.toMemberreadreceipt === false
      ) {
        result.push({
          id,
          caseType: "TO_MEMBER",
          message: data.toMembermessage,
          title: data.title,
          createdAt: data.createdAt,
        });
      }

      // CASE 3
      if (Array.isArray(data.toTeamMemberId)) {
        const index = data.toTeamMemberId.indexOf(uid);

        if (
          index !== -1 &&
          Array.isArray(data.toTeamreadreceipt) &&
          data.toTeamreadreceipt[index] === false
        ) {
          result.push({
            id,
            caseType: "TO_TEAM",
            teamIndex: index,
            message: data.toTeammessage,
            title: data.title,
            createdAt: data.createdAt,
          });
        }
      }
    }

    callback(result);
  });

  return unsubscribe;
};

const markAsRead = async (notification) => {
  const ref = doc(db, "notifications", notification.id);

  if (notification.caseType === "FROM") {
    await updateDoc(ref, { fromreadreceipt: true });
  }

  if (notification.caseType === "TO_MEMBER") {
    await updateDoc(ref, { toMemberreadreceipt: true });
  }

  if (notification.caseType === "TO_TEAM") {
    const snap = await getDoc(ref);
    const data = snap.data();

    const updated = [...data.toTeamreadreceipt];
    updated[notification.teamIndex] = true;

    await updateDoc(ref, {
      toTeamreadreceipt: updated,
    });
  }
};

export { listenNotifications, markAsRead };
