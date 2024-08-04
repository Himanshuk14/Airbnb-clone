import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const getAllBookings = async () => {
      const { data } = await axios.get("/bookings/getAll");
      setBookings(data.data);
    };
    getAllBookings();
  }, []);

  return (
    <div>
      <AccountNav />
      {bookings.length > 0 &&
        bookings.map((booking) => {
          return <div>{booking.name}</div>;
        })}
    </div>
  );
}
