import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Expense } from "../types/expense";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";

const categories = ["Food", "Travel", "Shopping", "Other"] as const;
type Category = (typeof categories)[number];

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, "id">) => void;
  onCancel: () => void;
  initialData?: Expense;
}

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  date: Yup.string().required("Date is required"),
  category: Yup.mixed<Category>()
    .oneOf(categories)
    .required("Category is required"),
  notes: Yup.string().optional(),
});

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      title: initialData?.title || "",
      amount: initialData?.amount ?? "",
      date: initialData
        ? new Date(initialData.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      category: initialData?.category || categories[0],
      notes: initialData?.notes || "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        amount: Number(values.amount),
        date: new Date(values.date).toISOString(),
        notes: values.notes?.trim() || undefined,
      });
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 bg-white" aria-label="Expense Form">
      <Input
        id="title"
        name="title"
        label="Title"
        required
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.title ? errors.title : undefined}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            label="Amount"
            required
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.amount ? errors.amount : undefined}
          />
        </div>

        <div className="w-full md:w-1/3">
          <Input
            id="date"
            name="date"
            type="date"
            label="Date"
            required
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.date ? errors.date : undefined}
          />
        </div>

        <div className="w-full md:w-1/3">
          <label htmlFor="category" className="block text-gray-700 mb-1">
            Category<span className="text-red-500"> *</span>
          </label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border px-2 py-2 rounded focus:outline-none focus:ring-2 ${
              touched.category && errors.category
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {touched.category && errors.category && (
            <div className="text-red-500 text-sm mt-1">{errors.category}</div>
          )}
        </div>
      </div>

      <Textarea
        id="notes"
        name="notes"
        label="Notes"
        rows={2}
        value={values.notes}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.notes ? errors.notes : undefined}
      />

      <div className="flex flex-wrap items-center gap-2 pt-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Add"} Expense</Button>
      </div>
    </form>
  );
};
