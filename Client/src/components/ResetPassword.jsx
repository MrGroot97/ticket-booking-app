import { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../api/user";
import { message } from "antd";

function Reset() {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        console.log(values);
        try {
            const response = await resetPassword(values);
            if (response.success) {
                message.success(response.message);
                navigate("/login");
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("tokenForBMS")) {
            navigate("/");
        }
    }, []);
    return (
        <>
            <header className="App-header">
                <main className="main-area mw-500 text-center px-3">
                    <section className="left-section">
                        <h1>Reset Password</h1>
                    </section>
                    <section className="right-section">
                        <Form layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                label="Email"
                                htmlFor="email"
                                name="email"
                                className="d-block"
                                rules={[
                                    {
                                        required: true,
                                        message: "Email is required",
                                    },
                                ]}
                            >
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="Enter your Email"
                                ></Input>
                            </Form.Item>

                            <Form.Item
                                label="OTP"
                                htmlFor="otp"
                                name="otp"
                                className="block"
                                rules={[
                                    {
                                        required: true,
                                        message: "OTP is required",
                                    },
                                ]}
                            >
                                <Input
                                    id="otp"
                                    type="number"
                                    placeholder="Enter your otp"
                                ></Input>
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                htmlFor="password"
                                name="password"
                                className="block"
                                rules={[
                                    {
                                        required: true,
                                        message: "Password is required",
                                    },
                                ]}
                            >
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your Password"
                                ></Input>
                            </Form.Item>
                            <Form.Item className="d-block">
                                <Button
                                    type="primary"
                                    block
                                    htmlType="submit"
                                    style={{
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                    }}
                                >
                                    RESET PASSWORD
                                </Button>
                            </Form.Item>
                        </Form>
                    </section>
                </main>
            </header>
        </>
    );
}

export default Reset;