const Reservation = require("../../models/Reservation");

const UserReservation =  async (req, res) => {
  try {
    const { name, event, phone, email, people, date } = req.body;

    const newReservation =  new Reservation({
      name,
      event,
      phone,
      email,
      // password,
      people: Number(people),
      date,
    });

    await newReservation.save();
    res.status(201).json({ message: "Reservation saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const reservationListUser = async (req, res) => {
  try {
    const matchedReservation = await Reservation.find(); 

    if (!matchedReservation || matchedReservation.length === 0) {
      return res.status(404).json({ status: 0, message: "No reservation found." });
    }

    res.send({
      status: 1,
      message: "Matched reservation fetched successfully!",
      reservation: matchedReservation,
    });

  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({
      status: 0,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = {UserReservation,reservationListUser}