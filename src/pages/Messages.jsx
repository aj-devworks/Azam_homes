import { MessageCircle } from "lucide-react";
import { useAlerts } from "../context/AlertsContext";
import BottomNav from "../components/BottomNav";

function Messages() {
  const { alerts } = useAlerts();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm sticky top-0 z-10 px-5 sm:px-8 py-4">
        <h1 className="text-lg font-bold text-gray-900">Messages</h1>
      </div>

      <div className="px-5 sm:px-8 py-5 space-y-3">
        {alerts.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">
            No messages yet.
          </p>
        )}
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-2xl shadow-sm p-4 flex gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <MessageCircle size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">
                {alert.title}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

export default Messages;
