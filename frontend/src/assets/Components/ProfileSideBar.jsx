import UserIcon from "../Icons/User-Icons/UserIcon.svg"
import Dashboard from "../Icons/Profile-Side-Icon/Dashboard.svg"
import Trophy from "../Icons/Profile-Side-Icon/Trophy.svg"
import Shield from "../Icons/Profile-Side-Icon/Shield.svg"
import LogOut from "../Icons/Profile-Side-Icon/LogOut.svg"

export default function ProfileSideBar(){
    return(
    <div className="flex justify-end">
        <div className="bg-gray-300 w-60 h-110 rounded-l-md flex flex-col pl-2.5">
            <div className="flex flex-row pl-2 pt-2 mb-2">
                <img className="scale-78" src={UserIcon}/>
                <div className="flex flex-col pt-1.5">
                    <p>User Profile</p>
                    <p className="text-xs">View your profile</p>
                </div>
            </div>

            <div className="flex flex-row mb-2">
                <img  className="scale-75" src={Dashboard}/>
                <p className="pt-1.5 pl-1">User Dashboard</p>
            </div>

            <div className="flex flex-row mb-2">
                <img  className="scale-75" src={Trophy}/>
                <p className="pt-1.5 pl-1">Achievment</p>
            </div>

            <div className="flex flex-row mb-2">
                <img  className="scale-75" src={Shield}/>
                <p className="pt-1.5 pl-1">Premium</p>
            </div>

            <div className="flex flex-row">
                <img  className="scale-75" src={LogOut}/>
                <p className="pt-1.5 pl-1">Log Out</p>
            </div>

        </div>
    </div>

    )
}