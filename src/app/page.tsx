import AIInputBar from "./internal-components/AIInputBar";
import Navbar from "./internal-components/Navbar";

export default function Home() {
  return (
    <div className="relative bg-black w-screen min-h-screen">
      <Navbar />
      <AIInputBar />
    </div>
  );
}
