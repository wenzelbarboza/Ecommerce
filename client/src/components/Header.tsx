import { FaSearch, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { Link, Outlet } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useUserStore } from "../zustand/userStore";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";

const Header = () => {
  const userStore = useUserStore();

  console.log("user  is in local sotore: ", userStore.user);

  const handelSignOut = async () => {
    try {
      await signOut(auth);
      console.log(`user ${userStore.user?.name} signed out`);

      userStore.setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-lvh flex flex-col">
      <nav className=" border-b-[0.5px] border-slate-400 py-2 sticky top-0 z-10 bg-white">
        <div className="custom-container flex items-center">
          <Link to="/" className="">
            Home
          </Link>
          <div className="ml-auto flex gap-1">
            <Link
              to="/search"
              className={buttonVariants({ variant: "outline" })}
            >
              <FaSearch />
            </Link>
            <Link to="/cart" className={buttonVariants({ variant: "outline" })}>
              <FaBagShopping />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "outline" })}
              >
                <FaUser />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {userStore.user?.role == "ADMIN" && (
                  <DropdownMenuItem>
                    <Link to="/admin/dashboard">Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Link to="/orders">Orders</Link>
                </DropdownMenuItem>
                {userStore.user ? (
                  <>
                    <DropdownMenuItem onClick={handelSignOut}>
                      Sign out
                      <FaSignOutAlt className="ml-2" />
                    </DropdownMenuItem>
                  </>
                ) : (
                  <></>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {userStore.user?.id ? (
              <>
                {/* <button>
                  <FaUser />
                </button> */}
              </>
            ) : (
              <Link
                to="/login"
                className={buttonVariants({ variant: "outline" })}
              >
                LogIn <FaSignInAlt className="ml-1" />
              </Link>
            )}
          </div>
        </div>
      </nav>
      <div id="identify" className="flex flex-1 ">
        <Outlet />
      </div>
    </div>
  );
};

export default Header;
