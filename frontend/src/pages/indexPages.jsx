import axios from "axios";
import { useEffect, useState } from "react";

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
    <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 &&
        places.map((place) => {
          return (
            <div className="bg-primary my-2 " key={place._id}>
              <img src={place.coverImage} className="object-cover" />
              <div className="font-bold">{place.title}</div>
              <p>Hosted by {place.owner}</p>
            </div>
          );
        })}
    </div>
  );
}
