import { Link } from "react-router-dom"
import MainLogo from "../Icons/MainLogo.svg"

export default function CreateAccount(){
    return(
        <div className="bg-gradient-to-br from-violet-400 to-orange-400 flex justify-center w-screen h-screen pt-[12vh]">
            <div className="bg-[#F0F0F0] rounded-3xl w-[365px] h-[580px] flex flex-col justify-center p-4 font-[Krub]">

                <div className="w-full flex justify-center">
                    <img className="size-16" src={MainLogo}></img>
                </div>

                <h2 className="text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-violet-400 text-2xl"><strong>Join Collaboration Hub</strong></h2>

                <p className="text-[#000000] text-center">Create your account now.</p>

                <div className=" flex flex-row gap-2 py-2">

                    <div className="flex flex-col">
                        <p className="text-[#000000]">First Name</p>
                        <input className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-[83%]"></input>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-[#000000]">Surname</p>
                        <input className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full"></input>
                    </div>

                </div>

                <div className="pb-2">
                    <p className="text-[#000000]">Phone Number</p>
                    <input className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full"></input>
                </div>

                <div className="pb-2">
                    <p className="text-[#000000]">Email Address</p>
                    <input className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full" type="email"></input>
                </div>

                <div className="pb-2">
                    <p className="text-[#000000]">Password</p>
                    <input className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full" type="password"></input>
                </div>

                <div className="pb-2">
                    <p className="text-[#000000]">Confirm Password</p>
                    <input className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full" type="password"></input>
                </div>

                <div className="flex flex-row text-xs justify-center py-2">
                    <input type="checkbox"></input>
                    <p className="text-[#000000]">I agree to the</p>
                    <p className="text-violet-400"> Terms and condition </p>
                    <p className="text-[#000000]"> and </p>
                    <p className="text-violet-400">Privacy Policy</p>
                </div>

                <button className="border-none bg-gradient-to-r from-orange-300 to-violet-400 text-[#000000]">Create Account</button>

                <div className="flex flex-row text-xs justify-center py-3">
                    <p className="text-[#000000]">Already have an account? </p>
                    <Link to={"/login-page"}>
                        <p className="text-violet-400"> Sign the Collaboration Hub</p>
                    </Link>
                </div>

                <hr className="text-[#000000]"/>

                <p className="text-xs text-gray-400 text-center pt-2">"Where ideas are Shared and Transformed."</p>

            </div>
        </div>
    )
}