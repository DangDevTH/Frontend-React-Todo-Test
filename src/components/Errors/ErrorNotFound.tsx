import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

const ErrorNotFound = () => {
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="flex flex-col justify-center items-center w-96 max-w-lg rounded-lg border border-gray-300 p-6 shadow-lg dark:bg-gray-800">
        <div className="text-center dark:text-white">
          ไม่พบเนื้อหา 404
        </div>
        <Link to="/" className="mt-5 text-center">
          <Button>กลับหน้าหลัก</Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorNotFound;
