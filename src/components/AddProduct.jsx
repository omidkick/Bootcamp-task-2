// import { useForm } from "react-hook-form";
// import useLocalStorageState from "../hooks/useLocalStorageState";
// import toast from "react-hot-toast";
// import RHFSelect from "../ui/RHFSelect";
// import TextField from "../ui/TextField";

// function AddProduct() {
//   const [categories, setCategories] = useLocalStorageState("categories", []);
//   const [products, setProducts] = useLocalStorageState("products", []);
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     const timestamp = new Date().toISOString();

//     const newProduct = {
//       id: Date.now(),
//       title: data.title.trim(),
//       quantity: data.quantity,
//       category: data.category,
//       createdAt: timestamp,
//       updatedAt: timestamp, // For future use when product is updated
//     };

//     const updatedProducts = [...products, newProduct];
//     setProducts(updatedProducts);

//     reset();
//     toast.success("Product added successfully!", { position: "top-center" });
//   };

//   return (
//     <section className="mb-6">
//       <h2 className="text-xl font-bold text-secondary-900">Add Product</h2>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="mt-4 space-y-4 bg-secondary-100 p-4 rounded-xl"
//       >
//         {/* Product Title */}
//         <TextField
//           label="Product Title"
//           name="title"
//           register={register}
//           required
//           validationSchema={{ required: "Product Title is required" }}
//           errors={errors}
//         />

//         {/* Product Quantity */}
//         <TextField
//           label="Quantity"
//           name="quantity"
//           type="number"
//           register={register}
//           required
//           validationSchema={{ required: "Quantity is required" }}
//           errors={errors}
//         />

//         {/* Category Select */}
//         <RHFSelect
//           label="Category"
//           name="category"
//           register={register}
//           options={categories.map((category) => ({
//             value: category.id,
//             label: category.title,
//           }))}
//           required
//         />

//         {/* Form Actions */}
//         <div className="flex flex-col md:flex-row-reverse gap-4 !mt-10">
//           <button type="submit" className="btn btn--primary flex-1">
//             Add Product
//           </button>
//         </div>
//       </form>
//     </section>
//   );
// }

// export default AddProduct;

import { useForm } from "react-hook-form";
import { useInventory } from "../context/InventoryContext";
import toast from "react-hot-toast";
import RHFSelect from "../ui/RHFSelect";
import TextField from "../ui/TextField";
import { HiPlusCircle } from "react-icons/hi2";

function AddProduct() {
  // Access categories and addProduct from context
  const { categories, addProduct } = useInventory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const timestamp = new Date().toISOString();

    const selectedCategory = categories.find(
      (category) => String(category.id) === String(data.category)
    );

    if (!selectedCategory) {
      toast.error("Selected category not found!", { position: "top-center" });
      return;
    }

    const newProduct = {
      id: Date.now(),
      title: data.title.trim(),
      quantity: Number(data.quantity),
      category: selectedCategory.title,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    addProduct(newProduct);
    reset();
    toast.success("Product added successfully!", { position: "top-center" });
  };

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-secondary-600 flex items-center gap-x-2">
        <HiPlusCircle className="w-8 h-8 text-secondary-600" />
        Add Product
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-4 bg-secondary-100 p-4 rounded-xl"
      >
        {/* Product Title */}
        <TextField
          label="Product Title"
          name="title"
          register={register}
          required
          validationSchema={{ required: "Product Title is required" }}
          errors={errors}
        />

        {/* Product Quantity */}
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          register={register}
          required
          validationSchema={{ required: "Quantity is required" }}
          errors={errors}
        />

        {/* Category Select */}
        <RHFSelect
          label="Category"
          name="category"
          register={register}
          options={[
            { value: "", label: "Select Category" },
            ...categories.map((category) => ({
              value: category.id.toString(),
              label: category.title,
            })),
          ]}
          required
        />

        {/* Form Actions */}
        <div className="flex flex-col md:flex-row-reverse gap-4 !mt-10">
          <button type="submit" className="btn btn--primary flex-1">
            Add Product
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddProduct;
