import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ListingsProvider } from "./context/ListingsContext";
import { AlertsProvider } from "./context/AlertsContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import ManagerView from "./pages/ManagerView";
import AdminView from "./pages/AdminView";
import CreateFeed from "./pages/CreateFeed";
import CreateAlert from "./pages/CreateAlert";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <AlertsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/create" element={<CreateFeed />} />
              <Route
                path="/create-alert"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <CreateAlert />
                  </ProtectedRoute>
                }
              />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/manager"
                element={
                  <ProtectedRoute allowedRole="manager">
                    <ManagerView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminView />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AlertsProvider>
      </ListingsProvider>
    </AuthProvider>
  );
}

export default App;
