import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addExpense,
  updateExpense,
  deleteExpense,
  setOffline,
  setExpenses as setExpensesRedux,
} from "../redux/expensesSlice";
import {
  fetchExpenses,
  addExpenseAPI,
  updateExpenseAPI,
  deleteExpenseAPI,
} from "../api/expensesApi";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useMutation,
} from "react-query";
import { ExpenseForm } from "../Components/ExpenseForm";
import { FilterSortControls } from "../Components/FilterSortControls";
import { ExpenseList } from "../Components/ExpenseList";
import { Expense } from "../types/expense";
import { OfflineIndicator } from "../Components/OfflineIndicator";
import { Button } from "../Components/ui/Button";

const queryClient = new QueryClient();

const PAGE_LIMIT = 10;

const ExpenseTrackerInner: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOffline = useAppSelector((state) => state.expenses.offline);
  const isSyncing = useAppSelector((state) => state.expenses.syncing);
  
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const { fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery(
      ["expenses", categoryFilter, sortBy, order],
      ({ pageParam = 1 }) =>
        fetchExpenses({
          page: pageParam,
          limit: PAGE_LIMIT,
          category: categoryFilter || undefined,
          sortBy,
          order,
        }),
      {
        getNextPageParam: (lastPage, pages) => {
          const loaded = pages.reduce((acc, page) => acc + page.data.length, 0);
          if (loaded < lastPage.total) return pages.length + 1;
          return undefined;
        },
        retry: 2,
        onSuccess: (data) => {
          const allExpenses = data.pages.flatMap((p) => p.data);
          dispatch(setExpensesRedux(allExpenses));
          localStorage.setItem("EXPENSES_LOCAL", JSON.stringify(allExpenses));
        },
      }
    );

  const addMutation = useMutation(addExpenseAPI, {
    onSuccess: () => {
      refetch();
    },
  });

  const updateMutation = useMutation(updateExpenseAPI, {
    onSuccess: () => {
      refetch();
    },
  });

  const deleteMutation = useMutation(deleteExpenseAPI, {
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const offline = !navigator.onLine;
      dispatch(setOffline(offline));
      if (!offline) {
        dispatch({ type: "expenses/syncPending" });
      }
    };
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    updateNetworkStatus();

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, [dispatch]);

  useEffect(() => {
    if (isOffline) {
      const localDataJson = localStorage.getItem("EXPENSES_LOCAL");
      if (localDataJson) {
        try {
          const localExpenses: Expense[] = JSON.parse(localDataJson);
          dispatch(setExpensesRedux(localExpenses));
        } catch {}
      }
    }
  }, [isOffline, dispatch]);

  const allExpenses = useAppSelector((state) => state.expenses.expenses);

  const handleAdd = (expense: Omit<Expense, "id">) => {
    if (isOffline) {
      const id = `offline-${Date.now()}`;
      const newExp: Expense = { ...expense, id };
      dispatch(addExpense(newExp));
    } else {
      addMutation.mutate(expense);
    }
    setShowForm(false);
  };

  const handleEdit = (expense: Expense) => {
    if (isOffline) {
      dispatch(updateExpense(expense));
    } else {
      updateMutation.mutate(expense);
    }
    setEditingExpense(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (isOffline) {
      dispatch(deleteExpense(id));
    } else {
      deleteMutation.mutate(id);
    }
  };

  const expensesToShow = allExpenses;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between mb-3">
        <div>
          <h1 className="text-3xl font-bold">Expense Tracker</h1>
          <OfflineIndicator offline={isOffline} syncing={isSyncing} />
        </div>
        <div>
          <Button
            onClick={() => {
              setEditingExpense(null);
              setShowForm(true);
            }}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-[95%] max-w-[500px] mx-auto relative">
            <div className="flex justify-between">
              <h2 className="text-lg font-medium">Expense Form</h2>
              <button
                className="text-gray-500"
                onClick={() => setShowForm(false)}
              >
                &times;
              </button>
            </div>

            <ExpenseForm
              initialData={editingExpense || undefined}
              onSubmit={
                editingExpense
                  ? (expense) =>
                      handleEdit({ ...expense, id: editingExpense.id })
                  : handleAdd
              }
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <div className="mb-4">
        <FilterSortControls
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortBy={sortBy}
          order={order}
          onSortByChange={setSortBy}
          onOrderChange={setOrder}
        />
      </div>

      <ExpenseList
        expenses={expensesToShow}
        onEdit={(expense) => {
          setEditingExpense(expense);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onLoadMore={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        hasMore={!!hasNextPage}
        loading={isFetchingNextPage}
      />
    </div>
  );
};

export const ExpenseTracker: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ExpenseTrackerInner />
  </QueryClientProvider>
);
