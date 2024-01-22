import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateBookingForm from "../bookings/CreateBookingForm";

function AddBooking() {
  return (
    <Modal>
      <Modal.Open opens="booking-form">
        <Button>Add Booking</Button>
      </Modal.Open>
      <Modal.Window name="booking-form">
        <CreateBookingForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddBooking;
