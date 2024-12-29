import { Button, Card, Col, Row, message } from "antd";
import { useEffect, useState } from "react";
import { hideLoading, setLoading } from "../../redux/loaderSlice";
import { getAllBookings } from "../../api/booking";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { useSelector } from "react-redux";

const Booking = () => {
    const [bookings, setBookings] = useState([]);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(setLoading());
            const response = await getAllBookings(user._id);
            if (response.success) {
                setBookings(response.data);
            } else {
                message.error(response.message);
            }

            dispatch(hideLoading());
        } catch (err) {
            message.error(err.message);
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            {bookings && (
                <Row gutter={24}>
                    {bookings.map((booking) => {
                        return (
                            <Col
                                key={booking._id}
                                xs={{ span: 24 }}
                                lg={{ span: 12 }}
                            >
                                <Card className="mb-3">
                                    <div className="flex flex-col">
                                        <div className="shrink-0 mx-auto">
                                            <img
                                                src={booking.show.movie.poster}
                                                width={100}
                                                alt="Movie Poster"
                                            />
                                        </div>
                                        <div className="show-details flex-1">
                                            <h3 className="mt-0 mb-0">
                                                {booking.show.movie.title}
                                            </h3>
                                            <p>
                                                Theatre:{" "}
                                                <b>
                                                    {booking.show.theatre.name}
                                                </b>
                                            </p>
                                            <p>
                                                Seats:{" "}
                                                <b>
                                                    {booking.seats.join(", ")}
                                                </b>
                                            </p>
                                            <p>
                                                Date & Time:
                                                <b>
                                                    {DateTime.fromISO(
                                                        booking.show.date
                                                    ).toFormat(
                                                        "MMM dd, yyyy"
                                                    )}{" "}
                                                    at{" "}
                                                    {DateTime.fromISO(
                                                        booking.show.time
                                                    ).toFormat("hh:mm a")}
                                                </b>
                                            </p>
                                            <p>
                                                Amount:
                                                <b>
                                                    Rs.{" "}
                                                    {booking.seats.length *
                                                        booking.show
                                                            .price}
                                                </b>
                                            </p>
                                            <p>
                                                Booking ID:{" "}
                                                <b>{booking.transactionId} </b>
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {!bookings.length && (
                <div className="text-center pt-3">
                    <h1> You&apos;ve not booked any show yet!</h1>
                    <Link to="/">
                        <Button type="primary">Start Booking</Button>
                    </Link>
                </div>
            )}
        </>
    );
};

export default Booking;
