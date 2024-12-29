/* eslint-disable react/prop-types */
import { Modal, Table, Button, Form, Row, Col } from "antd";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setLoading, hideLoading } from "../../redux/loaderSlice";
import { message } from "antd";
import { getAllShowByTheatre, addShow, updateShow, deleteShow } from "../../api/show";
import { getAllMovies } from "../../api/movie";
import { Input, Select } from "antd";

const VIEW_NAMES = {
    SHOWS: "shows",
    ADD: "add",
    EDIT: "edit",
};

const ShowModal = ({ isModalOpen, onClose, theater }) => {
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState([]);
    const [view, setView] = useState(VIEW_NAMES.SHOWS);
    const [selectedShow, setSelectedShow] = useState(null);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(setLoading(true));
            getAllMovies()
                .then((res) => {
                    setMovies(res.movies);
                })
                .catch((e) => {
                    console.log(e);
                    message.error("Error fetching movies");
                });
            const showsResponse = await getAllShowByTheatre(theater._id);
            setShows(showsResponse.shows);
        } catch (e) {
            console.log(e);
            message.error("Error fetching theaters");
        } finally {
            dispatch(hideLoading());
        }
    };

    const onFinish = async (values) => {
        try {
          dispatch(setLoading());
          let response = null;
          if (view === VIEW_NAMES.ADD) {
            response = await addShow({ ...values, theatre: theater._id });
          } else {
            response = await updateShow({
              ...values,
              showId: selectedShow._id,
              theatre: theater._id,
            });
          }
            getData();
            message.success(response.message);
            setView(VIEW_NAMES.SHOWS);
        } catch (err) {
          message.error(err.message);
        } finally {
          dispatch(hideLoading());
        }
      };
    

    useEffect(() => {
        getData();
    }, [theater]);

    const columns = [
        {
            title: "Movie Name",
            dataIndex: "movie",
            key: "movie",
            render: (text, record) => record.movie.name,
        },
        {
            title: "Show Date",
            dataIndex: "date",
            key: "date",
            render: (text, record) =>
                DateTime.fromISO(record.date).toFormat("dd-MM-yyyy"),
        },
        {
            title: "Show Time",
            dataIndex: "time",
            key: "time",
            render: (text, record) =>
                DateTime.fromISO(record.time).toFormat("hh:mm a"),
        },
        {
            title: "Ticket Price",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Total Seats",
            dataIndex: "totalSeats",
            key: "totalSeats",
        },
        {
            title: "Available Seats",
            dataIndex: "availableSeats",
            key: "availableSeats",
            render: (text, record) =>
                record.totalSeats - record.bookedSeats.length,
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive) => (isActive ? "Active" : "Inactive"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div>
                    <Button
                        type="link"
                        onClick={() => {
                            setView(VIEW_NAMES.EDIT);
                            setSelectedShow({
                                ...record,
                                date: DateTime.fromISO(record.date).toFormat("yyyy-MM-dd"),
                                movie: record.movie._id,
                              });              
                        }}
                    >
                        <EditOutlined />
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => {
                            deleteShow(record._id).then((delRes) => {
                                if (delRes.success) {
                                    message.success(delRes.message);
                                    getData();   
                                } else {
                                    message.error(delRes.message);
                                }
                            }).catch((e) => {
                                console.log(e);
                                message.error("Error deleting show");
                            });
                        }}
                    >
                        <DeleteOutlined />
                    </Button>
                    {record.isActive ? (
                        <Button
                            type="link"
                            onClick={() => {
                                console.log(record);
                            }}
                        >
                            Deactivate
                        </Button>
                    ) : (
                        <Button
                            type="link"
                            onClick={() => {
                                console.log(record);
                            }}
                        >
                            Activate
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const handleCancel = () => {
        if(view !== VIEW_NAMES.SHOWS) {
            setView(VIEW_NAMES.SHOWS);
        } else {
            setView(VIEW_NAMES.SHOWS);
            onClose();
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={1200}
            title={theater.name}
            centered
        >
            <div className="flex justify-between items-center mb-2">
                <h3>
                    {view === VIEW_NAMES.SHOWS
                        ? "List of Show"
                        : view === VIEW_NAMES.ADD
                        ? "Add Show"
                        : "Edit Show"}
                </h3>
                {view === VIEW_NAMES.SHOWS && (
                    <Button type="primary" onClick={() => setView(VIEW_NAMES.ADD)}>
                        Add Show
                    </Button>
                )}
            </div>
            {view === VIEW_NAMES.SHOWS && shows.length > 0 && <Table columns={columns} dataSource={shows} />}
            {view !== VIEW_NAMES.SHOWS && (
                <Form
                    className=""
                    layout="vertical"
                    style={{ width: "100%" }}
                    initialValues={view === VIEW_NAMES.EDIT ? selectedShow : null}
                    onFinish={onFinish}
                >
                    <Row
                        gutter={{
                            xs: 6,
                            sm: 10,
                            md: 12,
                            lg: 16,
                        }}
                    >
                        <Col span={24}>
                            <Row
                                gutter={{
                                    xs: 6,
                                    sm: 10,
                                    md: 12,
                                    lg: 16,
                                }}
                            >
                                <Col span={8}>
                                    <Form.Item
                                        label="Show Name"
                                        htmlFor="name"
                                        name="name"
                                        className="block"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Show name is required!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Enter the show name"
                                        ></Input>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Show Date"
                                        htmlFor="date"
                                        name="date"
                                        className="block"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Show date is required!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            id="date"
                                            type="date"
                                            placeholder="Enter the show date"
                                        ></Input>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Show Timing"
                                        htmlFor="time"
                                        name="time"
                                        className="block"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Show time is required!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            id="time"
                                            type="time"
                                            placeholder="Enter the show date"
                                        ></Input>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row
                                gutter={{
                                    xs: 6,
                                    sm: 10,
                                    md: 12,
                                    lg: 16,
                                }}
                            >
                                <Col span={8}>
                                    <Form.Item
                                        label="Select the Movie"
                                        htmlFor="movie"
                                        name="movie"
                                        className="d-block"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Movie  is required!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            id="movie"
                                            name="movie"
                                            placeholder="Select Movie"
                                            options={movies.map((movie) => ({
                                                key: movie._id,
                                                value: movie._id,
                                                label: movie.name,
                                            }))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Ticket Price"
                                        htmlFor="price"
                                        name="price"
                                        className="d-block"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Ticket price is required!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="Enter the ticket price"
                                        ></Input>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Total Seats"
                                        htmlFor="totalSeats"
                                        name="totalSeats"
                                        className="d-block"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Total seats are required!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            id="totalSeats"
                                            type="number"
                                            placeholder="Enter the number of total seats"
                                        ></Input>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className="flex flex-col gap-3 justify-center max-w-40 ml-auto">
                        <Button
                            className=""
                            block
                            onClick={() => {
                                setView(VIEW_NAMES.SHOWS);
                            }}
                            htmlType="button"
                        >
                            <ArrowLeftOutlined /> Go Back
                        </Button>
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            style={{ fontSize: "1rem", fontWeight: "600" }}
                        >
                            {view === VIEW_NAMES.ADD ? "Add the Show" : "Edit the Show"}
                        </Button>
                    </div>
                </Form>
            )}
        </Modal>
    );
};

export default ShowModal;
