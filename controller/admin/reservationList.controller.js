const Reservation = require("../../models/Reservation");

const reservationList = async (req, res) => {
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





const reservationPending = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: 'Accepted' },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({
      message: 'Reservation accepted',
      reservation
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


const reservationRejected = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({
      message: 'Reservation rejected',
      reservation
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
module.exports = {reservationList,reservationPending,reservationRejected}