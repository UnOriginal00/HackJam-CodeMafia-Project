import MyDeskSideBar from "./MyDeskSideBar"
import UserIcon from "../Icons/User-Icons/UserIcon.svg"
import HamburgerIcon from "../Icons/MyDeskIcons/Hamburger Icon.svg"
import SendIcon from "../Icons/MyDeskIcons/SendIcon.svg"
import MainLogo from "../Icons/MainLogo2.svg"
import MagnifyingIcon from "../Icons/Magnifying-glass.svg"
import NotificationIcon from "../Icons/NotificationIcon.svg"
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import MyDeskSBDesktop from "./MyDeskSBDesktop"
import ProfileSideBar from "./ProfileSideBar"

export default function Resources(){
    const [isVisble, setIsVisble] = useState(false);
    const route = useNavigate();
    const switchPage = () => {
        route("/home-page");
    };
    const showComponet = () => {
        setIsVisble(!isVisble);
    };

    let w = window.innerWidth;
    let isLargeScreen; //Boolean value

    if (w >= 1024){
        isLargeScreen = true;
    }
    else{
        isLargeScreen = false;
    }


    return(
        <div className="bg-gradient-to-br from-violet-400 via-violet-400 to-orange-400 flex justify-center w-screen h-screen pt-[5vh]">
            <div className="bg-[#F0F0F0] rounded-3xl w-[320px] h-[600px] flex flex-col justify-center p-6 font-[Krub] lg:w-[980px]">

                <div className="w-full h-12 -mt-16 flex flex-row">
                    <div className="w-[85%] flex flex-row lg:w-0">
                        {isLargeScreen ? <div/>
                        :<button onClick={showComponet}>
                            <img className="scale-50"src={HamburgerIcon}/>
                        </button>
                        }
                        
                    </div>
                    {isLargeScreen
                    ?<div className="lg:flex lg:flex-row ml-2">
                        <img className="lg:scale-95 lg:row-span-4 lg:-mt-1 lg:opacity-75" src={MainLogo}/>
                        <p className="lg:bg-clip-text lg:text-transparent lg:bg-gradient-to-r lg:from-orange-400 lg:to-violet-400 lg:mt-2 lg:ml-1 lg:text-xl lg:w-50">
                            <strong>Innovation Lounge</strong>
                        </p> 
                        <div className="border border-gray-400 rounded-3xl ml-3 w-90 h-10 bg-gray-100 flex flex-row">
                            <img className="scale-65" src={MagnifyingIcon}/>
                            <input className="w-65"/>
                        </div>
                    </div> : <div/>
                    }
                    <div className="flex flex-row ml-50">
                        <img className="scale-65" src={NotificationIcon}/>
                        <button className="cursor-pointer" onClick={showComponet}>
                            <img className="scale-65 lg:scale-95" src={UserIcon}/>
                        </button>
                    </div>
                    
                </div>

                <hr className="my-1.5"/>

                <div className="lg:h-115 lg:grid lg:grid-flow-col lg:grid-rows-3 lg:gap-2">
                    
                    {isLargeScreen 
                    ?<div className="row-span-3 lg: w-68 p-1.5">
                        <MyDeskSBDesktop/>
                    </div> 
                    :<div/>
                    }

                    <div className="border border-gray-300 rounded-sm h-[85%] lg:w-165 lg:col-span-2 lg:row-span-2 lg:h-110">
                        {isLargeScreen ? <div/> : (isVisble && <MyDeskSideBar/>) }
                        {isVisble && <ProfileSideBar/>}
                    </div>
                    
                    {isLargeScreen ? <div/> : <hr className="mt-2"/>}

                    <div className="mt-2 lg:col-span-2">
                        <div className="flex flex-row lg:mt-32">
                            <textarea className="resize-none w-95 h-12 bg-gray-300 rounded-sm pl-2 pt-2 lg:w-165 lg:-ml-2" type="text" placeholder="Type a message..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
