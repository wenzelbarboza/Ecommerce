import { Navigate, Outlet } from "react-router-dom";

type propType = {
  children?: React.ReactNode;
  isAuthenticated: boolean;
  adminRoute?: boolean;
  isAdmin?: boolean;
  redirect?: string;
};

const ProtectedRoute = ({
  isAdmin,
  isAuthenticated,
  children,
  adminRoute,
  redirect = "/",
}: propType) => {
  console.log("isAuthinticated: ", isAuthenticated);
  console.log("isAdmin: ", isAdmin);
  console.log("adminRoute : ", adminRoute);

  if (!isAuthenticated) return <Navigate to={redirect} />;

  // return <div>{isAdmin ? <Outlet /> : <Navigate to="/" />}</div>;

  if (adminRoute && !isAdmin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
