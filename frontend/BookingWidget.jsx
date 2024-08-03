import { useState } from "react";
import { differenceInDays } from "date-fns/differenceInDays";
export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  let numberOfDays = 0;
  if (checkIn && checkOut) {
    numberOfDays = differenceInDays(new Date(checkOut), new Date(checkIn));
  }
  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: &#8377;{place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className=" py-3 px-4 ">
            <label>check in:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className=" py-3 px-4 border-l">
            <label>check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className=" py-3 px-4 border-t">
            <label>Number of guests:</label>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
        </div>
        {numberOfDays > 0 && (
          <div className=" py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        )}
      </div>

      <button className="mt-4 primary">
        Book this place
        {numberOfDays > 0 && <span> &#8377;{numberOfDays * place.price}</span>}
      </button>
    </div>
  );
}
