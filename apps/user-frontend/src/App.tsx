import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/DashboardLayout";
import News from "./pages/News";
import Announcements from "./pages/Announcements";
import Chat from "./pages/Chat";
import NewsDetail from "./pages/NewsDetail";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingChat from "./components/FloatingChat";
import FloatingApplication from "./components/FloatingApplication";
import FloatingServiceButton from "./components/FloatingServiceButton";
import ProtectedRoute from "./components/ProtectedRoute";
import { FloatingButtonsProvider } from "./contexts/FloatingButtonsContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FloatingButtonsProvider>
            <div className="min-h-screen flex flex-col">
            <Routes>
            {/* Public routes with navbar and footer */}
            <Route path="/" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Landing />
                </main>
                <Footer />
              </>
            } />
            <Route path="/news" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <News />
                </main>
                <Footer />
              </>
            } />
            <Route path="/news/:slug" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <NewsDetail />
                </main>
                <Footer />
              </>
            } />
            <Route path="/announcements" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Announcements />
                </main>
                <Footer />
              </>
            } />
            <Route path="/chat" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Chat />
                </main>
                <Footer />
              </>
            } />
            <Route path="/services" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <About />
                </main>
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Services />
                </main>
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Contact />
                </main>
                <Footer />
              </>
            } />
            
            {/* Authentication routes (full screen) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard routes (protected, no navbar/footer) */}
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
          <FloatingChat />
          <FloatingApplication />
          <FloatingServiceButton />
        </FloatingButtonsProvider>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
