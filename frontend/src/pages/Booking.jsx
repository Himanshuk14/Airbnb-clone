import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import { differenceInDays } from "date-fns/differenceInDays";

import BookingDate from "../BookingDates";

export default function Booking() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    const getTheBooking = async () => {
      const { data } = await axios.get(`/bookings/get-a-booking/${id}`);
      setBooking(data.data);
    };
    if (id) {
      getTheBooking();
    }
  }, [id]);
  if (!booking) {
    return <div>Loading the booking...</div>;
  }
  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink place={booking.place} />
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDate booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total Price:</div>
          <div className="text-3xl">
            &#8377;
            {differenceInDays(
              new Date(booking.checkOut),
              new Date(booking.checkIn)
            ) * booking.place.price}
          </div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}
