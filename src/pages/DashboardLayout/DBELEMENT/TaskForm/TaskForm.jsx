import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Yup validation schema
const taskSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(50, "Title must be 50 characters or less"),
  description: Yup.string().max(
    200,
    "Description must be 200 characters or less"
  ),
  category: Yup.string()
    .required("Category is required")
    .oneOf(["To-Do", "In Progress", "Done"], "Invalid category"),
  timestamp: Yup.date().required("Date is required").nullable(),
});

const TaskForm = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Initial values for the form
  const initialValues = {
    title: "",
    description: "",
    category: "",
    timestamp: new Date(),
  };

  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    console.log("Task Submitted:", values);
    console.log("Task Submitted user:", user);
    if (user) {
      try {
      } catch (error) {}
    }
    setTimeout(() => {
      resetForm();
      setSubmitting(false);
    }, 500); // Simulate async submission
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={taskSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, isSubmitting }) => (
        <Form className="max-w-4xl max-h-[480px] overflow-auto mx-auto p-4 bg-base-100 rounded-xl shadow-lg space-y-2">
          <h2 className="text-3xl font-bold text-center text-base-content">
            Add New Task
          </h2>

          {/* Title Field */}
          <div className="form-control">
            <label htmlFor="title" className="label text-sm font-medium">
              <span className="label-text">Title</span>
            </label>
            <Field
              type="text"
              id="title"
              name="title"
              className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-primary transition duration-200"
              placeholder="Enter task title"
              aria-label="Title"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-error text-sm mt-1 bg-error bg-opacity-10 p-1 rounded"
            />
          </div>

          {/* Description Field */}
          <div className="form-control">
            <label htmlFor="description" className="label text-sm font-medium">
              <span className="label-text">Description</span>
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              className="textarea textarea-bordered w-full h-10 rounded-lg focus:ring-2 focus:ring-primary transition duration-200"
              placeholder="Enter task description"
              aria-label="Description"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-error text-sm mt-1 bg-error bg-opacity-10 p-1 rounded"
            />
          </div>

          {/* Category Field */}
          <div className="form-control">
            <label htmlFor="category" className="label text-sm font-medium">
              <span className="label-text">Category</span>
            </label>
            <Field
              as="select"
              id="category"
              name="category"
              className="select select-bordered w-full rounded-lg focus:ring-2 focus:ring-primary transition duration-200"
              aria-label="Category"
            >
              <option value="">Select a category</option>
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </Field>
            <ErrorMessage
              name="category"
              component="div"
              className="text-error text-sm mt-1 bg-error bg-opacity-10 p-1 rounded"
            />
          </div>

          {/* Timestamp Field */}
          <div className="form-control">
            <label htmlFor="timestamp" className="label text-sm font-medium">
              <span className="label-text">Timestamp</span>
            </label>
            <ReactDatePicker
              id="timestamp"
              selected={values.timestamp}
              onChange={(date) => setFieldValue("timestamp", date)}
              className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-primary transition duration-200"
              placeholderText="Select a date"
              dateFormat="MMMM d, yyyy"
              aria-label="Timestamp"
            />
            <ErrorMessage
              name="timestamp"
              component="div"
              className="text-error text-sm mt-1 bg-error bg-opacity-10 p-1 rounded"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full rounded-lg hover:bg-primary-focus transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Add Task"
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default TaskForm;
