import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";
import PhotoUploader from "../PhotoUploader";
import AccountNav from "../AccountNav";

export default function PlacesFormPage() {
  const { id } = useParams();
  //   useEffect(() => {
  //     if (!id) return;
  //     axios.get(`/places/${id}`).then((response) => {
  //       const { data } = response;
  //     });
  //   }, [id]);

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);

  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  async function addNewPlaces(e) {
    e.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkInTime,
      checkOutTime,
      maxGuests,
    };
    const { data } = await axios.post("/places", placeData);
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to="/account/places" />;
  }

  return (
    <div>
      <AccountNav />
      <form className="max-w-xl mx-auto" onSubmit={addNewPlaces}>
        <h2 className="text-2xl mt-4">Title</h2>
        <p className="text-gray-500 text-sm">Title for your place </p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title ,for example:My lovely apartment"
        />
        <h2 className="text-2xl">Address</h2>
        <p className="text-gray-500 text-sm">Address to this place </p>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />{" "}
        <h2 className="text-2xl">photos</h2>
        <p className="text-gray-500 text-sm">The more the better </p>
        <PhotoUploader
          addedPhotos={addedPhotos}
          setAddedPhotos={setAddedPhotos}
        />
        <h2 className="text-2xl mt-4">Description</h2>
        <p className="text-gray-500 text-sm">Description of the place </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <h2 className="text-2xl mt-4">Perks</h2>
        <p className="text-gray-500 text-sm">
          Select the all perks of your place of your place{" "}
        </p>
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        <h2 className="text-2xl mt-4">Extra info</h2>
        <p className="text-gray-500 text-sm">house rules, etc</p>
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
        <h2 className="text-2xl mt-4">Check in and out time</h2>
        <p className="text-gray-500 text-sm">add the check in and out time</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <div>
            <h3 className="mt-2 -mb-1 ">Check in time</h3>
            <input
              type="text"
              onChange={(e) => {
                setCheckInTime(e.target.value);
              }}
              value={checkInTime}
              placeholder="14:00"
            />
          </div>
          <div>
            <h3>Check out time</h3>
            <input
              type="text"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              placeholder="11"
            />
          </div>
          <div>
            <h3>max no of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button className="primary my-4">Add place</button>
        </div>
      </form>
    </div>
  );
}
