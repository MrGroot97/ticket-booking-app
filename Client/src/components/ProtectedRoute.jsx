import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { message, Menu } from 'antd';
import { getCurrentUser } from '../api/user';
import { setLoading, hideLoading } from '../redux/loaderSlice';
import { setUser } from '../redux/userSlice';
import Layout from 'antd/es/layout/layout';
import { Header } from 'antd/es/layout/layout';
import { HomeOutlined, UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { setUpAxiosInterceptors } from '../api';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)

    useEffect(() => {
        setUpAxiosInterceptors(navigate)
    }, [navigate])

    const navItems = [
        {
            label: (
                <Link to='/'>
                    Home
                </Link>
            ),
            icon: <HomeOutlined />,
            key: 'home'
        },
        {
            label: `${user?.name ? user.name.split(' ')[0].toUpperCase() : 'Profile'}`,
            icon: <UserOutlined />,
            key: 'user-menu',
            children: [
                {
                    label: (
                        <span 
                            className='capitalize'
                            onClick={() => {
                                if(user?.role === 'admin') {
                                    navigate('/admin')
                                } else if(user?.role === 'partner') {
                                    navigate('/partner')
                                } else {
                                    navigate('/profile')
                                }
                            }}
                        >
                            My Profile
                        </span>
                    ),
                    icon: <ProfileOutlined />,
                    key: 'profile',
                },
                {
                    label: (
                        <Link
                            to='/login'
                            onClick={
                                () => {
                                    localStorage.removeItem('token')
                                    dispatch(setUser(null))
                                }
                            }
                        >
                            Logout
                        </Link>
                    ),
                    icon: <LogoutOutlined />,
                    key: 'logout'
                }
            ]
        }
    ]

    const getUserInfo = async () => {
        try {
            dispatch(setLoading(true))
            const response = await getCurrentUser()
            dispatch(setUser(response?.user))
        } catch (error) {
            console.log({ error })
            message.error("Something went wrong")
        } finally {
            dispatch(hideLoading())
        }
    }

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
        } else {
            getUserInfo()
        }
    }, [])

    if (!user) {
        return null
    }
    
    return (
        <>
            <Layout>
                <Header
                    className='flex justify-between items-center sticky top-0 z-10 w-full'
                >
                    <h3 className='text-xl font-bold text-white cursor-pointer' onClick={() => navigate('/')}>BookMyShow</h3>
                    <Menu
                        theme='dark'
                        mode='horizontal'
                        items={navItems}
                        className='flex justify-end items-center min-w-[300px]'
                    />
                </Header>
            </Layout>
            <div>
                {children}
            </div>
        </>
    );
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;