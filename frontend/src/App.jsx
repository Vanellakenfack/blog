import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider }  from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar         from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home          from "./pages/Home";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import ArticleDetail from "./pages/ArticleDetail";
import ArticleForm   from "./pages/ArticleForm";
import NotFound      from "./pages/NotFound";

const App = () => (
    <AuthProvider>
        <ToastProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/"                  element={<Home />} />
                    <Route path="/login"             element={<Login />} />
                    <Route path="/register"          element={<Register />} />
                    <Route path="/articles/:id"      element={<ArticleDetail />} />
                    <Route path="/articles/new"      element={
                        <ProtectedRoute><ArticleForm /></ProtectedRoute>
                    } />
                    <Route path="/articles/:id/edit" element={
                        <ProtectedRoute><ArticleForm /></ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    </AuthProvider>
);

export default App;
