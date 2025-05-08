import { Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./context/DarkModeContext";
import InventoryLayout from "./ui/InventoryLayout";
import ProductDashboard from "./pages/ProductDashboard";
import ProductDetails from "./pages/ProductDetails";
import { Toaster } from "react-hot-toast";
import { InventoryProvider } from "./context/InventoryContext";

function App() {
  return (
    <DarkModeProvider>
      <InventoryProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<InventoryLayout />}>
            <Route index element={<ProductDashboard />} />
            <Route path="product/:productId" element={<ProductDetails />} />
          </Route>
        </Routes>
      </InventoryProvider>
    </DarkModeProvider>
  );
}

export default App;
