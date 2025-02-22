import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import toast from "react-hot-toast";

const TaskList = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [tasks, setTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    if (!user || !user.token) return;
    try {
      const res = await axiosPublic.get("/tasks", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const grouped = res.data.reduce(
        (acc, task) => {
          acc[task.category].push(task);
          return acc;
        },
        { "To-Do": [], "In Progress": [], Done: [] }
      );
      // Sort each category by order
      Object.keys(grouped).forEach((cat) => {
        grouped[cat].sort((a, b) => a.order - b.order);
      });
      setTasks(grouped);
    } catch (error) {
      toast.error("Getting task is failed!");
      // console.error(
      //   "Fetch tasks failed:",
      //   error.response?.data || error.message
      // );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    const activeCategory = Object.keys(tasks).find((cat) =>
      tasks[cat].some((task) => task._id === activeId)
    );
    const overCategory = Object.keys(tasks).find((cat) =>
      tasks[cat].some((task) => task._id === overId)
    );

    if (!activeCategory || !overCategory) return;

    const sourceTasks = [...tasks[activeCategory]];
    const destTasks = [...tasks[overCategory]]; // Always a fresh copy, even if same category
    const [movedTask] = sourceTasks.splice(
      sourceTasks.findIndex((t) => t._id === activeId),
      1
    );

    const updatedDestTasks = [...destTasks];
    const overIndex = destTasks.findIndex((t) => t._id === overId);
    const insertIndex = overIndex === -1 ? destTasks.length : overIndex; // Handle end of list

    if (activeCategory === overCategory) {
      // remove the moved task from its original position in same category
      const ExistingIdx = updatedDestTasks.findIndex((t) => t._id === activeId);
      if (ExistingIdx !== -1) {
        updatedDestTasks.splice(ExistingIdx, 1);
      }
      updatedDestTasks.splice(insertIndex, 0, movedTask);
    } else {
      movedTask.category = overCategory;
      updatedDestTasks.splice(insertIndex, 0, movedTask);
    }

    updatedDestTasks.forEach((task, index) => {
      task.order = index;
    });

    setTasks((prev) => {
      const newTasks = {
        ...prev,
        [activeCategory]: [...sourceTasks], // Remaining tasks after removal
        [overCategory]: [...updatedDestTasks], // Updated destination
      };
      console.log("Setting new tasks:", newTasks);
      return newTasks;
    });

    try {
      toast("Updating tasks");
      // const responses = 
      await Promise.all(
        updatedDestTasks.map((task) =>
          axiosPublic.put(`/tasks/${task._id}`, task, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
        )
      );
      // console.log(
      //   "Backend responses:",
      //   responses.map((res) => res.data)
      // );
    } catch (error) {
      toast.error("Drag failed!");
      // console.error(
      //   "Drag update failed:",
      //   error.response?.data || error.message
      // );
      fetchTasks();
    }
  };

  useEffect(() => {
    // console.log("Tasks state updated:", tasks);
    toast.success("Tasks state updated")
  }, [tasks]);
  useEffect(() => {
    console.log("editingTask updated:", editingTask);
  }, [editingTask]);

  const handleEditSubmit = async (taskId, updatedData) => {
    try {
      const response = await axiosPublic.put(`/tasks/${taskId}`, updatedData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks((prev) => {
        const updatedTasks = { ...prev };
        const oldCategory = Object.keys(tasks).find((cat) =>
          tasks[cat].some((t) => t._id === taskId)
        );
        if (oldCategory !== response.data.category) {
          updatedTasks[oldCategory] = updatedTasks[oldCategory].filter(
            (t) => t._id !== taskId
          );
          updatedTasks[response.data.category] = [
            ...updatedTasks[response.data.category],
            response.data,
          ].sort((a, b) => a.order - b.order);
        } else {
          updatedTasks[response.data.category] = updatedTasks[
            response.data.category
          ]
            .map((t) => (t._id === taskId ? response.data : t))
            .sort((a, b) => a.order - b.order);
        }
        return updatedTasks;
      });
      setEditingTask(null);
    } catch (error) {
      toast.error("Edit failed!");
      console.error("Edit failed:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axiosPublic.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks((prev) => {
        const updatedTasks = { ...prev };
        const category = Object.keys(tasks).find((cat) =>
          tasks[cat].some((t) => t._id === taskId)
        );
        if (category) {
          updatedTasks[category] = updatedTasks[category]
            .filter((t) => t._id !== taskId)
            .map((task, index) => ({ ...task, order: index })); // Reorder after delete
        }
        return updatedTasks;
      });
    } catch (error) {
      console.error("Delete failed:", error);
      fetchTasks();
    }
  };

  if (!user)
    return (
      <p className="text-center text-gray-500 dark:text-gray-300">
        Please sign in to view tasks.
      </p>
    );

  return (
    <div className="task-list p-6 max-w-7xl mx-auto ">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-50">
        Your Tasks
      </h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="task-board flex flex-col md:flex-row gap-4">
          {["To-Do", "In Progress", "Done"].map((category) => (
            <SortableColumn
              key={category}
              category={category}
              tasks={tasks[category]}
              onEdit={setEditingTask}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </DndContext>
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSubmit={handleEditSubmit}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

const SortableColumn = ({ category, tasks, onEdit, onDelete }) => {
  console.log(
    "SortableContext items for",
    category,
    ":",
    tasks.map((task) => task._id)
  );
  return (
    <div className="column flex-1 min-w-[250px] p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        {category}
      </h2>
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <SortableItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </SortableContext>
    </div>
  );
};

const SortableItem = ({ task, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    console.log("Edit clicked for task:", task._id, "at:", new Date().toISOString());
    onEdit(task);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task dark:bg-gray-800 dark:text-white p-4 mb-2 rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-grab"
    >
      <h3 className="font-medium text-gray-800 dark:text-white">
        {task.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
      <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
        {new Date(task.timestamp).toLocaleDateString()}
      </p>
      <div className="flex gap-2 mt-2">
        <button onClick={handleEditClick} className="btn btn-sm btn-primary">
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="btn btn-sm btn-error"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const EditTaskModal = ({ task, onSubmit, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [category, setCategory] = useState(task.category);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task._id, { title, description, category });
  };

  return (
    <div className="modal modal-open fixed inset-0 bg-opacity-50 flex items-center justify-center">
      <div className="modal-box bg-base-100 dark:bg-dark-background dark:text-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Edit Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text dark:text-gray-300">Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full dark:border-dark-border dark:bg-dark-background dark:text-gray-300"
              maxLength={50}
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text dark:text-gray-300">Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full dark:border-dark-border dark:bg-dark-background dark:text-gray-300"
              maxLength={200}
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text dark:text-gray-300">Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select select-bordered w-full dark:border-dark-border dark:bg-dark-background dark:text-gray-300"
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskList;
