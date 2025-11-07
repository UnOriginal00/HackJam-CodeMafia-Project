import { Link, useNavigate } from "react-router-dom";
import MainLogo from "../Icons/MainLogo.svg";
import Arrow from "../Icons/Arrow.svg";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../auth/AuthContext";

export default function CreateAccount() {
  const [newUser, setNewUser] = useState({
    name: "",
    surName: "",
    email: "",
    password: "",
    phoneNumber: ""
  });
  const [confirmPassword, setConfirmPassWord] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const route = useNavigate();
  const switchPage = () => {
    route("/home-page");
  };

  const authContext = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newUser.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (newUser.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Keep phone as a string to match backend DTO (PhoneNumber is defined as string).
    // Strip non-digit characters for basic validation and formatting (e.g. spaces, dashes).
    const rawPhone = newUser.phoneNumber ? String(newUser.phoneNumber).trim() : "";
    const digitsOnly = rawPhone.replace(/\D/g, "");
    if (!digitsOnly) {
      alert("Please enter a valid phone number");
      return;
    }

    const payload = {
      name: newUser.name,
      surName: newUser.surName,
      email: newUser.email,
      password: newUser.password,
      // send phone as a string (digits-only) to match backend expectations
      phoneNumber: digitsOnly
    };

    setLoading(true);
    try {
      // use AuthContext signup which will register then login
      await authContext.signup(payload);
      // on success, AuthContext.login navigates to /home-page
    } catch (err) {
      console.error(err);
      setError(err.message ?? "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-violet-400 via-violet-400 to-orange-400 flex justify-center w-screen h-screen pt-[12vh]">
      <form
        onSubmit={submit}
        className="bg-[#F0F0F0] rounded-3xl w-[365px] h-[580px] flex flex-col justify-center p-4 font-[Krub] shadow-lg transform transition duration-200 hover:scale-105 hover:shadow-2xl"
      >
        <div className="w-full flex justify-center">
          <img className="size-16" src={MainLogo} alt="logo" />
        </div>

        <h2 className="text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-violet-400 text-2xl">
          <strong>Join Collaboration Hub</strong>
        </h2>

        <p className="text-[#000000] text-center">Create your account now.</p>

        <div className="flex flex-row gap-2 py-2">
          <div className="flex flex-col">
            <p className="text-[#000000]">First Name</p>
            <input
              className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-[83%] pl-2"
              name="name"
              value={newUser.name}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <p className="text-[#000000]">Surname</p>
            <input
              className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full pl-2"
              name="surName"
              value={newUser.surName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pb-2">
          <p className="text-[#000000]">Phone Number</p>
          <input
            className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full pl-2"
            name="phoneNumber"
            value={newUser.phoneNumber}
            onChange={handleChange}
            type="tel"
            inputMode="tel"
            placeholder="e.g. 0712345678"
          />
        </div>

        <div className="pb-2">
          <p className="text-[#000000]">Email Address</p>
          <input
            className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full pl-2"
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
          />
        </div>

        <div className="pb-2">
          <p className="text-[#000000]">Password</p>
          <input
            className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full pl-2"
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleChange}
          />
        </div>

        <div className="pb-2">
          <p className="text-[#000000]">Confirm Password</p>
          <input
            className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full pl-2"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassWord(e.target.value)}
          />
        </div>

        <div className="flex flex-row text-xs justify-center py-2">
          <input type="checkbox" />
          <p className="text-[#000000] pl-2">I agree to the</p>
          <p className="text-violet-400"> Terms and condition </p>
          <p className="text-[#000000]"> and </p>
          <p className="text-violet-400">Privacy Policy</p>
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <button
          className="border-none bg-gradient-to-r from-orange-300 to-violet-400 text-[#000000] h-8 rounded-md cursor-pointer shadow"
          type="submit"
          disabled={loading}
        >
          <div className="text-xs flex flex-row justify-center">
            {loading ? "Creating..." : "Create Account"}{" "}
            <img className="size-5 pl-1.5 pb-1" src={Arrow} alt="arrow" />
          </div>
        </button>

        <div className="flex flex-row text-xs justify-center py-3">
          <p className="text-[#000000]">Already have an account? </p>
          <Link to={"/login-page"}>
            <p className="text-violet-400"> Sign the Collaboration Hub</p>
          </Link>
        </div>

        <hr className="text-[#000000]" />

        <p className="text-xs text-gray-400 text-center pt-2">"Where ideas are Shared and Transformed."</p>
      </form>
    </div>
  );
}