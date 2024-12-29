/* eslint-disable react/prop-types */
import { Modal, Button } from 'antd'
import { useDispatch } from 'react-redux'
import { setLoading, hideLoading } from '../../redux/loaderSlice'
import { message } from 'antd'
import { deleteTheatre } from '../../api/theatre'

const DeleteTheatreModal = ({ isModalOpen, setIsModalOpen, selectedTheater, setSelectedTheater, getTheaters }) => {
    const dispatch = useDispatch()
    const onClose = () => {
        setIsModalOpen(false)
        setSelectedTheater(null)
    }
    const onDelete = async () => {
        dispatch(setLoading(true))
        const theaterId = selectedTheater._id
        const response = await deleteTheatre(theaterId)
        if (response.success) {
            message.success(response.message)
            getTheaters()
            onClose()
        } else {
            setIsModalOpen(false)
            message.error(response.message)
        }
        dispatch(hideLoading())
    }

    return (
        <Modal open={isModalOpen} onCancel={onClose} footer={null} width={450} title="Delete Theater" centered>
            <p>Are you sure you want to delete this theater?</p>
            <p>This action cannot be undone and you will lose this theater data.</p>
            <div style={{ textAlign: 'right' }} className='gap-2 mt-2'>
                <Button type='default' onClick={onClose}>Cancel</Button>
                <Button type='primary' danger onClick={onDelete} className='ml-2'>Delete</Button>
            </div>
        </Modal>
    )
}

export default DeleteTheatreModal   