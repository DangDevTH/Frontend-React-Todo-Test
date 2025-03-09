const Unauthorized = () => {
  return (
    <div className="flex justify-center ">
      <div className="flex w-96 max-w-lg flex-col gap-4 rounded-lg border mt-5 border-gray-300 p-6 shadow-lg dark:bg-gray-800">
        <div className="text-center dark:text-white">
          กรุณาล็อกอินเข้าสู่ระบบ
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
