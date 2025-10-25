import MyDeskSideBar from "./MyDeskSideBar"
import UserIcon from "../Icons/User-Icons/UserIcon.svg"
import HamburgerIcon from "../Icons/MyDeskIcons/Hamburger Icon.svg"
import SendIcon from "../Icons/MyDeskIcons/SendIcon.svg"
import { useState } from "react"


export default function MyDeskPage(){
    const [isVisble, setIsVisble] = useState(false);

    const showComponet = () => {
        setIsVisble(!isVisble);
    };

    return(
        <div className="bg-gradient-to-br from-violet-400 via-violet-400 to-orange-400 flex justify-center w-screen h-screen pt-[5vh]">
            <div className="bg-[#F0F0F0] rounded-3xl w-[320px] h-[600px] flex flex-col justify-center p-6 font-[Krub]">

                <div className="w-full h-12 -mt-16 flex flex-row">
                    <div className="w-[85%] flex flex-row">
                        <button onClick={showComponet}>
                            <img className="scale-50"src={HamburgerIcon}/>
                        </button>
                        <p className="pt-3 pl-2">My Desk</p>
                    </div>
                    <img className="scale-65" src={UserIcon}/>
                </div>

                <hr className="my-1.5"/>

                <div className="border border-gray-300 rounded-sm h-[75%]">
                    {isVisble && <MyDeskSideBar/>}
                </div>

                <hr className="mt-2"/>

                <div className="mt-2 flex flex-row">
                    <textarea className="resize-none w-95 h-12 bg-gray-300 rounded-sm pl-2 pt-2" type="text" placeholder="Type a message..."></textarea>

                    <button className="bg-gray-300 ml-2 w-18  flex justify-center rounded-sm">
                        <img className="scale-50" src={SendIcon}/>
                    </button>

                </div>

            </div>
        </div>
    )
}