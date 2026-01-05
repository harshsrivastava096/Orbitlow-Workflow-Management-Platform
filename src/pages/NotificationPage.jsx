import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  listenNotifications,
  markAsRead,
} from "../services/notificationService";

dayjs.extend(relativeTime);

const NotificationPage = () => {
  const uid = localStorage.getItem("uid");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!uid) return;

    const unsub = listenNotifications(uid, setNotifications);
    return () => unsub();
  }, [uid]);

  return (
    <div className="max-h-[400px] overflow-y-auto space-y-2">
      {notifications.length === 0 ? (
        <p className="text-gray-300 text-center">
          🔔 No new notifications
        </p>
      ) : (
        notifications.map((n, i) => (
          <div
            key={i}
            className="flex justify-between items-start bg-gray-700 rounded p-3"
          >
            <div>
              <p className="text-white font-medium">
                {n.message}
              </p>
              <p className="text-cyan-400 font-semibold">
                {n.title}
              </p>
              <p className="text-gray-400 text-xs">
                {n.createdAt?.toDate
                  ? dayjs(n.createdAt.toDate()).fromNow()
                  : ""}
              </p>
            </div>

            <button
              onClick={() => markAsRead(n)}
              className="ml-4 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Ok
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPage;