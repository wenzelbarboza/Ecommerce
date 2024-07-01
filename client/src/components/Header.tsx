import { useState } from "react";
import {
  FaLockOpen,
  FaSearch,
  FaSign,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";

const user = { _id: "", role: "admin" };

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="header">
      <div className="container flex nav-container">
        <Link to="/">Home</Link>
        <div className="header-links">
          <Link to="/search">
            <FaSearch />
          </Link>
          <Link to="/cart">
            <FaBagShopping />
          </Link>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {user?.role == "admin" && (
                <Link to="/admin/dashboard">
                  <FaLockOpen />
                </Link>
              )}
            </div>
            <Link to="/orders">Orders</Link>
            <button>
              <FaSignOutAlt />
            </button>
          </dialog>
          {user?._id ? (
            <>
              <button>
                <FaUser />
              </button>
            </>
          ) : (
            <Link to="/login">
              <FaSign />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
