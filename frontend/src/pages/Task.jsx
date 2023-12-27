import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/utils/Loader";
import useFetch from "../hooks/useFetch";
import MainLayout from "../layouts/MainLayout";
import validateManyFields from "../validations";
import TaskForm from "./TaskForm";

const Task = () => {
  const authState = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? "add" : "update";
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    eventName: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    category: "",
    otherCategory: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === "add" ? "Add task" : "Update Task";
  }, [mode]);

  useEffect(() => {
    if (mode === "update") {
      const config = {
        url: `/tasks/${taskId}`,
        method: "get",
        headers: { Authorization: authState.token },
      };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData((prevFormData) => ({
          ...prevFormData,
          eventName: data.task.eventName,
          startTime: data.task.startTime,
          endTime: data.task.endTime,
          location: data.task.location,
          description: data.task.description,
          category: data.task.category,
        }));
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === "Other") {
      setFormData({ ...formData, category: formData.otherCategory });
    } else {
      setFormData({ ...formData, category: selectedCategory });
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      eventName: task.eventName,
      startTime: task.startTime,
      endTime: task.endTime,
      location: task.location,
      description: task.description,
      category: task.category,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields("task", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }

    if (mode === "add") {
      const config = {
        url: "/tasks",
        method: "post",
        data: formData,
        headers: { Authorization: authState.token },
      };
      fetchData(config).then(() => {
        navigate("/");
      });
    } else {
      const config = {
        url: `/tasks/${taskId}`,
        method: "put",
        data: formData,
        headers: { Authorization: authState.token },
      };
      fetchData(config).then(() => {
        navigate("/");
      });
    }
  };

  return (
    <>
      <MainLayout>
        {loading ? (
          <Loader />
        ) : (
          <TaskForm
            formData={formData}
            formErrors={formErrors}
            loading={loading}
            mode={mode}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            handleReset={handleReset}
            handleSubmit={handleSubmit}
            navigate={navigate}
          />
        )}
      </MainLayout>
    </>
  );
};

export default Task;
