import SendReqBtn from "./SendReqBtn";

export default function AIInputBar(){
    return(
        <div className="flex justify-center gap-2 h-[50px]">
            <div className="w-[650px] h-full bg-white rounded-3xl">
                <input type="text" placeholder="Design a career path" className="w-full h-full px-5 outline-0"/>
            </div>
            <SendReqBtn/>
        </div>
        
    )
}