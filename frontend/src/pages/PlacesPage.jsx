import { Link } from "react-router-dom";

import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places/get-all-places-of-a-user").then(({ data }) => {
      setPlaces(data.data);
    });
  }, []);

  return (
    <div>
      <AccountNav />

      <div className="text-center">
        <br />
        <Link
          to={"/account/places/new"}
          className="bg-primary gap-1 py-2 px-6 inline-flex text-white rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-4 ">
        {places.length === 0 && <div>No places added yet</div>}
        {places.map((place) => (
          <Link
            to={`/account/places/${place._id}`}
            key={place._id}
            className="bg-gray-100 gap-4 cursor-pointer p-4 rounded-2xl flex mb-2"
          >
            <div className="w-40 h-32 bg-primary p-1  flex shrink-0 ">
              {place.coverImage && (
                <img
                  src={place.coverImage}
                  alt={place.title}
                  className="w-full h-full object-fill"
                />
              )}
            </div>
            <div className="grow-0 shrink ">
              <h2 className="text-xl ">{place.title}</h2>
              <p className="text-sm mt-2 border-2 border-primary">
                {place.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
