/* eslint-disable react/prop-types */
import { Modal, Form, Input, Select, Row, Col, Button, DatePicker } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { DateTime } from 'luxon'
import dayjs from 'dayjs'
import { updatedMovie, addMovie } from '../../api/movie'

const MovieForm = ({ movie, onClose, getMovies }) => {
    
    const onSubmit = async (values) => {
        if (movie) {
            const updatedValues = {
                ...values,
                movieId: movie._id
            }
            await updatedMovie(updatedValues)
            getMovies()
        } else {
            await addMovie(values)
            getMovies()
        }
        onClose()
    }

    return (
        <Modal open={true} onCancel={onClose} footer={null} width={800} title={movie ? 'Edit Movie' : 'Add Movie'} centered>
            <Form layout='vertical' onFinish={onSubmit} initialValues={movie}>
                <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                    <Col span={24}>
                        <Form.Item label="Movie Name" name="name" rules={[{ required: true, message: "Movie name is required!" }]}>
                            <Input placeholder="Enter the movie name" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Description" name="description" rules={[{ required: true, message: "Description is required!" }]}>
                            <TextArea rows={4} placeholder="Enter the movie description" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                            <Col span={8}>
                                <Form.Item label="Duration" name="duration" rules={[{ required: true, message: "Duration is required!" }]}>
                                    <Input type='number' placeholder='Enter the movie duration' />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Select Movie Language" name="language" rules={[{ required: true, message: "Movie language is required!" }]}>
                                    <Select placeholder='Select movie language' 
                                        options={[
                                            { label: 'English', value: 'English' },
                                            { label: 'Hindi', value: 'Hindi' },
                                            { label: 'Tamil', value: 'Tamil' },
                                            { label: 'Telugu', value: 'Telugu' },
                                            { label: 'Punjabi', value: 'Punjabi' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Release Date" name="releaseDate" rules={[{ required: true, message: "Release date is required!" }]} getValueProps={(value) => ({ value: value ? dayjs(value) : "", })}>
                                    <DatePicker value={movie?.releaseDate ? DateTime.fromISO(movie.releaseDate).toFormat('dd-MM-yyyy') : null} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                            <Col span={8}>
                                <Form.Item label="Select Movie Genre" name="genre" rules={[{ required: true, message: "Movie genre is required!" }]}>
                                    <Select placeholder='Select movie genre' 
                                        options={[
                                            { label: 'Action', value: 'Action' },
                                            { label: 'Comedy', value: 'Comedy' },
                                            { label: 'Drama', value: 'Drama' },
                                            { label: 'Horror', value: 'Horror' },
                                            { label: 'Sci-Fi', value: 'Sci-Fi' },
                                            { label: 'Thriller', value: 'Thriller' },
                                            { label: 'Romance', value: 'Romance' },
                                            { label: 'Adventure', value: 'Adventure' },
                                            { label: 'Animation', value: 'Animation' },
                                            { label: 'Biography', value: 'Biography' },
                                            { label: 'Crime', value: 'Crime' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item label="Movie Image" name="poster" rules={[{ required: true, message: "Movie image is required!" }]}>
                                    <Input placeholder="Enter the movie poster" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Form.Item style={{ textAlign: 'right' }} className='gap-2'>
                    <Button type='primary' htmlType='submit'>Submit</Button>
                    <Button type='default' onClick={onClose} className='ml-2'>Cancel</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default MovieForm
