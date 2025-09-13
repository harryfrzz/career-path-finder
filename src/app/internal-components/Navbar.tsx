import Dropdown from "@/components/Dropdown";

export default function Navbar(){
    return(
        <div className="flex justify-between items-center w-full h-18 p-5 bg-transparent">
            <h1 className="text-white text-xl">Career Finder</h1>
            <div className="flex flex-row gap-3">
                <Dropdown/>
                <div className="w-12 h-10 rounded-md bg-white"></div>
            </div>
        </div>
    )
}