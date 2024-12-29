import { Table, Button } from 'antd'
import { useState, useEffect } from 'react'
import { getAllTheatres } from '../../api/theatre'
import { message } from 'antd'
import { updateTheatre } from '../../api/theatre'

const TheaterTable = () => {
    const [theaters, setTheaters] = useState([])

    const getTheaters = async () => {
        const response = await getAllTheatres()
        if (response.success) {
            setTheaters(response.data.map(theater => ({
                ...theater,
                key: theater._id
            })))
        } else {
            message.error(response.message)
        }
    }

    useEffect(() => {
        getTheaters()
    }, [])

    const handleStatusChange = async (theater) => {
        const response = await updateTheatre({
            ...theater,
            theaterId: theater._id,
            isActive: !theater.isActive
        })
        if (response.success) {
            getTheaters()
        } else {
            message.error(response.message)
        }
    }

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
            render: (_, record) => (
                <div>
                    <Button type='primary' onClick={() => {
                        handleStatusChange(record)
                    }}>{record.isActive ? 'Block' : 'Approve'}</Button>
                </div>
            )
        }
    ]
    return (
        <Table columns={columns} dataSource={theaters} />
    )
}

export default TheaterTable