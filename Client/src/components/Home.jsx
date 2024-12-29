import { SearchOutlined } from "@ant-design/icons";
import { Row, Col, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, setLoading } from '../redux/loaderSlice';
import { getAllMovies } from '../api/movie'
import { useNavigate } from "react-router-dom";
import { DateTime } from 'luxon'

const Home = () => {
    const [movies, setMovies] = useState([])
    const [searchText, setSearchText] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
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

    const handleSearch = (e) => {
        setSearchText(e.target.value)
    }

    useEffect(() => {
        getMovies()
    }, [])

    return (
        <div className="container">
            <Row 
                gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}
                className="justify-center w-100 py-10 pr-[15px] pl-0"
            >
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Input  placeholder="Type here to search for movies" prefix={<SearchOutlined />} onChange={handleSearch} />
                </Col>
            </Row>
            <Row 
                className="justify-center"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
                {movies && movies.filter((movie) => movie.name.toLowerCase().includes(searchText.toLowerCase())).map(movie => (
                    <Col className="gutter-row" span={{ xs: 24, sm: 24, md: 12, lg: 10, }} key={movie._id}>
                        <div 
                            className="cursor-pointer" 
                            onClick={() => navigate(`/movie/${movie._id}?date=${DateTime.now().toFormat('yyyy-MM-dd')}`)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transition = "transform 0.3s"
                                e.currentTarget.style.transform = "scale(1.05)"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transition = "transform 0.3s"
                                e.currentTarget.style.transform = "scale(1)"
                            }}
                        >
                            <img 
                                src={movie.poster} alt={movie.name} className="object-cover rounded-lg w-[200px] h-[300px]" width={200} height={300}
                                style={{ 
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        transition: "transform 0.3s",
                                }}
                            />
                            <h3 className="text-center text-lg font-semibold mt-2">{movie.name}</h3>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Home;
