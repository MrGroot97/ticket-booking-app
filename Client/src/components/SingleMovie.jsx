import { getMovieById } from "../api/movie";
import { getAllTheatreByMovie } from "../api/show";
import { setLoading, hideLoading } from "../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message, Input, Row, Col, Divider } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";

const SingleMovie = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState({});
    const [date, setDate] = useState(DateTime.now().toFormat("yyyy-MM-dd"));
    const [theatres, setTheatres] = useState([]);

    const getData = async () => {
        try {
            dispatch(setLoading());
            const response = await getMovieById(params.id);
            if (response.success) {
                setMovie(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        } catch (err) {
            message.error(err.message);
            dispatch(hideLoading());
        }
    };

    const getTheatres = async () => {
        try {
            dispatch(setLoading());
            const response = await getAllTheatreByMovie({ movieId: params.id, date });
            if (response.success) {
                setTheatres(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        } catch (err) {
            message.error(err.message);
            dispatch(hideLoading());
        }
    }

    useEffect(() => {
        getData();
        if (params.id) {
            getTheatres();
        }
    }, []);

    useEffect(() => {
        if (params.id) {
            getTheatres();
        }
    }, [date]);

    const handleDate = (e) => {
        setDate(e.target.value);
    };

    return (
        <div className="max-w-[1000px] mx-auto" style={{ paddingTop: "20px" }}>
            {movie && (
                <div className="flex flex-col md:flex-row items-center">
                    <div className="shrink-0 me-3 single-movie-img">
                        <img
                            src={movie.poster}
                            width={150}
                            className="rounded-sm w-[250px]"
                            alt="Movie Poster"
                        />
                    </div>
                    <div className="w-full">
                        <h1 className="mt-0">{movie.name}</h1>
                        <p className="movie-data">
                            Language: <span>{movie.language}</span>
                        </p>
                        <p className="movie-data">
                            Genre: <span>{movie.genre}</span>
                        </p>
                        <p className="movie-data">
                            Release Date:{" "}
                            <span>
                                {DateTime.fromISO(movie.releaseDate).toFormat('dd LLL yyyy')}
                            </span>
                        </p>
                        <p className="movie-data">
                            Duration: <span>{movie.duration} Minutes</span>
                        </p>
                        <hr />
                        <div className="flex justify-center items-center gap-5 mt-3">
                            <label className="me-3 flex-shrink-0">
                                Choose the date:
                            </label>
                            <Input
                                onChange={handleDate}
                                type="date"
                                min={DateTime.now().toFormat("yyyy-MM-dd")}
                                className="max-w-[300px] mt-8px-mob"
                                value={date}
                                placeholder="default size"
                                prefix={<CalendarOutlined />}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-5">
                <hr />
                {theatres.length === 0 && (
                    <div className="pt-3">
                    <h2 className="text-red-600">
                        Currently, no theatres available for this movie!
                    </h2>
                    </div>
                )}
                {theatres.length > 0 && (
                <div className="theatre-wrapper mt-3 pt-3">
                <h2 className="text-lg font-semibold text-start">Theatres</h2>
                {theatres.map((theatre) => {
                    return (
                    <div key={theatre._id}>
                        <Row gutter={24} key={theatre._id}>
                        <Col xs={{ span: 24 }} lg={{ span: 8 }} className="text-start">
                            <h3>{theatre.name}</h3>
                            <p>{theatre.address}</p>
                        </Col>
                        <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                            <ul className="flex flex-wrap gap-2 list-none">
                            {theatre.shows
                                .sort(
                                (a, b) =>
                                    DateTime.fromISO(a.time) - DateTime.fromISO(b.time)
                                )
                                .map((singleShow) => {
                                return (
                                    <li
                                        key={singleShow._id}
                                        onClick={() =>navigate(`/book-show/${singleShow._id}`)}
                                        className="cursor-pointer bg-gray-200 px-2 py-1 rounded-md  border border-[#bbb] transition-all duration-200 hover:bg-gray-300"
                                    >
                                    {DateTime.fromISO(singleShow.time).toFormat('hh:mm a')}
                                    </li>
                                );
                                })}
                            </ul>
                        </Col>
                        </Row>
                        <Divider />
                    </div>
                    );
                })}
                </div>
            )}
            </div>
        </div>
    );
};

export default SingleMovie;
