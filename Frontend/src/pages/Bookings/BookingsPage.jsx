import { useState } from "react";
import { toast } from "react-toastify";
import BookingsTable from "./BookingsTable";
import { INITIAL_BOOKINGS_DATA } from "./bookings.mock";

export default function BookingsPage({ isDarkMode }) {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS_DATA);

  const updateBookingStatus = (id, status) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status } : b))
    );
    toast.success(`Booking ${status.toLowerCase()} successfully`);
  };

  return (
    <BookingsTable
      isDarkMode={isDarkMode}
      bookings={bookings}
      onStatusUpdate={updateBookingStatus}
    />
  );
}
