import AIInputBar from "./internal-components/AIInputBar";
import Navbar from "./internal-components/Navbar";

export default function Home() {
  return (
    <div className="relative bg-black w-screen min-h-screen">
      <Navbar />
      <div className="pt-20"> {/* Add padding-top to account for fixed navbar */}
        {/* Main content will go here */}
      </div>
      <AIInputBar />
    </div>
  );
}
