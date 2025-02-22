import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()

  // Initial values for the form
  const initialValues = {
    title: "",
    description: "",
    category: "To-Do",
    timestamp: new Date(),
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    console.log("Task Submitted:", values);
    console.log("Task Submitted user:", user);
    if (!user || !user?.token) {
      console.error("User isn't Authenticated")
      setSubmitting(false)
      return
    }
    try {
        // const token = localStorage.getItem(user.token)
        // console.log("From local storage", token)
        const taskData = {...values, userId: user?.uid}
        const {data} = await axiosPublic.post('/tasks', taskData, {
            headers: {Authorization:`Bearer ${user?.token || user?.accessToken}`}
        })
        console.log("data post", data)
        navigate('/dashboard/tasklist')
        resetForm()
    } catch (error) {
        console.error("Error submitting task:", error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={taskSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, isSubmitting }) => (
        <Form className="max-w-4xl max-h-[480px] overflow-auto mx-auto p-4 dark:bg-gray-800 dark:text-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold dark:text-white text-center text-base-content">
            Add New Task
          </h2>

          {/* Title Field */}
          <div className="form-control">
            <label htmlFor="title" className="label text-sm font-medium">
              <span className="label-text dark:text-white">Title</span>
            </label>
            <Field
              type="text"
              id="title"
              name="title"
              className="input input-bordered w-full rounded-lg dark:border-dark-border dark:bg-dark-background dark:text-gray-100 focus:ring-2 focus:ring-primary transition duration-200"
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
              <span className="label-text dark:text-white">Description</span>
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              className="textarea textarea-bordered w-full h-10 rounded-lg dark:border-dark-border dark:bg-dark-background dark:text-gray-100 focus:ring-2 focus:ring-primary transition duration-200"
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
              <span className="label-text dark:text-white">Category</span>
            </label>
            <Field
              as="select"
              id="category"
              name="category"
              className="select select-bordered w-full rounded-lg dark:border-dark-border dark:bg-dark-background dark:text-gray-100 focus:ring-2 focus:ring-primary transition duration-200"
              aria-label="Category"
            >
              <option value="">Select a category</option>
              <option value="To-Do">To-Do</option>
              {/* <option value="In Progress">In Progress</option>
              <option value="Done">Done</option> */}
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
              <span className="label-text dark:text-white">Timestamp</span>
            </label>
            <ReactDatePicker
              id="timestamp"
              selected={values.timestamp}
              onChange={(date) => setFieldValue("timestamp", date)}
              className="input input-bordered w-full rounded-lg dark:border-dark-border dark:bg-dark-background dark:text-gray-100 focus:ring-2 focus:ring-primary transition duration-200"
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
            className="btn mt-2 w-full hover:text-white rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-secondary hover:bg-secondary hover:bg-primary-focus transition duration-200 disabled:opacity-50"
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
