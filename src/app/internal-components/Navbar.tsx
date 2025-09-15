import Dropdown from "@/components/Dropdown";

export default function Navbar(){
    return(
        <div className="fixed top-0 left-0 right-0 z-40">
            <div className="flex justify-between items-center w-full h-18 p-5 bg-gradient-to-b from-black/80 to-transparent">
                <h1 className="text-white text-xl font-semibold">Career Finder</h1>
                <div className="h-full flex gap-3 justify-center items-center">
                    <Dropdown/>
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                        <span className="text-sm font-medium">Me</span>
                    </div>
                </div>
            </div>
        </div>
    )
}