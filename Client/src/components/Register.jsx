import { Form, Input, Button, message, Radio } from 'antd'
import { Link } from 'react-router-dom'
import { registerUser } from '../api/user'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading } from '../redux/loaderSlice'

const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleSubmit = async (values) => {
        try {
            dispatch(setLoading(true))
            const response = await registerUser(values)
            if (response.success) {
                navigate('/login')
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
                            label='Name'
                            name='name'
                            htmlFor='name' // linked to input id
                            rules={[{ required: true, message: 'Please enter your name' }]}
                        >
                            <Input
                                id='name'
                                type='text'
                                placeholder='Enter your name'
                            />
                        </Form.Item>
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
                        <Form.Item
                            label='Register as a partner'
                            name='role'
                            htmlFor='role' // linked to input id
                            initialValue={false}
                            rules={[{ required: true, message: 'Please select your role' }]}
                        >
                            <Radio.Group className='flex gap-2'>
                                <Radio value={'partner'}>Yes</Radio>
                                <Radio value={'user'}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item>
                            <Button 
                                type='primary' 
                                htmlType='submit' 
                                className='text-md font-bold'
                            >
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
                <section>
                    <p>Already a user? <Link to='/login' className='text-blue-500 underline'>Login</Link></p>
                </section>
            </main>
        </div>
    )
}

export default Register
