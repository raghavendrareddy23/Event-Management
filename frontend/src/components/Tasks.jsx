import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "./utils/Loader";
import Tooltip from "./utils/Tooltip";

const Tasks = () => {
  const authState = useSelector((state) => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();
  const [filter, setFilter] = useState(""); // State for filtering

  const fetchTasks = useCallback(() => {
    const config = {
      url: "/tasks",
      method: "get",
      headers: { Authorization: authState.token },
    };
    fetchData(config, { showSuccessToast: false }).then((data) =>
      setTasks(data.tasks)
    );
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: "delete",
      headers: { Authorization: authState.token },
    };
    fetchData(config).then(() => fetchTasks());
  };

  const generateAvatar = (eventName) => {
    const initials = eventName ? eventName.charAt(0).toUpperCase() : "";
    return (
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
        {initials}
      </div>
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const lowerCaseFilter = filter.toLowerCase();
    return (
      task.category.toLowerCase().includes(lowerCaseFilter) ||
      task.eventName.toLowerCase().includes(lowerCaseFilter) ||
      task.startTime.toLowerCase().includes(lowerCaseFilter) ||
      task.endTime.toLowerCase().includes(lowerCaseFilter) ||
      task.location.toLowerCase().includes(lowerCaseFilter) ||
      task.description.toLowerCase().includes(lowerCaseFilter)
    );
  });

  return (
    <div className="my-2 mx-auto w-4/5 py-4">
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Filter the events..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:border-blue-500"
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {filteredTasks.length === 0 ? (
            <div className="w-full h-[300px] flex items-center justify-center gap-4">
              <span>No tasks found</span>
              <Link
                to="/tasks/add"
                className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2"
              >
                + Add new task{" "}
              </Link>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-4 text-gray-600 rounded-md shadow-md"
              >
                <div>{generateAvatar(task.eventName)}</div>
                <div>
                  <p>
                    <strong>Event Name:</strong> {task.eventName}
                  </p>
                  <p>
                    <strong>Start Time:</strong> {task.startTime}
                  </p>
                  <p>
                    <strong>End Time:</strong> {task.endTime}
                  </p>
                  <p>
                    <strong>Location:</strong> {task.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {task.description}
                  </p>
                  <p>
                    <strong>Category:</strong> {task.category}
                  </p>
                </div>

                <div className="flex justify-between mt-2">
                  <Tooltip text={"Edit this task"} position={"top"}>
                    <Link
                      to={`/tasks/${task._id}`}
                      className="text-green-600 cursor-pointer"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </Link>
                  </Tooltip>
                  <Tooltip text={"Delete this task"} position={"top"}>
                    <span
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(task._id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </span>
                  </Tooltip>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
