import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPages() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    const getAllPlaces = async () => {
      const { data } = await axios.get("/places/get-all-places");
      setPlaces(data.data);
    };
    getAllPlaces();
  }, []);

  return (
    <div className="mt-8  grid gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 &&
        places.map((place) => {
          return (
            <Link to={`/places/${place._id}`} key={place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                <img
                  src={place.coverImage}
                  className="object-cover aspect-square"
                />
              </div>
              <h2 className="font-bold">{place.address}</h2>
              <h3 className="text-gray-700 text-sm">{place.title}</h3>
              <p>Hosted by {place.owner}</p>
              <div className="mt-1">
                <span className="font-bold">&#8377; {place.price}</span> per
                night
              </div>
            </Link>
          );
        })}
    </div>
  );
}
