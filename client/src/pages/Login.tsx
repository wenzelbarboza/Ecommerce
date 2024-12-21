import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";
// import { useLoginMutation, useloginMutationType } from "../redux/api/userApi";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { User } from "../types/api.types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const userMutation = useMutation({
    mutationFn: async (user: User) => {
      return axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/user/new`,
        user
      );
    },
  });

  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [gender, setGender] = useState<string>("");

  // const [login] = useLoginMutation<useloginMutationType>();

  const googleSignInHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userRes = await signInWithPopup(auth, provider);
      console.log(userRes);
      const { user } = userRes;

      await userMutation.mutateAsync({
        id: user.uid,
        dob: date,
        email: user.email!,
        gender: gender,
        name: user.displayName!,
        photo: user.photoURL!,
      });

      // const loginRes = await login({
      //   id: user.uid,
      //   dob: date,
      //   email: user.email!,
      //   gender: gender,
      //   name: user.displayName!,
      //   photo: user.photoURL!,
      // });

      console.log("login from the db:", userMutation.data);
      navigate("/");
    } catch (error: any) {
      toast(error.message || "error could not login");
      console.log(error);
    }
  };

  return (
    <div className="custom-container flex justify-center items-center">
      <main className=" w-80 sm:w-72 border-[1px] border-gray-300 rounded-sm p-2 flex flex-col items-stretch gap-3 shadow-md">
        <h1 className="text-2xl font-light">Login</h1>

        <div className="flex flex-col items-stretch gap-1">
          <label>Gender</label>
          <select
            className="p-1 border-[1px] border-gray-400 rounded-sm"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div className="flex flex-col items-stretch gap-1">
          <label className="block">Date of birth</label>
          <input
            className="p-1 border-[1px] border-gray-400 rounded-sm"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-stretch gap-1">
          <p>Already Signed In Once</p>
          <Button onClick={googleSignInHandler}>
            <FaGoogle /> <span className="ml-2">Sign in with Google</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Login;
