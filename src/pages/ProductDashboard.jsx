import AddCategory from "../components/AddCategory";
import AddProduct from "../components/AddProduct";
import ProductList from "../components/ProductList";

function ProductDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 gap-x-14 w-full p-4">
      {/*  AddCategory & AddProduct  */}
      <div className="space-y-16 lg:col-span-2">
        <AddCategory />
        <AddProduct />
      </div>

      {/*  Product List  */}
      <div className=" rounded-md lg:col-span-2">
        <ProductList />
      </div>
    </div>
  );
}

export default ProductDashboard;
