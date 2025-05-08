import { Outlet } from "react-router-dom";
import Header from "./Header";

function InventoryLayout() {
  return (
    <div className="bg-secondary-0">
      <div className="flex flex-col min-h-screen 2xl:container  ">
        <Header />
        <main className="flex flex-1 px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default InventoryLayout;
