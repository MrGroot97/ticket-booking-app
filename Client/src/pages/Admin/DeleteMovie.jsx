/* eslint-disable react/prop-types */
import { Modal, Button } from 'antd'
import { useDispatch } from 'react-redux'
import { deleteMovie } from '../../api/movie'
import { setLoading, hideLoading } from '../../redux/loaderSlice'
import { message } from 'antd'

const DeleteMovie = ({ 
    isModalOpen, 
    setIsModalOpen, 
    selectedMovie, 
    setSelectedMovie,
    getMovies
}) => {
    const dispatch = useDispatch()
    const onClose = () => {
        setIsModalOpen(false)
        setSelectedMovie(null)
    }
    const onDelete = async () => {
        dispatch(setLoading(true))
        const movieId = selectedMovie._id
        const response = await deleteMovie(movieId)
        if (response.success) {
            message.success(response.message)
            getMovies()
            onClose()
        } else {
            setIsModalOpen(false)
            message.error(response.message)
        }
        dispatch(hideLoading())
    }
    return (
        <Modal open={isModalOpen} onCancel={onClose} footer={null} width={450} title="Delete Movie" centered>
            <p>Are you sure you want to delete this movie?</p>
            <p>This action cannot be undone and you will lose this movie data.</p>
            <div style={{ textAlign: 'right' }} className='gap-2 mt-2'>
                <Button type='default' onClick={onClose}>Cancel</Button>
                <Button type='primary' danger onClick={onDelete} className='ml-2'>Delete</Button>
            </div>
        </Modal>
    )
}

export default DeleteMovie
