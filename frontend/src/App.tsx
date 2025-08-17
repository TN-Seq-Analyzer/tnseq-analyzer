import { Toaster } from "sonner";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import RouterLayout from "./routes/routes";

function App() {
  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <Header />
        <div className="flex h-[calc(100vh-48px)] w-full flex-1">
          <Sidebar />

          <RouterLayout />
          <Toaster duration={3000} richColors className="select-none" />
        </div>
      </div>
    </>
  );
}

export default App;
