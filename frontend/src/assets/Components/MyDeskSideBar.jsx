import HomeIcon from "../Icons/MyDeskIcons/Home Icon.svg"
import NotesIcon from "../Icons/MyDeskIcons/Notes Icon.svg"
import IdeasIcon from "../Icons/MyDeskIcons/Ideas Icon.svg"
import SettingsIcon from "../Icons/SettingsIcon.svg"
import CloseIcon from "../Icons/MyDeskIcons/Close Icon.svg"

export default function MyDeskSideBar(){

    const image_scale = '50';

    return(
        <div className="bg-gray-300 h-103 w-33 flex flex-col rounded-xs px-1">

            <div className="flex flex-row ml-0.5">
                <p className="pr-7">Features</p>
                <img className="scale-65" src={CloseIcon}/>
            </div>

            <hr/>

            <div className="h-10 bg-gray-400 my-2 rounded-sm border border-black flex flex-row">
                <img className={`scale-${image_scale}`} src={NotesIcon}/>
                <div className="flex flex-col mt-1">
                    <p className="text-[9px]">Notes</p>
                    <p className="text-[8px]">Check your notes</p>
                </div>
            </div>

            <div className="bg-gray-400 h-10 my-2 rounded-sm border border-black flex flex-row">
                <img className={`scale-${image_scale}`} src={IdeasIcon}/>
                <div className="flex flex-col mt-1">
                    <p className="text-[9px]">Ideas</p>
                    <p className="text-[8px]">Note down new ideas</p>
                </div>
            </div>

            <div className="bg-gray-400 h-10 my-2 rounded-sm border border-black flex flex-row">
                <img className={`scale-${image_scale}`} src={HomeIcon}/>
                <div className="flex flex-col mt-1">
                    <p className="text-[9px]">Upload</p>
                    <p className="text-[8px]">Upload your resources</p>
                </div>
            </div>

            <div className="mt-45">
                <img className={`scale-${image_scale}`} src={SettingsIcon}/>
            </div>

        </div>
    )
}