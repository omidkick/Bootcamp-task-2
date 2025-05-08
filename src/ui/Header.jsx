import { useInventory } from "../context/InventoryContext";
import DarkModeToggle from "./DarkModeToggle";

function Header() {
  const { products } = useInventory();
  const productCount = products.length;

  return (
    <header className="sticky top-0 z-40 bg-secondary-200 bg-opacity-50 backdrop-blur-md shadow-sm mb-10 rounded-lg">
      <div className=" mx-auto flex items-center justify-between px-10 py-3">
        {/* Left: Dark Mode Toggle */}
        <DarkModeToggle />

        {/* Center: Title + Count */}
        <div className="flex items-center gap-x-2">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-secondary-600 ">
            Inventory App
          </h1>
          <span className="w-8 h-8 flex items-center justify-center font-bold text-white bg-primary-800 rounded-full">
            {productCount}
          </span>
        </div>

        <div />
      </div>
    </header>
  );
}

export default Header;
