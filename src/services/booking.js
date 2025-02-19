const { BookingRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const axios = require("axios");
const booking = new BookingRepository();
const FLIGHT_URL = process.env.FLIGHT_SERVICE_URL;
const { sequelize } = require("../models");
const { INITIATED } = require("../utils/common/enums").BOOKING_STATUS;
const AWS = require("aws-sdk");

const sqs = new AWS.SQS({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACESS_KEY_ID,
  secretAcessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const bookingqueueUrl = process.env.SQS_BOOKING_QUEUE_URL;
const confirmqueuerul = process.env.SQS_BOOKING_CONFIRMATION_QUEUE_URL;

const sendBookingEvent = async (bookingData) => {
  const params = {
    MessageBody: JSON.stringify(bookingData),
    QueueUrl: bookingqueueUrl,
  };

  try {
    const response = await sqs.sendMessage(params).promise();
    console.log("📤 Booking event sent to SQS:", bookingData);
    console.log("✅ Message ID:", response.MessageId);
  } catch (err) {
    console.error("❌ Error sending booking event to SQS:", err);
  }
};

const waitForConfirmation = async (bookingId, timeout = 30000) => {
  const curr = Date.now();

  while (Date.now() - curr < timeout) {
    const params = {
      QueueUrl: confirmqueuerul,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
    };

    try {
      const resp = await sqs.receiveMessage(params).promise();

      if (resp.Messages) {
        for (const message of resp.Messages) {
          const parsedBody = JSON.parse(message.Body);
          const { bookingId: confirmedId, status } = parsedBody;
          if (confirmedId === bookingId) {
            await sqs
              .deleteMessage({
                QueueUrl: confirmqueuerul,
                ReceiptHandle: message.ReceiptHandle,
              })
              .promise();
            console.log(
              `Booking ${bookingId} has been successfuly done with status : ${status}`
            );
            return status;
          }
        }
      }
    } catch (err) {
      console.error("❌ Error polling for confirmation:", error);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new AppError(
    "Booking confirmation timeout",
    StatusCodes.REQUEST_TIMEOUT
  );
};

const createBooking = async ({ flightId, userId, noofSeats }) => {
  try {
    const resp = await axios.get(`${FLIGHT_URL}/flights/${flightId}`);

    if (!resp.data) {
      throw new AppError(
        "Flight not found ",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    // console.log(resp);
    // const flight = resp.data.data;

    const flight = resp.data.data;
    if (flight.totalSeats < noofSeats) {
      throw new AppError(
        "Not enough seats are available",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    console.log(flight);
    console.log(flightId, userId, noofSeats);
    console.log("hello");
    const totalCosts = flight.price * noofSeats;
    console.log(totalCosts);
    const book = await booking.create({
      flightId,
      userId,
      noofSeats,
      totalCosts,
      status: INITIATED,
    });
    console.log(book);

    await sendBookingEvent({
      bookingId: book.id,
      flightId,
      userId,
      noofSeats,
      totalCosts,
      status: INITIATED,
    });

    const status = await waitForConfirmation(book.id);

    return { body: "Booking successfully done ", status };
  } catch (err) {
    console.log(err);
    throw new AppError(
      err.explanation ||
        "Something went wrong while trying to make the booking ",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { createBooking };
