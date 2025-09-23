

export default function LoginPage(){
    return(
    <>
        <div className="bg-gradient-to-br from-violet-400 to-orange-400 flex justify-center w-screen h-screen pt-[15vh]">
            <div className="bg-[#F0F0F0] rounded-3xl w-[350px] h-[475px] flex flex-col justify-center p-4">

                <h2 className="text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-violet-400 text-2xl"><strong>Collaboration Hub</strong></h2>

                <p className="text-[#000000] text-center">Welcome back! Sign in to<br/>access your collaboration<br/>workspace.</p>

                {/*Email section*/}
                <div className="py-2">
                    <p className="text-[#000000]">Email Address</p>
                    <input className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full h-8" placeholder=" Enter your Email" autoFocus></input>
                </div>

                {/*Password section*/}
                <div className="pt-2 pb-1.5">
                    <p className="text-[#000000]">Password</p>
                    <input className="outline-solid outline-violet-400 outline-2 rounded-sm text-[#000000] w-full h-8" placeholder=" Enter your Password"></input>
                </div>

                <div className="flex flex-row justify-between pb-8">
                    <div className="flex flex-row">
                        <input className="" type="checkbox"></input>
                        <p className="text-[#000000] pl-2 inline">Remember Me</p>
                    </div>
                    <p className="text-violet-400"><u>Forgot Password?</u></p>
                </div>

                <button className="border-none bg-gradient-to-r from-orange-300 to-violet-400 text-[#000000]">Sign In</button>

                <div className="flex flex-row text-xs justify-center py-4">
                    <p className="text-[#000000]">Don't have an account?</p>
                    <p className="text-orange-300">Join the Collaboration Hub</p>
                </div>

                <hr className="text-[#000000]"/>

                <p className="text-xs text-gray-400 text-center pt-4">"Where ideas are Shared and Transformed."</p>

            </div>
        </div>
    </>
    )
}