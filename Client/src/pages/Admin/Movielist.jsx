import { Table, message, Button } from 'antd'
import { DateTime } from 'luxon'
import { getAllMovies } from '../../api/movie'
import { useState, useEffect } from 'react'
import { hideLoading, setLoading } from '../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import MovieForm from './MovieForm'
import DeleteMovie from './DeleteMovie'

const Movielist = () => {
    const [movies, setMovies] = useState([])
    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState(null)

    const getMovies = async () => {
        try {
            dispatch(setLoading(true))
            getAllMovies().then(res => {
                setMovies(res.movies)
            })
        } catch (error) {
            console.log(error)
            message.error('Error fetching movies')
        } finally {
            dispatch(hideLoading())
        }
    }

    useEffect(() => {   
        getMovies()
    }, [])

    const tableHeaders = [
        {
            title: 'Poster',
            dataIndex: 'poster',
            render: (text, record) => <img src={record.poster} alt='poster' style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
        },{
            title: 'Movie Name',
            dataIndex: 'name'
        },{
            title: 'Description',
            dataIndex: 'description'
        },{
            title: 'Duration',
            dataIndex: 'duration',
            render: (text, record) => `${record.duration} minutes`
        },{
            title: 'Genre',
            dataIndex: 'genre',
            render: (text, record) => record.genre.join(', ')
        },{
            title: 'Language',
            dataIndex: 'language',
            render: (text, record) => record.language.join(', ')
        },{
            title: 'Release Date',
            dataIndex: 'releaseDate',
            render: (text, record) => DateTime.fromISO(record.releaseDate).toFormat('dd-MM-yyyy')
        },{
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => <div>
                <Button type='link' onClick={() => {
                    setIsModalOpen(true)
                    setSelectedMovie(record)
                }}><EditOutlined /></Button>
                <Button type='link' danger onClick={() => {
                    setIsDeleteModalOpen(true)
                    setSelectedMovie(record)
                }}><DeleteOutlined /></Button>
            </div>
        }
    ]

    return (
        <>
            <div className='flex justify-between items-center mb-4'>
                <h1>Movies List</h1>
                <Button type='primary' onClick={() => {
                    setIsModalOpen(true)
                    setSelectedMovie(null)
                }}>Add Movie</Button>
            </div>
            <Table columns={tableHeaders} dataSource={movies} />
            {isModalOpen && <MovieForm 
                movie={selectedMovie}
                setSelectedMovie={setSelectedMovie}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedMovie(null)
                }}
                getMovies={getMovies}
            />}
            {isDeleteModalOpen && <DeleteMovie 
                isModalOpen={isDeleteModalOpen}
                setIsModalOpen={setIsDeleteModalOpen}
                selectedMovie={selectedMovie}
                setSelectedMovie={setSelectedMovie}
                getMovies={getMovies}
            />}
        </>
    )
}

export default Movielist