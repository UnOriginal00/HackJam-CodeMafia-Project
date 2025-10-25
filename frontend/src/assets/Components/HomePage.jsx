import UserIcon from "../Icons/User-Icons/UserIcon.svg"
import MainLogo from "../Icons/MainLogo2.svg"
import SettingsIcon from "../Icons/SettingsIcon.svg"
import UploadIcon from "../Icons/UploadResourcesIcon.svg"
import NotesIcon from "../Icons/NotesIcon.svg"
import CollabIcon from "../Icons/Home-Page-Icons/image 5.svg"
import MyDeskIcon from "../Icons/Home-Page-Icons/image 6.svg"
import ClockIcon from "../Icons/Home-Page-Icons/Clock Icon.svg"
import {Link, useNavigate} from "react-router-dom"


export default function HomePage(){

    const route = useNavigate();
    const switchPage = () => {
        route("/home-page/MyDeskPage");
    };

    return(
        <div className="bg-gradient-to-br from-violet-400 via-violet-400 to-orange-400 flex justify-center w-screen h-screen pt-[6vh]">
            <div className="bg-[#F0F0F0] rounded-3xl w-[500px] h-[715px] flex flex-col justify-center  p-6 font-[Krub]">

                <div className="bg-gradient-to-l from-violet-300 via-violet-300 to-orange-300 w-full h-12 rounded-sm -mt-5 flex flex-row">
                    <div className="w-[85%] flex justify-center">
                        <img className="scale-86 -mr-6" src={MainLogo}/>
                    </div>
                    <img className="scale-80" src={UserIcon}/>
                </div>

                <hr className="mt-1.5"/>

                <p className="text-left bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-violet-400 text-xs mt-4">Code Mafia Presents</p>

                <div className="bg-gradient-to-br from-orange-300 to-violet-300 w-[95%] h-43 rounded-lg  flex flex-col justify-center mb-4">
                    <div className="bg-[#F0F0F0] w-[99%] h-42 mx-0.5 rounded-sm p-3">
                        <div className="flex flex-row">
                            <img className="scale-90" src={CollabIcon}/>
                            <h1>Join Our collaboration Community Now.</h1>
                        </div>
                        <p className="text-sm mb-2">This is where you can experience a <br/>group community with like minded <br/>ideas</p>
                        <button className="bg-black text-white rounded-sm w-45 h-12">Come Collab Now</button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-300 to-violet-300 w-[95%] h-43 rounded-lg  flex flex-col justify-center mb-4">
                    <div className="bg-[#F0F0F0] w-[99%] h-42 mx-0.5 rounded-sm p-3">
                        <div className="flex flex-row"> 
                            <img className="scale-82" src={MyDeskIcon}/>
                            <h1>Check Out My Desk Feature.</h1>
                        </div>
                        <p className="text-sm mb-2">Where general chat ideas meet and <br/>are helped with our AI <br/>summarization tool.</p>
                        <button className="bg-black text-white rounded-sm w-45 h-12" onClick={switchPage}>Look At My Desk</button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-300 to-violet-300 w-[95%] h-43 rounded-lg  flex flex-col justify-center">
                    <div className="bg-[#F0F0F0] w-[99%] h-42 mx-0.5 rounded-md p-3">

                        <div className="flex flex-row">
                            <img className="scale-80" src={ClockIcon}/>
                            <h1>Treding Topics</h1>
                        </div>


                        <div className="flex flex-row">
                            <div className="border border-gray-300 w-50 h-30 rounded-md mr-4 pt-2 px-2">
                                <p className="text-xs">New Python IDE Sweeps the developers room</p>
                                <p className="text-xs py1.5">From Sam</p>
                                <button className="bg-black text-white rounded-sm w-35 h-12 scale-75 -ml-4.5">Read</button>
                            </div>

                            <div className="border border-gray-300 w-50 h-30 rounded-md pt-2 px-2">
                                <p className="text-xs">AI development</p>
                                <p className="text-xs py-1.5">From Thabiso</p>
                                <button className="bg-black text-white rounded-sm w-35 h-12 scale-75 -ml-4.5">Read</button>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="flex flex-row mt-2">
                    <div className="w-[85%]">
                        <img className="scale-75" src={SettingsIcon}></img>
                    </div>
                    <img className="scale-75" src={UploadIcon}></img>
                    <img className="scale-75" src={NotesIcon}></img>
                </div>

            </div>
        </div>
    )
}