import { TbError404 } from "react-icons/tb";
import { PiImageBrokenDuotone } from "react-icons/pi";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className=" flex h-screen w-screen justify-center items-center flex-col">
      <h1 className="flex items-center justify-center gap-3">
        {<TbError404 className=" text-3xl" />} page not found{" "}
        {<PiImageBrokenDuotone className=" text-3xl" />}
      </h1>

      <h1 className="">
        <Link className="flex gap-3 items-center justify-center" to="/">
          Go back to home {<FaHome className="text-3xl" />}
        </Link>
      </h1>
    </div>
  );
};

export default NotFound;
