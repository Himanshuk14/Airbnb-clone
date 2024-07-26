import axios from "axios";
import { useState } from "react";

export default function PhotoUploader({ addedPhotos, setAddedPhotos }) {
  const [photoLink, setPhotoLink] = useState("");
  async function addByLink(e) {
    e.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    setAddedPhotos((prev) => {
      return [...prev, filename];
    });
    setPhotoLink("");
    console.log("added photos", addedPhotos);
  }
  async function uploadPhoto(e) {
    const formData = new FormData();
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i]);
    }

    const { data: filenames } = await axios.post("/upload", formData);
    setAddedPhotos((prev) => {
      return [...prev, ...filenames];
    });
  }
  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          value={photoLink}
          onChange={(e) => setPhotoLink(e.target.value)}
          placeholder="photo url"
        />
        <button className="bg-gray-200 px-4 rounded-2xl" onClick={addByLink}>
          Add photo
        </button>
      </div>
      <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ">
        {addedPhotos.length > 0 &&
          addedPhotos.map((photo) => {
            return (
              <div className="h-42 flex " key={photo}>
                <img
                  className="rounded-2xl w-full object-cover position-center"
                  src={`http://localhost:4000/uploads/` + photo}
                  alt="photo"
                />
              </div>
            );
          })}
        <label className="h-32 cursor-pointer border flex items-center gap-1 justify-center bg-transparent rounded-2xl p-2 text-2xl text-gray-600 lg:grid">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={uploadPhoto}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>
          upload
        </label>
      </div>
    </>
  );
}
