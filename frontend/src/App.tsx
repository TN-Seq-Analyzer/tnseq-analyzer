import { Toaster } from "sonner";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import RouterLayout from "./routes/routes";

function App() {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex min-h-[calc(100vh-48px)] w-full flex-1">
          <Sidebar />
          <RouterLayout />
          <Toaster duration={3000} richColors />
        </div>
      </div>
    </>
  );
}

export default App;
