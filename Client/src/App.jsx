import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setUpAxiosInterceptors } from "./api";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import Register from "./components/Register";
import Partner from "./pages/Partner";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import SingleMovie from "./components/SingleMovie";
import BookShow from "./components/BookShow";
import { Spin, Flex } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function App() {
    const navigate = useNavigate();
    const { loading } = useSelector((state) => {
        return state.loader;
    });
    useEffect(() => {
      setUpAxiosInterceptors(navigate);
    }, [navigate]);
    return (
        <>
            <Flex align="center" gap="middle">
                <Spin indicator={ <LoadingOutlined style={{ fontSize: 48 }} spin /> } fullscreen spinning={loading} />
            </Flex>

            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/partner"
                    element={
                        <ProtectedRoute>
                            <Partner />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/movie/:id"
                    element={
                        <ProtectedRoute>
                            <SingleMovie />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/book-show/:id"
                    element={
                        <ProtectedRoute>
                            <BookShow />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </>
    );
}

export default App;
