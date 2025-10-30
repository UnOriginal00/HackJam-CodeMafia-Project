import NotesIcon from "../Icons/MyDeskIcons/Notes icon.svg"
import IdeasIcon from "../Icons/MyDeskIcons/Ideas icon.svg"
import PaperClip from "../Icons/MyDeskIcons/PaperClip.svg"
import AIicon from "../Icons/MyDeskIcons/AI Icon.svg"
import { useNavigate } from "react-router-dom"


export default function MyDeskSBDesktop(){

    return(
        <div className="lg:bg-gradient-to-br lg:from-violet-300 lg:via-violet-300 lg:to-orange-300 lg:rounded-sm lg:px-2 lg:h-110">
            <p className="text-center">Features</p>
            <hr/>
            <div className="flex flex-col">
                <div className="bg-violet-200 rounded-sm w-60 h-12 my-2 flex flex-row px-1.5">
                    <img className="scale-90" src={NotesIcon}/>
                    <div className="ml-1">
                        <p>Resources</p>
                        <p className="text-xs">Check out the resources</p>
                    </div>
                </div>

                <div className="bg-violet-200 rounded-sm w-60 mb-2 flex flex-row px-1.5">
                    <img className="scale-90" src={IdeasIcon}/>
                    <div className="ml-1">
                        <p>Ideas</p>
                        <p className="text-xs">Note down your ideas</p>
                    </div>

                </div>

                <div className="bg-violet-200 rounded-sm w-60 mb-2 flex flex-row">
                    <img className="scale-90" src={AIicon}/>
                    <div className="ml-1">
                        <p>AI Companion</p>
                        <p className="text-xs">Summarize your notes</p>
                    </div>
                </div>

                <div className="bg-violet-200 rounded-sm w-60 flex flex-row">
                    <img className="scale-90" src={PaperClip}/>
                    <div className="ml-1">
                        <p>Notes</p>
                        <p className="text-xs">Check your recent notes</p>
                    </div>
                </div>
            </div>
        </div>
    )
}