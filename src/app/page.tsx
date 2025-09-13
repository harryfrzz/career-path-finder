import AIInputBar from "./internal-components/AIInputBar";
import Navbar from "./internal-components/Navbar";

export default function Home() {
  return (
    <div className="bg-black w-screen h-screen">
      <Navbar/>
      <div className="flex w-full absolute bottom-0 justify-center items-center py-8">
        <AIInputBar/>
      </div>
    </div>
  );
}
