import Link from "next/link";
import "./dashboardCard.css";
interface cardDetailsType {
  title: string;
  description: string;
  path: string;
  buttonText: string;
}
const DashboardCard = ({
  title,
  description,
  path,
  buttonText,
}: cardDetailsType) => {
  return (
    <div
      className="card max-w-sm rounded-xl shadow-lg p-6 
                bg-linear-to-br from-blue-950 via-green-950 to-black 
                text-white"
    >
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-300 mb-4">{description}</p>
      <Link href={path}>
        <button
          className="px-4 py-2 rounded-lg 
                     bg-linear-to-r from-green-500 to-green-950 
                     text-white font-semibold shadow-md 
                     hover:from-indigo-600 hover:to-purple-700 
                     transition"
        >
          {buttonText}
        </button>
      </Link>
    </div>
  );
};

export default DashboardCard;
