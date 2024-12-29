import { Form, Input, Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/user'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading } from '../redux/loaderSlice'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleSubmit = async (values) => {
        try {
            dispatch(setLoading(true))
            const response = await loginUser(values)
            if (response.success) {
                message.success(response.message)
                localStorage.setItem('token', response.data.token)
                navigate('/')
            } else {
                message.error(response.message)
            }
            dispatch(setLoading(false))
        } catch (error) {
            console.log(error)
            message.error('Something went wrong')
        } finally {
            dispatch(setLoading(false))
        }
    }

    useEffect(() => {
        if(localStorage.getItem('token')) {
            navigate('/', { replace: true })
        }
    }, [])

    return (
        <div>
            <main>
                <section>
                    <h1>Register to BookMyShow</h1>
                </section>
                <section>
                    <Form layout='vertical' onFinish={handleSubmit}>
                        <Form.Item
                            label='Email'
                            name='email'
                            htmlFor='email' // linked to input id
                            rules={[{ required: true, message: 'Please enter your email' }]}
                        >
                            <Input
                                id='email'
                                type='email'
                                placeholder='Enter your email'
                            />
                        </Form.Item>
                        <Form.Item
                            label='Password'
                            name='password'
                            htmlFor='password' // linked to input id
                            rules={[{ required: true, message: 'Please enter your password' }]}
                        >
                            <Input
                                id='password'
                                type='password'
                                placeholder='Enter your password'
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' htmlType='submit' className='text-md font-bold'>Login</Button>
                        </Form.Item>
                    </Form>
                </section>
                <section className='mt-5 flex justify-between items-center'>
                    <p>New user? <Link to='/register' className='text-blue-500 underline'>Register</Link></p>
                    <p>Forgot password? <Link to='/forget-password' className='text-blue-500 underline'>Reset password</Link></p>
                </section>
            </main>
        </div>
    )
}

export default Login