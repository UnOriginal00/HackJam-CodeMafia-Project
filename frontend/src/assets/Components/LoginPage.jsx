import { Link, useNavigate } from "react-router-dom"
import MainLogo from "../Icons/MainLogo.svg"
import Arrow from "../Icons/Arrow.svg"
import { useState } from "react";

export default function LoginPage(){
    const [user, setUser] = useState({
        email : '',
        password : '',
    });

    const route = useNavigate();

    const switchPage = () => {
    route("/home-page");
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser(prev => ({...prev, [name] : value}))
    }

    const submit = async () => {
        if(!user.email || !user.password){
            alert("Please fill in both email and password fields");
            return;
        }

        const response = {
            email : user.email,
            password : user.password
        };

        try{
            const data = await fetch('https://localhost:7122/api/authentication/login', {
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify(response)
            })

            if(!data.ok){
                throw new Error("Failed to login into account");
            }

            route('/home-page');
        }
        catch (error){
            console.error(error);
        }
    }

    return(
    <>
        <div className="bg-gradient-to-br from-violet-400 via-violet-400 to-orange-400 flex justify-center w-screen h-screen pt-[15vh]">
            <div className="bg-[#F0F0F0] rounded-3xl w-[350px] h-[530px] flex flex-col justify-center p-4 font-[Krub]">

                <div className="w-full flex justify-center pt-1">
                    <img className="size-16" src={MainLogo}></img>
                </div>
                
                <h2 className="text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-violet-400 text-2xl"><strong>Collaboration Hub</strong></h2>

                <p className="text-[#000000] text-center">Welcome back! Sign in to<br/>access your collaboration<br/>workspace.</p>

                {/*Email section*/}
                <div className="py-2">
                    <p className="text-[#000000]">Email Address</p>
                    <input className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full h-8 pl-2" name="email" placeholder=" Enter your Email" autoFocus value={user.name} onChange={handleChange}>
                    </input>
                </div>

                {/*Password section*/}
                <div className="pt-2 pb-1.5">
                    <p className="text-[#000000]">Password</p>
                    <input className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full h-8 pl-2" name="password" placeholder=" Enter your Password" type="password" value={user.name} onChange={handleChange}>
                    </input>
                </div>

                <div className="flex flex-row justify-between pb-8 pt-2">
                    <div className="flex flex-row">
                        <input className="" type="checkbox"></input>
                        <p className="text-[#000000] pl-2 inline">Remember Me</p>
                    </div>
                    <p className="text-violet-400"><u>Forgot Password?</u></p>
                </div>

                <button className="border-none bg-gradient-to-r from-orange-300 to-violet-400 text-[#000000] rounded-md h-10" onClick={submit}>
                    <div className="text-sm flex flex-row justify-center cursor-pointer">Sign In <img className="size-5 pt-0.5 pl-1.5" src={Arrow}/></div>
                </button>

                <div className="flex flex-row text-xs justify-center py-4">
                    <p className="text-[#000000]">Don't have an account?</p>
                    <Link to={"/"}>
                        <p className="text-orange-300">Join the Collaboration Hub</p>
                    </Link>
                </div>

                <hr className="text-[#000000]"/>

                <p className="text-xs text-gray-400 text-center pt-4">"Where ideas are Shared and Transformed."</p>
            </div>
        </div>
    </>
    )
}