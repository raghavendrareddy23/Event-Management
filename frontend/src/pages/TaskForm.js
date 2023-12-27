import React from "react";
import { Textarea } from "../components/utils/Input";
import Loader from "../components/utils/Loader";

const TaskForm = ({
  formData,
  formErrors,
  loading,
  mode,
  handleChange,
  handleCategoryChange,
  handleReset,
  handleSubmit,
  navigate,
}) => {
  const fieldError = (field) => (
    <p
      className={`mt-1 text-pink-600 text-sm ${
        formErrors[field] ? "block" : "hidden"
      }`}
    >
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <form className="m-auto my-16 max-w-[1000px] bg-white p-8 border-2 shadow-md rounded-md">
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className="text-center mb-4">
                {mode === "add" ? "Add New Task" : "Edit Task"}
              </h2>
              <div className="mb-4">
                <label htmlFor="eventName">Event Name: </label>
                <input
                  type="eventName"
                  name="eventName"
                  id="eventName"
                  value={formData.eventName}
                  placeholder="Event Name.."
                  onChange={handleChange}
                />
                {fieldError("eventName")}
              </div>
              <div className="mb-4">
                <label htmlFor="startTime">Start Time: </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  id="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  onBlur={(e) => e.target.blur()} // Force blur after selection
                />
                {fieldError("startTime")}
              </div>
              <div className="mb-4">
                <label htmlFor="endTime">End Time: </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  id="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  onBlur={(e) => e.target.blur()} // Force blur after selection
                />
                {fieldError("endTime")}
              </div>
              <div className="mb-4">
                <label htmlFor="eventName">Location: </label>
                <input
                  type="location"
                  name="location"
                  id="eventName"
                  value={formData.location}
                  placeholder="location.."
                  onChange={handleChange}
                />
                {fieldError("eventName")}
              </div>
              <div className="mb-4">
                <label htmlFor="description">Description</label>
                <Textarea
                  type="description"
                  name="description"
                  id="description"
                  value={formData.description}
                  placeholder="Write here.."
                  onChange={handleChange}
                />
                {fieldError("description")}
              </div>
              <div className="mb-4">
                <label htmlFor="category">Category: </label>
                <select
                  name="category"
                  id="category"
                  type="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a category...</option>
                  <option value="Social event">Social event</option>
                  <option value="Entertainment event">
                    Entertainment event
                  </option>
                  <option value="Sports event">Sports event</option>
                  <option value="Educational event">Educational event</option>
                  <option value="Political event">Political event</option>
                  <option value="Corporate events">Corporate events</option>
                  <option value="Exhibition">Exhibition</option>
                  <option value="Religious/divine events">
                    Religious/divine events
                  </option>
                  <option value="Other">Other</option>
                </select>

                {formData.category === "Other" && (
                  <div className="mt-2">
                    <input
                      // name="category"
                      id="category"
                      type="text"
                      name="otherCategory"
                      value={formData.otherCategory}
                      placeholder="Enter other category.."
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:border-blue-500"
                    />
                    {fieldError("otherCategory")}
                  </div>
                )}
              </div>

              <button
                className="bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark"
                onClick={handleSubmit}
              >
                {mode === "add" ? "Add task" : "Update Task"}
              </button>
              <button
                className="ml-4 bg-red-500 text-white px-4 py-2 font-medium"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              {mode === "update" && (
                <button
                  className="ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600"
                  onClick={handleReset}
                >
                  Reset
                </button>
              )}
            </>
          )}
        </form>
  );
};

export default TaskForm;
