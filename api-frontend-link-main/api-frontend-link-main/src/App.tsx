
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CreateCourse from "./pages/CreateCourse";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import EditPost from "./pages/EditPost";
import EditCourse from "./pages/EditCourse";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NavBar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/posts/:id/edit" element={<EditPost />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/courses/:id/edit" element={<EditCourse />} />
              <Route path="/create-course" element={<CreateCourse />} />
              <Route path="/profile/:id" element={<UserProfile />} />
              <Route path="/profile/edit/:id" element={<EditProfile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
