import React, { useEffect, useRef } from "react";
import { Expense } from "../types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete,
  onLoadMore,
  hasMore,
  loading,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={listRef}
      className="h-96 overflow-y-auto border border-gray-300 p-2 rounded-md"
      aria-label="Expense list"
    >
      {expenses.length === 0 && (
        <p className="text-center text-gray-500">No expenses found.</p>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Description</th>
            <th className="text-left p-2">Category</th>
            <th className="text-right p-2">Amount</th>
            <th className="text-right p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="border-b border-gray-200">
              <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
              <td className="p-2">
                {e.title}
                {e.notes && (
                  <div className="italic text-sm text-gray-500">
                    {e.notes}
                  </div>
                )}
              </td>
              <td className="p-2 text-gray-600">{e.category}</td>
              <td className="text-right p-2">
                ${e.amount.toFixed(2)}
              </td>
              <td className="text-right p-2">
                <button
                  className="text-blue-600 hover:underline text-sm mr-2"
                  aria-label={`Edit expense ${e.title}`}
                  onClick={() => onEdit(e)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline text-sm"
                  aria-label={`Delete expense ${e.title}`}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this expense?"
                      )
                    ) {
                      onDelete(e.id);
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => onLoadMore()}
            disabled={loading}
            className={`px-4 py-2 rounded font-semibold shadow ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
      {loading && (
        <div className="text-center text-sm text-gray-400 mt-4">Loading...</div>
      )}
      {!hasMore && expenses.length > 0 && (
        <div className="text-center text-sm text-gray-400 mt-4">
          End of list
        </div>
      )}
    </div>
  );
};
