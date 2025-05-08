import { createContext, useContext } from "react";
import useLocalStorageState from "../hooks/useLocalStorageState";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [products, setProducts] = useLocalStorageState("products", []);
  const [categories, setCategories] = useLocalStorageState("categories", []);

  const addCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const addProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  // New deleteProduct function
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        categories,
        setCategories,
        setProducts,
        addCategory,
        addProduct,
        updateProduct,
        deleteProduct, // Add deleteProduct here
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context)
    throw new Error("useInventory must be used within InventoryProvider");
  return context;
}
