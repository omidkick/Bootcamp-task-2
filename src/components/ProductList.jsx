import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import TextField from "../ui/TextField";
import RHFSelect from "../ui/RHFSelect";
import useLocalStorageState from "../hooks/useLocalStorageState";
import { useInventory } from "../context/InventoryContext";
import { AiOutlineCheck } from "react-icons/ai";
import Loader from "../ui/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HiEye, HiFilter } from "react-icons/hi";
import { MdInventory2 } from "react-icons/md";

function ProductList() {
  const { products, categories, updateProduct, deleteProduct } = useInventory();

  const navigate = useNavigate();

  // form for filters
  const {
    register: filterRegister,
    watch: watchFilter,
    formState: { errors: filterErrors },
  } = useForm();

  // form for editing
  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    formState: { errors: editErrors },
  } = useForm();

  // Filter state synced with localStorage
  const [filters, setFilters] = useLocalStorageState("filters", {
    search: "",
    sortOrder: "Latest",
    category: "",
  });

  // Modal and selection state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Loader States
  const [isFiltering, setIsFiltering] = useState(false);

  // Watch filter values and update persistent filter state
  const search = watchFilter("search");
  const sortOrder = watchFilter("sortOrder");
  const category = watchFilter("category");

  useEffect(() => {
    setIsFiltering(true);
    const timeout = setTimeout(() => {
      setFilters({ search, sortOrder, category });
      setIsFiltering(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, sortOrder, category, setFilters]);

  // Derived product list
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    result.sort((a, b) =>
      filters.sortOrder === "Latest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    return result;
  }, [products, filters]);

  // Handlers
  const handleEdit = (product) => {
    setSelectedProduct(product);
    resetEditForm({
      title: product.title,
      quantity: String(product.quantity),
      category: product.category,
    });
    setEditModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const onEditSubmit = (data) => {
    updateProduct({
      ...selectedProduct,
      title: data.title,
      quantity: parseInt(data.quantity, 10),
      category: data.category,
      editedAt: new Date().toISOString(),
    });
    setEditModalOpen(false);
    setSelectedProduct(null);
    toast.success(`✔️ "${data.title}" updated.`);
  };

  const confirmDelete = () => {
    deleteProduct(selectedProduct.id);
    setDeleteModalOpen(false);
    setSelectedProduct(null);
    toast.success(`"${selectedProduct.title}" was deleted.`);
  };

  return (
    <div className="px-1">
      {/* Filters */}
      <section className="mb-12">
        <h2 className="text-lg text-secondary-400 font-bold  border-b border-secondary-400 flex items-center gap-x-2 py-2  mb-4 md:mb-10">
          <HiFilter className="text-secondary-400 w-5 h-5" />
          Filters
        </h2>

        <form className="space-y-6 ">
          <RHFSelect
            label="Sort"
            name="sortOrder"
            register={filterRegister}
            options={[
              { value: "Latest", label: "Latest" },
              { value: "Earliest", label: "Earliest" },
            ]}
          />
          <RHFSelect
            label="Category"
            name="category"
            register={filterRegister}
            options={[
              { value: "", label: "All" },
              ...categories.map((cat) => ({
                value: cat.title,
                label: cat.title,
              })),
            ]}
          />

          <TextField
            className="md:w-1/2"
            label="Search"
            name="search"
            register={filterRegister}
            errors={filterErrors}
          />
        </form>
      </section>

      {/* Product List */}
      <section>
        <h2 className="text-xl text-secondary-400 font-extrabold mb-4 md:mb-10 border-b border-secondary-400 flex items-center gap-x-2 py-2 ">
          <MdInventory2 className="w-6 h-6 text-secondary-400" />
          Products List
        </h2>

        <div className="scrollable-list md:max-h-[400px] overflow-y-auto p-2">
          {isFiltering ? (
            <div className="flex justify-center items-center py-10">
              <Loader height="30" width="80" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-secondary-500">No products found.</p>
          ) : (
            <ul className="space-y-4">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-secondary-300 px-4 py-3 rounded-xl text-secondary-600 bg-secondary-0 shadow-sm"
                >
                  {/* Left Section */}
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4 gap-y-2">
                    <div className="flex flex-col gap-y-1">
                      {/* title */}
                      <span className="text-base md:text-lg font-bold">
                        {product.title}
                      </span>
                      {/* CreateAt date && Edit time */}
                      <div className="text-xs text-secondary-400">
                        {!product.editedAt ? (
                          <span>
                            {new Date(product.createdAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-success italic font-semibold flex items-center gap-x-1">
                            <AiOutlineCheck
                              className="text-success inline"
                              size={12}
                            />
                            <span>Edited</span>
                            {new Date(product.editedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-wrap md:flex-nowrap md:items-center gap-2 md:space-x-4">
                    <span className="badge badge--primary text-xs">
                      {product.category}
                    </span>
                    <span className="w-6 h-6 flex items-center justify-center text-xs font-bold text-secondary-900 bg-secondary-300 rounded-full">
                      {product.quantity}
                    </span>

                    <div className="flex flex-wrap gap-2">
                      <button
                        className="btn btn--success text-xs py-1 px-3"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn--danger-outline text-xs py-1 px-3"
                        onClick={() => handleDelete(product)}
                      >
                        Delete
                      </button>
                      <button
                        className="text-secondary-300 hover:text-primary-900 transition-all duration-500 ease-in-out text-xs py-1 px-2"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <HiEye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Product - ${selectedProduct?.title || "Loading..."}`}
      >
        <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4">
          <TextField
            label="Title"
            name="title"
            register={editRegister}
            errors={editErrors}
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            register={editRegister}
            errors={editErrors}
          />
          <RHFSelect
            label="Category"
            name="category"
            register={editRegister}
            options={categories.map((cat) => ({
              value: cat.title,
              label: cat.title,
            }))}
          />
          <div className="flex items-center w-full gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="btn btn--outline flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary flex-1">
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-bold py-4 text-secondary-600">
            Are you sure you want to delete{" "}
            <span className="font-bold text-error">
              {selectedProduct?.title}
            </span>
            ?
          </h2>
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="btn btn--secondary flex-1"
            >
              Cancel
            </button>
            <button onClick={confirmDelete} className="btn btn--danger flex-1">
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductList;
