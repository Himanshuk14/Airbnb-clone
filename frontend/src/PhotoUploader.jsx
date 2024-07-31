import axios from "axios";
import { useState } from "react";

export default function PhotoUploader({
  addedPhotos,
  setAddedPhotos,
  coverImage,
  setCoverImage,
}) {
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
        {coverImage && (
          <div className=" border-primary">
            <img
              className="rounded-2xl w-full object-cover position-center"
              src={coverImage}
              alt="photo"
            />
          </div>
        )}
        {addedPhotos.length > 0 &&
          addedPhotos.map((photo) => {
            return (
              <div className="h-42 flex relative " key={photo}>
                <img
                  className="rounded-2xl w-full object-cover position-center"
                  src={photo}
                  alt="photo"
                />
                <button
                  onClick={() => removePhoto(link)}
                  className="cursor-pointer absolute bottom-2 right-2 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => removePhoto(link)}
                  className="cursor-pointer absolute bottom-2 left-2 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                </button>
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
