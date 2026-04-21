import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => { checkAuth(); }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <>
      <Routes>
        {/* public landing page */}
        <Route path="/" element={!authUser ? <LandingPage /> : <Navigate to="/chat" />} />

        {/* auth pages */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/chat" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/chat" />} />

        {/* main app */}
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#f5f5f5",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#f59e0b", secondary: "#000" } },
        }}
      />
    </>
  );
}

export default App;
