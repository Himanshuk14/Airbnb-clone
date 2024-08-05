export default function PlaceImg({ place }) {
  if (!place.coverImage) return "";
  return (
    <img
      src={place.coverImage}
      alt={place.title}
      className="w-full h-full object-fill"
    />
  );
}
