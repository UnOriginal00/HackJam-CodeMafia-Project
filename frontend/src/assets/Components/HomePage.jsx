import UserIcon from "../Icons/User-Icons/UserIcon.svg"
import MainLogo from "../Icons/MainLogo2.svg"


export default function HomePage(){
    return(
        <div className="bg-gradient-to-br from-violet-400 via-violet-400 to-orange-400 flex justify-center w-screen h-screen pt-[15vh]">
            <div className="bg-[#F0F0F0] rounded-3xl w-[400px] h-[530px] flex flex-col justify-center  p-6 font-[Krub]">

                <div className="bg-gradient-to-r from-orange-300 via-violet-300 to-violet-300 h-12 rounded-sm -mt-10 flex flex-row display">
                    <div className="w-full flex justify-center">
                        <img className="size-11 pt-2 pl-2.5" src={MainLogo}/>
                    </div>
                    <img className="size-10 pt-2" src={UserIcon}/>
                </div>

                <hr className="mt-2 mb-20"/>

                <p className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-violet-400 to-violet-400 mb-3">Code Mafia Presents</p>

                <div className="relative p-px bg-gradient-to-br from-orange-300 to-violet-300 rounded-lg flex flex-col">

                    <div className="bg-[#F0F0F0] p-2 rounded-md">

                        <div className="flex flex-col items-center justify-center pb-6">
                            <p className="text-center py-4">Join Our Collaboration Community <br/>Now.</p>
                            <button className="bg-violet-400 py-3 px-11 w-50 rounded-sm text-[#F0F0F0]">Collab</button>
                        </div>

                        <div className="flex flex-col items-center justify-center pb-6">
                            <p className="text-center pb-4">Check Out Our My Desk feature</p>
                            <button className="bg-violet-400 py-3 px-2 w-50 rounded-sm text-[#F0F0F0]">My Desk</button>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}