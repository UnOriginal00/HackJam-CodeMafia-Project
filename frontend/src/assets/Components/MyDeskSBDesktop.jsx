import NotesIcon from "../Icons/MyDeskIcons/Notes icon.svg"
import IdeasIcon from "../Icons/MyDeskIcons/Ideas icon.svg"
import CollabIcon from "../Icons/MyDeskIcons/Collab.svg"
import AIicon from "../Icons/MyDeskIcons/AI Icon.svg"
import { Link, useNavigate } from "react-router-dom"


export default function MyDeskSBDesktop(){

    return(
        <div className="lg:bg-gradient-to-br lg:from-violet-300 lg:via-violet-300 lg:to-orange-300 lg:rounded-sm lg:px-2 lg:h-123">
            <div className="flex flex-col">
                <Link to={"/resources"}>
                    <div className="bg-violet-200 rounded-sm w-60 h-14 my-4 flex flex-row pl-3 py-1.5">
                        <img className="scale-65" src={NotesIcon}/>
                        <div className="ml-1">
                            <p>Resources</p>
                            <p className="text-xs">Check out the resources</p>
                        </div>
                    </div>
                </Link>


                <div className="bg-violet-200 rounded-sm w-60 h-14 mb-4 flex flex-row pl-3 py-1.5">
                    <img className="scale-80" src={IdeasIcon}/>
                    <div className="ml-1">
                        <p>Ideas</p>
                        <p className="text-xs">Note down your ideas</p>
                    </div>
                </div>

                <div className="bg-violet-200 rounded-sm w-60 h-14 mb-4 flex flex-row pl-3 py-1.5">
                    <img className="scale-80" src={AIicon}/>
                    <div className="ml-1">
                        <p>AI Companion</p>
                        <p className="text-xs">Summarize your notes</p>
                    </div>
                </div>

                <div className="bg-violet-200 rounded-sm w-60 h-14 flex flex-row pl-3 py-1.5">
                    <img className="scale-80" src={CollabIcon}/>
                    <Link to={"/home-page/Collab"}>
                        <div className="ml-1">
                            <p>Collab Zone</p>
                            <p className="text-xs">Collab with many people</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}