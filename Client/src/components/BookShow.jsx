import { useState, useEffect } from "react";
import { Card, Row, Col, Button, message } from "antd";
import { DateTime } from "luxon";
import { getShowById } from "../api/show";
import { useParams } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { useDispatch } from "react-redux";
import { setLoading, hideLoading } from "../redux/loaderSlice";
import { makePaymentAndBookShow } from "../api/booking";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BookShow = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [show, setShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const getData = async () => {
        try {
            const response = await getShowById(params.id);
            if (response.success) {
                setShow(response.data);
            } else {
                message.error(response.message);
            }
        } catch (err) {
            message.error(err.message);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const getSeats = () => {
        const column = 10;
        const totalSeats = show.totalSeats;
        const rows = Math.ceil(totalSeats / column);

        return (
            <div
                className="flex flex-col"
            >
                <div className="w-full max-w-[600px] mx-auto mb-[25px]">
                    <p className="text-center mb-10px">
                        Screen this side, you will be watching in this direction
                    </p>
                    <div className="screen-div h-[10px] max-w-[75%] mx-auto bg-[#eee]"></div>
                </div>
                <ul className="seat-ul mx-auto">
                    {Array.from({ length: rows }, (_, i) => (
                        <li
                            key={i}
                            className="flex justify-center w-full"
                        >
                            {Array.from({ length: column }, (_, j) => {
                                const seatNumber = i * column + j + 1;
                                const isBooked = show.bookedSeats.includes(seatNumber);
                                return (
                                    <Button
                                        key={j}
                                        className={`m-1 seat-btn ${show.bookedSeats.includes(seatNumber) && "booked"} ${selectedSeats.includes(seatNumber) && "selected"}`}
                                        disabled={isBooked}
                                        onClick={() => {
                                            if (selectedSeats.includes(seatNumber)) {
                                                setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber))
                                            } else {
                                                setSelectedSeats([...selectedSeats, seatNumber])
                                            }
                                        }}
                                    >
                                        {seatNumber}
                                    </Button>
                                );
                            })}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const bookAndPay = async (token) => {
        try {
            dispatch(setLoading());
            const response = await makePaymentAndBookShow({
              token,
              amount: selectedSeats.length * show.ticketPrice * 100,
              showId: params.id,
              seats: selectedSeats,
              user: user._id,
            });
            if (response.success) {
              message.success("Show Booking done!");
              navigate("/profile");
            } else {
              message.error(response.message);
            }
          } catch (err) {
            message.error(err);
          } finally {
            dispatch(hideLoading());
          }
    }

    const showDetailSpanStyle = "font-semibold text-[#555]";
    return (
        <div>
            {show && (
                <Row gutter={24}>
                    <Col span={24}>
                        <Card
                            title={
                                <div className="movie-title-details text-start">
                                    <h1 className="font-semibold">
                                        {show.movie.name}
                                    </h1>
                                    <p>
                                        Theatre: {show.theatre.name},{" "}
                                        {show.theatre.address}
                                    </p>
                                </div>
                            }
                            extra={
                                <div className="show-name py-3">
                                    <h3 className="font-semibold">
                                        <span className={showDetailSpanStyle}>
                                            Show Name:
                                        </span>{" "}
                                        {show.name}
                                    </h3>
                                    <h3 className="font-semibold">
                                        <span className={showDetailSpanStyle}>
                                            Date & Time:{" "}
                                        </span>
                                        {DateTime.fromISO(show.date).toFormat(
                                            "MMM dd, yyyy"
                                        )}{" "}
                                        at{" "}
                                        {DateTime.fromISO(show.time).toFormat(
                                            "hh:mm a"
                                        )}
                                    </h3>
                                    <h3 className="font-semibold">
                                        <span className={showDetailSpanStyle}>
                                            Ticket Price:
                                        </span>{" "}
                                        Rs. {show.price}/-
                                    </h3>
                                    <h3 className="font-semibold">
                                        <span className={showDetailSpanStyle}>
                                            Total Seats:
                                        </span>{" "}
                                        {show.totalSeats}
                                        <span className={showDetailSpanStyle}>
                                            {" "}
                                            &nbsp;|&nbsp; Available Seats:
                                        </span>
                                        {show.totalSeats -
                                            show.bookedSeats.length}
                                    </h3>
                                </div>
                            } style={{ width: "100%" }}
                        >
                            {getSeats()}
                            {selectedSeats.length > 0 && (
                                <StripeCheckout
                                token={bookAndPay}
                                amount={selectedSeats.length * show.price}
                                billingAddress
                                stripeKey="pk_test_51O5zcBSBDTkZoZSYLMhGUO2MTmaOGJ2zaVA8RuqLn35meiJiQUAzM8HKHgNYXJAGnRSf335yH7rYZQCJ8G6uPIrU00VLrpUJX9"
                                >
                                <div className="max-w-[600px] mx-auto">
                                    <Button type="primary" shape="round" size="large" block>
                                        Pay Now
                                    </Button>
                                </div>
                                </StripeCheckout>
                            )}
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default BookShow;
