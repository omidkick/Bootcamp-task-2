// Select elements
const loadButton = document.querySelector("#loadBtn");
const tableContainer = document.querySelector("#transactionTable");
const tableBody = document.querySelector("#tableBody");
const header = document.querySelector(".header");
const searchInput = document.querySelector("#searchRefId");
const sortPriceIcon = document.querySelector("#sortPriceIcon");
const sortDateIcon = document.querySelector("#sortDateIcon");

// State variables
let sortPriceOrder = "asc";
let sortDateOrder = "asc";
let currentSearchTerm = "";

// Load button event listener
loadButton.addEventListener("click", () => {
  tableContainer.classList.remove("hidden");
  header.classList.add("hidden");
  fetchTransactionData();
});

// Search input event listener
searchInput.addEventListener("input", () => {
  currentSearchTerm = searchInput.value.trim();
  fetchTransactionData(currentSearchTerm, getSortType(), getSortOrder());
});

// Sorting event listeners
sortPriceIcon.addEventListener("click", () => handleSort("price"));
sortDateIcon.addEventListener("click", () => handleSort("date"));

// Handle sorting toggle and fetch data
function handleSort(type) {
  if (type === "price") {
    sortPriceOrder = toggleOrder(sortPriceOrder);
    updateIcon(sortPriceIcon, sortPriceOrder);
  } else if (type === "date") {
    sortDateOrder = toggleOrder(sortDateOrder);
    updateIcon(sortDateIcon, sortDateOrder);
  }
  fetchTransactionData(currentSearchTerm, type, getSortOrder(type));
}

// Toggle sorting order
function toggleOrder(order) {
  return order === "asc" ? "desc" : "asc";
}

// Update sort icon classes
function updateIcon(iconElement, order) {
  iconElement.classList.remove("rotate-asc", "rotate-desc");
  iconElement.classList.add(order === "asc" ? "rotate-asc" : "rotate-desc");
}

// Get the current sorting type and order
function getSortType() {
  return sortPriceOrder !== "asc" || sortPriceOrder !== "desc"
    ? "price"
    : "date";
}

function getSortOrder(type = "price") {
  return type === "price" ? sortPriceOrder : sortDateOrder;
}

// Fetch transaction data
function fetchTransactionData(refId = "", sortType = "", sortOrder = "") {
  let endpoint = "http://localhost:3000/transactions";
  const params = [];

  if (refId) params.push(`refId_like=${refId}`);
  if (sortType) params.push(`_sort=${sortType}&_order=${sortOrder}`);

  if (params.length) endpoint += `?${params.join("&")}`;

  axios
    .get(endpoint)
    .then((response) => {
      const data = response.data || [];
      data.length > 0 ? populateTable(data) : showNoResultsText();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-red-500">خطا در بارگیری اطلاعات</td>
        </tr>
      `;
    });
}

// Create the all rows of the table
function populateTable(transactions) {
  tableBody.innerHTML = transactions
    .map((transaction) => {
      const persianDate = new Date(transaction.date).toLocaleDateString(
        "fa-IR",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "long",
        }
      );

      // Specific color for the status of transaction
      const statusTransaction =
        transaction.type === "برداشت از حساب" ? "red" : "green";

      return `
        <tr>
          <td>${transaction.id || "نامشخص"}</td>
          <td class="${statusTransaction}">${transaction.type || "نامشخص"}</td>
          <td>${Number(transaction.price).toLocaleString()} تومان</td>
          <td>${transaction.refId || "نامشخص"}</td>
          <td>${persianDate || "نامشخص"}</td>
        </tr>
      `;
    })
    .join("");
}

// Display no results message
function showNoResultsText() {
  tableBody.innerHTML = `
    <tr>
      <td colspan="5" id="match-alert"> <span id="match-alert_icon"><i class="fa-solid fa-triangle-exclamation"></i></i></span>  تراکنش مورد نظر یافت نشد!</td>
    </tr>
  `;
}
