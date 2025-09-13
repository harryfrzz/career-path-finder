import AIInputBar from "./internal-components/AIInputBar";
import Navbar from "./internal-components/Navbar";

export default function Home() {
  return (
    <div className="relative bg-black w-screen min-h-screen">
      <Navbar />
      <div className="pt-20"> {/* Add padding-top to account for fixed navbar */}
        {/* Main content will go here */}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 pb-8 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <AIInputBar />
        </div>
      </div>
    </div>
  );
}
