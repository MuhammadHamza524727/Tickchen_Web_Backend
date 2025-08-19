const express = require("express");
const router = express.Router();
const { UserReservation, reservationListUser } = require("../controller/web/reservation.controller");
const {reservationList, reservationPending, reservationRejected} = require("../controller/admin/reservationList.controller");


router.post("/", UserReservation);
router.get("/", reservationList)
//success work
// router.get("/",reservationSuccess )
router.put("/:id/accept",reservationPending )
router.put("/:id/reject",reservationRejected)
router.get("/reservation-user" ,reservationListUser)



module.exports = router;
