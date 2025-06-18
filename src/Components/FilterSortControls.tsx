import React from "react";

interface FilterSortProps {
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  sortBy: "date" | "amount";
  order: "asc" | "desc";
  onSortByChange: (val: "date" | "amount") => void;
  onOrderChange: (val: "asc" | "desc") => void;
}

const categories = ["", "Food", "Travel", "Shopping", "Utilities", "Others"];

export const FilterSortControls: React.FC<FilterSortProps> = ({
  categoryFilter,
  onCategoryChange,
  sortBy,
  order,
  onSortByChange,
  onOrderChange,
}) => {
  return (
    <div
      aria-label="Filter and sort controls"
      className="flex flex-wrap gap-6 items-end bg-white p-3 rounded-md shadow-sm border border-gray-300 bg-gray-100"
    >
      <label className="flex flex-col space-y-2">
        <span className="text-sm font-semibold text-gray-700">
          Filter by Category
        </span>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter expenses by category"
          className="min-w-[160px] px-1 py-2 bg-white border border-gray-300 rounded text-gray-600"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat || "All"}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col space-y-2">
        <span className="text-sm font-semibold text-gray-700">Sort by</span>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as "date" | "amount")}
          aria-label="Sort expenses by field"
          className="min-w-[140px] px-1 py-2 bg-white border border-gray-300 rounded text-gray-600"
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
      </label>

      <label className="flex flex-col space-y-2">
        <span className="text-sm font-semibold text-gray-700">Order</span>
        <select
          value={order}
          onChange={(e) => onOrderChange(e.target.value as "asc" | "desc")}
          aria-label="Sort order"
          className="min-w-[140px] px-1 py-2 bg-white border border-gray-300 rounded text-gray-600"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </label>
    </div>
  );
};
