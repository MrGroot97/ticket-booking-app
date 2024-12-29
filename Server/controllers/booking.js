import Show from "../models/showSchema.js";
import Booking from "../models/bookingSchema.js";
import Stripe from 'stripe';
import EmailHelper from "../services/mail/email.js";
import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const makePayment = async (req, res) => {
    try {
        // create a customer on stripe
        const { token, amount } = req.body;
        const customer = await stripeInstance.customers.create({
            email: token.email,
            source: token.id,
        });
        const payment = await stripeInstance.paymentIntents.create({
            amount,
            currency: "usd",
            description: "Movie Ticket Booking",
            customer: customer.id,
            payment_method_types: ["card"],
            receipt_email: token.email,
            payment_method: token.id,
            description: `Movie Ticket Booking`,
            confirm: true,
        });
        const transactionId = payment.id;
        res.status(200).json({
            success: true,
            data: { ...payment, transactionId },
            message: "Payment successful",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const bookShow = async (req, res) => {
    try {
        const { showId, seats, transactionId } = req.body;
        const show = await Show.findById(showId).populate("movie");
        if (!show) {
            return res
                .status(404)
                .json({ success: false, message: "Show not found" });
        }
        const booking = new Booking({
            show: showId,
            user: req.userId,
            seats,
            transactionId,
        });
        await booking.save();
        const updatedSeats = [...show.bookedSeats, ...seats];
        await Show.findByIdAndUpdate(showId, { bookedSeats: updatedSeats });

        res.status(201).json({
            success: true,
            data: booking,
            message: "Show booked successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.body.userId }).populate("user").populate("show")
            .populate({
                path: "show",
                populate: {
                    path: "movie",
                    model: "Movie",
                },
            })
            .populate({
                path: "show",
                populate: {
                    path: "theatre",
                    model: "Theatre",
                },
            });
        res.send({
            success: true,
            message: "Bookings fetched!",
            data: bookings,
        });
    } catch (err) {
        res.send({
            success: false,
            message: err.message,
        });
    }
};

const makePaymentAndBookShow = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { showId, seats, token } = req.body;
        const show = await Show.findById(showId).populate("movie").session(session);
        if (!show) {
            return res
                .status(404)
                .json({ success: false, message: "Show not found" });
        }
        const seatAlreadyBooked = seats.some((seat) =>
            show.bookedSeats.includes(seat)
        );
        if (seatAlreadyBooked) {
            return res.status(400).json({ success: false, message: "Seat already booked" });
        }
        const updatedSeats = [...show.bookedSeats, ...seats];
        await Show.findByIdAndUpdate(showId, { bookedSeats: updatedSeats });

        const amount = show.price * seats.length;
        const customers = await stripeInstance.customers.list({
            email: token.email,
            limit: 1,
        });
        let currCustomer;
        if (customers.data.length > 0) {
            currCustomer = customers.data[0];
        } else {
            currCustomer = await stripeInstance.customers.create({
                email: token.email
            });
        }
        const payment = await stripeInstance.paymentIntents.create({
            amount,
            currency: "usd",
            customer: currCustomer.id, // Use the existing or newly created customer ID
            payment_method_types: ["card"],
            receipt_email: token.email,
            description: "Movie Ticket Booking",
        });
        const transactionId = payment.id;

        const booking = new Booking({
            show: showId,
            user: req.userId,
            seats,
            transactionId,
        });
        await booking.save({ session });
        const populatedBooking = await Booking.findById(booking._id).populate("user").populate("show")
            .populate({
                path: "show",
                populate: {
                    path: "movie",
                    model: "Movie",
                },
            })
            .populate({
                path: "show",
                populate: {
                    path: "theatre",
                    model: "Theatre",
                },
            }).session(session); // populate the user, show, movie and theatre details, from session itself as we are using transaction session here

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            data: booking,
            message: "Show booked successfully",
        });
        await EmailHelper("ticket.html", populatedBooking.user.email, {
            name: populatedBooking.user.name,
            movie: populatedBooking.show.movie.name,
            theatre: populatedBooking.show.theatre.name,
            date: populatedBooking.show.date,
            time: populatedBooking.show.time,
            seats: populatedBooking.seats,
            amount: populatedBooking.seats.length * populatedBooking.show.ticketPrice,
            transactionId: populatedBooking.transactionId,
            });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        // for strip refund process
        // if (error.type === 'StripeCardError') {
        //     await stripeInstance.refunds.create({
        //         charge: error.raw.charge,
        //     });
        // }
        res.status(500).json({ success: false, message: error.message });
    }
}

export { makePayment, bookShow, getAllBookings, makePaymentAndBookShow };
