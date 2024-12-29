import { Table, Button } from 'antd'
import { useState, useEffect } from 'react'
import { getAllTheatresByOwnerId } from '../../api/theatre'
import { useDispatch } from 'react-redux'
import { setLoading, hideLoading } from '../../redux/loaderSlice'
import { message } from 'antd'
import DeleteTheaterModal from './DeleteTheatreModal'
import TheaterForm from './TheatreForm'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import ShowModal from './ShowModal'

const TheaterTable = () => {
    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTheater, setSelectedTheater] = useState(null)
    const [showModalOpen, setShowModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [theaters, setTheaters] = useState([])
    const { user } = useSelector(state => state.user)

    const getTheaters = async () => {
        try {
            dispatch(setLoading(true))
            const theaters = await getAllTheatresByOwnerId(user?._id)
            if (theaters.success) {
                setTheaters(theaters?.data?.map(theater => ({
                    ...theater,
                    key: theater._id
                })))
            } else {
                message.error(theaters.message)
            }
        } catch (e) {
            console.log(e)
            message.error('Error fetching theaters')
        } finally {
            dispatch(hideLoading())
        }
    }

    useEffect(() => {
        getTheaters()
    }, [])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Owner',
            dataIndex: 'owner',
            key: 'owner',
            render: (owner) => owner.name
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => isActive ? 'Active' : 'Inactive'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => <div>
                <Button type='link' onClick={() => {
                    setIsModalOpen(true)
                    setSelectedTheater(record)
                }}><EditOutlined /></Button>
                <Button type='link' danger onClick={() => {
                    setIsDeleteModalOpen(true)
                    setSelectedTheater(record)
                }}><DeleteOutlined /></Button>
                <Button type='link' onClick={() => {
                    setShowModalOpen(true)
                    setSelectedTheater(record)
                }}>+ Shows</Button>
            </div>
        }
    ]
    return (
        <>
            <div className='flex justify-between items-center mb-4'>
                <h1>Theaters List</h1>
                <Button type='primary' onClick={() => {
                    setIsModalOpen(true)
                    setSelectedTheater(null)
                }}>Add Theater</Button>
            </div>
            <Table columns={columns} dataSource={theaters} />
            {isModalOpen && <TheaterForm 
                    theater={selectedTheater}
                    setSelectedTheater={setSelectedTheater}
                    onClose={() => {
                    setIsModalOpen(false)
                    setSelectedTheater(null)
                }}
                getTheaters={getTheaters}
            />}
            {isDeleteModalOpen && <DeleteTheaterModal 
            isModalOpen={isDeleteModalOpen}
                setIsModalOpen={setIsDeleteModalOpen}
                selectedTheater={selectedTheater}
                setSelectedTheater={setSelectedTheater}
                getTheaters={getTheaters}
            />}
            {showModalOpen && <ShowModal
                isModalOpen={showModalOpen}
                onClose={() => setShowModalOpen(false)}
                theater={selectedTheater}
            />}
        </>
    )
}

export default TheaterTable