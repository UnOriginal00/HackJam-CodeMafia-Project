import { Link, useNavigate } from "react-router-dom"
import MainLogo from "../Icons/MainLogo.svg"
import Arrow from "../Icons/Arrow.svg"
import React, { useState, useContext } from "react";
import { AuthContext } from "../../../auth/AuthContext";


export default function LoginPage(){
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    }
  }

  return(
    <div className="bg-gradient-to-br from-violet-400 via-violet-400 to-orange-400 flex justify-center w-screen h-screen pt-[15vh]">
      <form onSubmit={submit} className="bg-[#F0F0F0] rounded-3xl w-[350px] h-[530px] flex flex-col justify-center p-4 font-[Krub]">
        <div className="w-full flex justify-center pt-1">
          <img className="size-16" src={MainLogo} alt="logo" />
        </div>
        <h2 className="text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-violet-400 text-2xl"><strong>Collaboration Hub</strong></h2>
        <p className="text-[#000000] text-center">Welcome back! Sign in to access your workspace.</p>

        <div className="py-2">
          <p className="text-[#000000]">Email Address</p>
          <input value={email} onChange={e => setEmail(e.target.value)} className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full h-8 pl-2" placeholder=" Enter your Email" autoFocus />
        </div>

        <div className="pt-2 pb-1.5">
          <p className="text-[#000000]">Password</p>
          <input value={password} onChange={e => setPassword(e.target.value)} className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full h-8 pl-2" placeholder=" Enter your Password" type="password" />
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <div className="flex flex-row justify-between pb-8 pt-2">
          <div className="flex flex-row">
            <input type="checkbox" />
            <p className="text-[#000000] pl-2 inline">Remember Me</p>
          </div>
          <p className="text-violet-400"><u>Forgot Password?</u></p>
        </div>

        <button className="border-none bg-gradient-to-r from-orange-300 to-violet-400 text-[#000000] rounded-md h-10" type="submit">
          <div className="text-sm flex flex-row justify-center cursor-pointer">Sign In <img className="size-5 pt-0.5 pl-1.5" src={Arrow} alt="arrow" /></div>
        </button>

        <div className="flex flex-row text-xs justify-center py-4">
          <p className="text-[#000000]">Don't have an account?</p>
          <Link to={"/"}>
            <p className="text-orange-300">Join the Collaboration Hub</p>
          </Link>
        </div>

        <hr className="text-[#000000]"/>

        <p className="text-xs text-gray-400 text-center pt-4">"Where ideas are Shared and Transformed."</p>
      </form>
    </div>
  )
}