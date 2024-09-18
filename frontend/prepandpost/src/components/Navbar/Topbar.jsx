import Logo from "../../assets/mainlogo.png";
import { Bell } from "lucide-react";

const Topbar = () => {
  return (
    <div className="border-b-2 border-gray-200">
      <div className="w-[85%]  mx-auto mt-1 flex justify-between items-center p-2">
        <div>
          {/* home logo */}
          <img src={Logo} alt="logo" width={150} height={30} />
        </div>
        <div className="flex gap-7 align-middle">
          {/* constent */}
          <div>
            <a
              href="#"
              className="text-gray-600  hover:text-black flex flex-col items-center"
            >
              <p className="font-medium">Prepare</p>
            </a>
          </div>
          <div>
            <a
              href="#"
              className="text-gray-600  hover:text-black flex flex-col items-center"
            >
              <p className="font-medium">Practice</p>
            </a>
          </div>
          <div>
            <a
              href="#"
              className="text-gray-600  hover:text-black flex flex-col items-center"
            >
              <p className="font-medium">Resume Checker</p>
            </a>
          </div>
          <div>
            <a href="#" className="text-gray-600 hover:text-black">
              <p className="font-medium">Post</p>
            </a>
          </div>

          <div>
            <a href="#" className="text-gray-600  hover:text-black">
              <p className="font-medium">Networks</p>
            </a>
          </div>

          <div>
            <a href="#" className="text-gray-600  hover:text-black">
              <p className="font-medium">Job</p>
            </a>
          </div>
        </div>
        <div className="flex gap-5 items-center">
          {/* login signup */}
          <div>
            <Bell size={25} />
          </div>
          <button className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
