import UserIcon from "../Icons/User-Icons/UserIcon.svg"
import MainLogo from "../Icons/MainLogo2.svg"
import SettingsIcon from "../Icons/SettingsIcon.svg"
import UploadIcon from "../Icons/UploadResourcesIcon.svg"
import NotesIcon from "../Icons/NotesIcon.svg"
import CollabIcon from "../Icons/Home-Page-Icons/image 5.svg"
import MyDeskIcon from "../Icons/Home-Page-Icons/image 6.svg"
import ClockIcon from "../Icons/Home-Page-Icons/Clock Icon.svg"
import {Link, useNavigate} from "react-router-dom"
import TredingTopics from "./TredingTopics"


export default function HomePage(){

    const route = useNavigate();
    const switchPage = () => {
        route("/home-page/MyDeskPage");
    };
    const homepage = () => {
        route("/home-page/Collab")
    }

    let w = window.innerWidth;
    let isLargeScreen = false;

    if (w >= 1024){
        isLargeScreen = true;
        console.log(isLargeScreen);
    }
    else{
        isLargeScreen = false;
        console.log(isLargeScreen);
    }

    return(
        <div className="bg-gradient-to-br from-violet-400 via-violet-400 to-orange-400 flex justify-center w-screen h-screen pt-[2vh]">
            <div className="bg-[#F0F0F0] rounded-3xl w-[330px] h-[715px] sm:w-[500px] lg:w-[980px] flex flex-col justify-center p-6 font-[Krub] sm:ml-4 lg:rounded-none">

                <div className="bg-gradient-to-l from-violet-300 via-violet-300 to-orange-300 w-full h-12 rounded-sm -mt-5 flex flex-row py-1">
                    <div div className="w-[85%] flex justify-center">
                        {isLargeScreen 
                        ?<div className="bg-gradient-to-r from-orange-50 to-violet-100 rounded-3xl w-70 h-10 flex flex-row justify-start pl-1 -mr-6">
                            <img className="scale-98" src={MainLogo}/>
                            <strong className="text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-violet-400 mt-2 ml-2 text-xl">Innovation Lounge</strong>
                        </div> 
                        :<img className="scale-86 -mr-6" src={MainLogo}/>
                        }
                    </div>
                    <img className="scale-80" src={UserIcon}/>
                </div>

                <hr className="mt-1.5"/>

                <p className="text-left bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-violet-400 text-xs mt-4">Code Mafia Presents</p>

                <div className="bg-gradient-to-br from-orange-300 to-violet-300 w-[95%] h-43 rounded-lg  flex flex-col justify-center mb-4">
                    <div className="bg-[#F0F0F0] w-[99%] h-42 mx-0.5 rounded-sm p-3 lg:w-[99.5%]">
                        <div className="flex flex-row lg:justify-center">
                            <img className="scale-90" src={CollabIcon}/>
                            <h1 className="text-sm lg:ml-6">Join Our collaboration Community Now.</h1>
                        </div>
                        <div className="lg:flex lg:justify-center lg:my-3">
                            {isLargeScreen 
                            ?<p className="text-xs mb-2 flex justify-center">This is where you can experience a group community with like minded ideas</p> 
                            :<p className="text-xs mb-2 flex justify-center">This is where you can experience a <br/>group community with like minded <br/>ideas</p>
                            }

                        </div>
                        <div className="lg:flex lg:justify-center">
                            <button className="bg-black text-white text-xs rounded-sm w-35 h-8 lg:w-73 lg:h-10 cursor-pointer" onClick={homepage}>Come Collab Now</button>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-300 to-violet-300 w-[95%] h-43 rounded-lg  flex flex-col justify-center mb-4">
                    <div className="bg-[#F0F0F0] w-[99%] h-42 mx-0.5 rounded-sm p-3 lg:w-[99.5%]">
                        <div className="flex flex-row lg:justify-center"> 
                            <img className="scale-82" src={MyDeskIcon}/>
                            <h1 className="text-sm lg:ml-6">Check Out My Desk Feature.</h1>
                        </div>
                        {isLargeScreen 
                        ?<p className="text-xs mb-2 lg:flex lg:justify-center lg:my-3">Where general chat ideas meet and are helped with our AI summarization tool.</p>
                        :<p className="text-xs mb-2 lg:flex lg:justify-center">Where general chat ideas meet and <br/>are helped with our AI <br/>summarization tool.</p>
                        }
                        <div className="lg:flex lg:justify-center">
                            <button className="bg-black text-xs text-white rounded-sm w-35 h-8 lg:w-73 lg:h-10 cursor-pointer" onClick={switchPage}>Look At My Desk</button>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-300 to-violet-300 w-[95%] h-43 rounded-lg  flex flex-col justify-center">
                    <div className="bg-[#F0F0F0] w-[99%] h-42 mx-0.5 rounded-md p-3 lg:w-[99.5%]">

                        <div className="flex flex-row mb-1 lg:flex lg:justify-center">
                            <img className="scale-80" src={ClockIcon}/>
                            <h1>Treding Topics</h1>
                        </div>
                        <div className="overflow-auto h-30 lg:overflow-visible lg:flex lg:flex-row lg:justify-center">
                            <TredingTopics/>
                            <TredingTopics/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row mt-2">

                    {isLargeScreen ? <div/> : 
                    <div>
                        <div className="w-[85%]">
                            <img className="scale-75" src={SettingsIcon}></img>
                        </div>

                        <img className="scale-75" src={UploadIcon}></img>
                        <img className="scale-75" src={NotesIcon}></img>

                    </div>

                    }

                </div>

            </div>
        </div>
    )
}