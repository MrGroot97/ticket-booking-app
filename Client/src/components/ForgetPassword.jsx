import { Form, Input, Button, message } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../api/user";

const ForgetPassword = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const forget = await forgetPassword(values);
            if (forget.success) {
                message.success(forget.message);
                navigate("/reset-password");
            } else {
                message.error(forget.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/", { replace: true });
        }
    }, []);

    return (
        <header className="App-header">
            <main className="main-area mw-500 text-center px-3">
                <section className="left-section">
                    <h1>Forget Password</h1>
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

                        <Form.Item className="d-block">
                            <Button
                                type="primary"
                                block
                                htmlType="submit"
                                style={{ fontSize: "1rem", fontWeight: "600" }}
                            >
                                SEND OTP
                            </Button>
                        </Form.Item>
                    </Form>
                    <div>
                        <p>
                            Existing User? <Link to="/login" className='text-blue-500 underline'>Login Here</Link>
                        </p>
                    </div>
                </section>
            </main>
        </header>
    );
};

export default ForgetPassword;
