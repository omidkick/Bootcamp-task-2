// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import useLocalStorageState from "../hooks/useLocalStorageState";
// import toast from "react-hot-toast";
// import TextField from "../ui/TextField";

// function AddCategory() {
//   const [showForm, setShowForm] = useState(false);
//   const [categories, setCategories] = useLocalStorageState("categories", []);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     const newTitle = data.title.trim().toLowerCase();

//     const titleExists = categories.some(
//       (cat) => cat.title.trim().toLowerCase() === newTitle
//     );

//     if (titleExists) {
//       toast.error("This category already exists!", {
//         position: "top-center",
//       });
//       return;
//     }

//     const newCategory = {
//       id: Date.now(),
//       title: data.title.trim(),
//       description: data.description?.trim() || "",
//     };

//     setCategories((prev) => [...prev, newCategory]);
//     reset();
//     setShowForm(false);

//     toast.success("New category added!", {
//       position: "top-center",
//     });
//   };

//   const handleCancel = () => {
//     reset();
//     setShowForm(false);
//   };

//   return (
//     <section className="mb-6">
//       {!showForm && (
//         <button
//           onClick={() => setShowForm(true)}
//           className="text-secondary-400 font-bold text-xl hover:underline"
//         >
//           Add a new category?
//         </button>
//       )}

//       {showForm && (
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="mt-4 space-y-4 bg-secondary-100 p-4 rounded-xl"
//         >
//           <h2
//             onClick={() => setShowForm(false)}
//             className="text-xl font-bold text-secondary-900 cursor-pointer"
//           >
//             Add Category
//           </h2>

//           <TextField
//             label="Title"
//             name="title"
//             register={register}
//             required
//             validationSchema={{ required: "Title is required" }}
//             errors={errors}
//           />

//           <TextField
//             label="Description"
//             name="description"
//             register={register}
//             validationSchema={{}}
//             errors={errors}
//           />

//           <div className="flex flex-col md:flex-row-reverse gap-4">
//             <button type="submit" className="btn btn--primary flex-1">
//               Add Category
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="btn btn--danger flex-1"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}
//     </section>
//   );
// }

// export default AddCategory;

// src/components/AddCategory.js
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useInventory } from "../context/InventoryContext";
import toast from "react-hot-toast";
import TextField from "../ui/TextField";
import { HiPlusCircle } from "react-icons/hi2";

function AddCategory() {
  const [showForm, setShowForm] = useState(false);
  const { categories, addCategory } = useInventory(); // Use context for categories & addCategory

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const newTitle = data.title.trim().toLowerCase();

    const titleExists = categories.some(
      (cat) => cat.title.trim().toLowerCase() === newTitle
    );

    if (titleExists) {
      toast.error("This category already exists!", {
        position: "top-center",
      });
      return;
    }

    const newCategory = {
      id: Date.now(),
      title: data.title.trim(),
      description: data.description?.trim() || "",
    };

    addCategory(newCategory);

    reset();
    setShowForm(false);
    toast.success("New category added!", {
      position: "top-center",
    });
  };

  const handleCancel = () => {
    reset();
    setShowForm(false);
  };

  return (
    <section className="mb-6">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="text-secondary-400 font-bold text-xl hover:underline flex items-center justify-center gap-x-2"
        >
          <HiPlusCircle className="w-8 h-8 text-secondary-400" />
          Add a new category?
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-4 bg-secondary-100 p-4 rounded-xl"
        >
          <h2
            onClick={() => setShowForm(false)}
            className="text-xl font-bold text-secondary-900 cursor-pointer"
          >
            Add Category
          </h2>

          <TextField
            label="Title"
            name="title"
            register={register}
            required
            validationSchema={{ required: "Title is required" }}
            errors={errors}
          />

          <TextField
            label="Description"
            name="description"
            register={register}
            validationSchema={{}}
            errors={errors}
          />

          <div className="flex flex-col md:flex-row-reverse gap-4">
            <button type="submit" className="btn btn--primary flex-1">
              Add Category
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn--danger flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default AddCategory;
