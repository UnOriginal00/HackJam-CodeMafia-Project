import SettingsIcon from "../Icons/SettingsIcon.svg"
import UploadIcon from "../Icons/UploadResourcesIcon.svg"
import NotesIcon from "../Icons/NotesIcon.svg"
import { Lightbulb } from 'lucide-react'
import SharedHeader from './SharedHeader'
import CollabIcon from "../Icons/Home-Page-Icons/image 5.svg"
import MyDeskIcon from "../Icons/Home-Page-Icons/image 6.svg"
import ClockIcon from "../Icons/Home-Page-Icons/Clock Icon.svg"
import { useNavigate } from "react-router-dom"
import TredingTopics from "./TredingTopics"

export default function HomePage() {
  const route = useNavigate();
  const switchPage = () => route("/home-page/MyDeskPage");
  const homepage = () => route("/home-page/Collab");

  let w = window.innerWidth;
  let isLargeScreen = w >= 1024;

  return (
    <div className="bg-gradient-to-br from-violet-400 via-violet-400 to-orange-400 flex justify-center items-center w-screen h-screen">
      {/* Main container */}
  <div className="bg-white w-full h-full flex flex-col items-center font-[Krub] overflow-y-auto p-8">

        {/* Shared header */}
        <SharedHeader />

        {/* Subtitle */}
        <p className="self-start mt-4 text-sm bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-violet-400">
          Code Mafia Presents
        </p>

        {/* Section Cards */}
        <div className="flex flex-col items-center w-full mt-8 space-y-10 max-w-[1200px]">

          {/* Collaboration Card */}
          <div className="w-full">
            <div className="bg-gradient-to-r from-orange-400 to-violet-400 rounded-2xl p-[3px]">
              <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <img className="w-10 h-10" src={CollabIcon} />
                <h1 className="text-xl font-semibold text-center">Join Our Collaboration Community Now.</h1>
              </div>
              <p className="text-sm text-center">
                This is where you can experience a group community with like-minded ideas.
              </p>
              <button
                className="bg-black text-white text-base rounded-md w-52 h-10 lg:w-80 lg:h-12 cursor-pointer"
                onClick={homepage}
              >
                Come Collab Now
              </button>
              </div>
            </div>
          </div>

          {/* My Desk Card */}
          <div className="w-full">
            <div className="bg-gradient-to-r from-orange-400 to-violet-400 rounded-2xl p-[3px]">
              <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <img className="w-10 h-10" src={MyDeskIcon} />
                <h1 className="text-xl font-semibold text-center">Check Out My Desk Feature.</h1>
              </div>
              <p className="text-sm text-center">
                Where general chat ideas meet and are helped with our AI summarization tool.
              </p>
              <button
                className="bg-black text-white text-base rounded-md w-52 h-10 lg:w-80 lg:h-12 cursor-pointer"
                onClick={switchPage}
              >
                Look At My Desk
              </button>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="w-full">
            <div className="bg-gradient-to-r from-orange-400 to-violet-400 rounded-2xl p-[3px]">
              <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <img className="w-10 h-10" src={ClockIcon} />
                <h1 className="text-xl font-semibold">Trending Topics</h1>
              </div>
              <div className="overflow-auto h-44 flex justify-center space-x-6">
                <TredingTopics />
                <TredingTopics />
              </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Icons (for mobile) */}
        {!isLargeScreen && (
          <div className="flex justify-center space-x-6 mt-10 mb-6">
            <img className="w-6 h-6" src={SettingsIcon} />
            <img className="w-6 h-6" src={UploadIcon} />
            <img className="w-6 h-6" src={NotesIcon} />
          </div>
        )}
      </div>
    </div>
  );
}
