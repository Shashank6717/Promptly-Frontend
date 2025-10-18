import Loader from "./Loader";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <Loader />
        <p className="text-amber-700 font-medium mt-4">{message}</p>
      </div>
    </div>
  );
}
