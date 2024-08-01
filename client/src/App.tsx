import { onAuthStateChanged } from "firebase/auth";
import { Suspense, lazy, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { auth } from "./Firebase";
import Header from "./components/Header";
import Loading from "./components/Loading";
import "./styles/app.scss";
// import { useDispatch } from "react-redux";
// import { userExists } from "./redux/reducer/userReducer";
import { useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import ProtectedRoute from "./components/ProtectedRoute";
import { userResponseType } from "./types/api.types";
import { useUserStore } from "./zustand/userStore";
import Loader from "./components/admin/Loader";

const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));

//Not logged in
const Login = lazy(() => import("./pages/Login"));

//Login required
const Shipping = lazy(() => import("./pages/Shipping"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDeatils = lazy(() => import("./pages/OrderDeatils"));

// Admin route imports
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

function App() {
  const userStore = useUserStore();
  const queryClient = useQueryClient();

  const fetchUser = async (uid: string) => {
    const { data }: AxiosResponse<userResponseType> = await axios.get(
      `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/user/${uid}`
    );
    // console.log("fetch user data:", data);
    return data.data;
  };

  // const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // find-zustand
          // userStore.setUser();
          // console.log("The firebaseUser is logged is: ", user.toJSON());
          const userData = await queryClient.fetchQuery({
            queryKey: ["user", user.uid],
            queryFn: () => fetchUser(user.uid),
          });
          // console.log("app tsx user from db: ", userData);
          userStore.setUser(userData);
          userStore.setLoading(false);
          // console.log("user from zustand", userStore.user);
        } else {
          userStore.setUser(null);
          userStore.setLoading(false);
          console.log("this is user store: ", userStore);
        }
      } catch (error) {
        console.log(error);
      }
    });

    return () => {};
  }, []);

  console.log("this is user store: ", userStore.user?.role);

  return userStore.loading ? (
    <Loader />
  ) : (
    <Router>
      {/* Header */}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/login"
              element={
                <ProtectedRoute isAuthenticated={userStore.user ? false : true}>
                  <Login />
                </ProtectedRoute>
              }
            />
            {/* Login required */}
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={userStore.user ? true : false}
                />
              }
            >
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order/:id" element={<OrderDeatils />} />
            </Route>
            {/* ADMIN routes */}
            {/* <Route
          element={
            <ProtectedRoute isAuthenticated={true} adminRoute={true} isAdmin={true} />
          }
          > */}

            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={userStore.user ? true : false}
                  adminRoute={true}
                  isAdmin={
                    userStore.user?.role?.toLowerCase() == "admin"
                      ? true
                      : false
                  }
                />
              }
            >
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/product" element={<Products />} />
              <Route path="/admin/customer" element={<Customers />} />
              <Route path="/admin/transaction" element={<Transaction />} />
              {/* Charts */}
              <Route path="/admin/chart/bar" element={<Barcharts />} />
              <Route path="/admin/chart/pie" element={<Piecharts />} />
              <Route path="/admin/chart/line" element={<Linecharts />} />
              {/* Apps */}
              <Route path="/admin/app/coupon" element={<Coupon />} />
              <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
              <Route path="/admin/app/toss" element={<Toss />} />

              {/* Management */}
              <Route path="/admin/product/new" element={<NewProduct />} />

              <Route
                path="/admin/product/:id"
                element={<ProductManagement />}
              />

              <Route
                path="/admin/transaction/:id"
                element={<TransactionManagement />}
              />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
