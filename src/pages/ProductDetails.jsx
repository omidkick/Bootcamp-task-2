import { useParams } from "react-router-dom";
import { useInventory } from "../context/InventoryContext";
import useMoveBack from "../hooks/useMoveBack";
import { formatDate } from "../utils/formatDate";
import {
  HiOutlineArrowLeft,
  HiOutlineCube,
  HiOutlineCalendar,
  HiOutlinePencilSquare,
  HiOutlineTag,
} from "react-icons/hi2";
import truncateToDigits from "../utils/truncateToDigits";

export default function ProductDetails() {
  const { productId } = useParams();
  const { products } = useInventory();
  const moveBack = useMoveBack();

  const product = products.find((p) => String(p.id) === String(productId));

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Product not found
        </h2>
        <button
          onClick={moveBack}
          className="btn btn--primary flex items-center gap-2"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-10 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center gap-x-4 mb-8 flex-wrap">
        <button onClick={moveBack}>
          <HiOutlineArrowLeft className="w-9 h-9 p-2 rounded-full bg-primary-900 text-white hover:bg-primary-700 transition-all duration-300" />
        </button>
        <h1 className="text-secondary-900 text-2xl md:text-3xl lg:text-4xl font-extrabold">
          Product Details
        </h1>
      </div>

      {/* Details Card */}
      <div className="max-w-3xl mx-auto bg-secondary-50 border border-secondary-200 shadow-lg rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Title + Category */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 break-words">
            {product.title}
          </h2>
          <span className="badge badge--primary text-sm">{product.category}</span>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <DetailItem
            icon={<HiOutlineCube className="w-6 h-6 text-primary-700" />}
            label="Quantity"
            value={product.quantity}
          />
          <DetailItem
            icon={<HiOutlineCalendar className="w-6 h-6 text-primary-700" />}
            label="Created At"
            value={formatDate(product.createdAt)}
          />
          <DetailItem
            icon={<HiOutlinePencilSquare className="w-6 h-6 text-primary-700" />}
            label="Last Updated"
            value={formatDate(product.updatedAt)}
          />
          <DetailItem
            icon={<HiOutlineTag className="w-6 h-6 text-primary-700" />}
            label="Product ID"
            value={truncateToDigits(product.id, 2)}
          />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-2 py-3 rounded-md">
      <div className="flex items-center gap-3 text-secondary-700 font-medium">
        {icon}
        <span className="text-base">{label}</span>
      </div>
      <span className="text-primary-900 font-semibold text-base break-words text-right sm:text-left">
        {value}
      </span>
    </div>
  );
}
