import styles from "./NewTask.module.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { taskAction } from "../../store/tasks.js";
import { uiAction } from "../../store/ui.js";

const URL = import.meta.env.VITE_SERVER_URL;

const EditTask = ({ closeHandler = () => {} }) => {
  const dispatch = useDispatch();
  const editingTask = useSelector((state) => state.task.editingTask);
  const [taskData, setTaskData] = useState({
    task: editingTask?.task || "",
    priority: editingTask?.priority || "",
  });

  const taskDataHandler = (e) => {
    const { name, value } = e.target;

    setTaskData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const onDataSubmit = async (e) => {
    e.preventDefault();

    // Add validation
    if (!taskData.task || taskData.task.trim().length < 3) {
      dispatch(
        uiAction.errorMessageHandler({
          message: "Task must be at least 3 characters long",
        })
      );
      return;
    }

    if (!taskData.priority) {
      dispatch(
        uiAction.errorMessageHandler({
          message: "Please select a priority",
        })
      );
      return;
    }

    try {
      const response = await fetch(`${URL}task/${editingTask.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Task update issue");
      }

      const data = await response.json();

      dispatch(taskAction.updateTask({ task: data.data }));
      dispatch(
        uiAction.messageHandler({ message: "Task updated successfully!" })
      );

      dispatch(taskAction.clearEditingTask());

      // Close modal only if update was successful
      if (closeHandler && typeof closeHandler === "function") {
        closeHandler();
      }
    } catch (err) {
      console.error("Update Error:", err);
      dispatch(
        uiAction.errorMessageHandler({
          message: err.message || "Failed to update task",
        })
      );
    }
  };

  return (
    <div className={styles["new-task-container"]}>
      <div className={styles["new-task-container-sub"]}>
        <form onSubmit={onDataSubmit}>
          <label htmlFor={"newtask"}>Edit Task</label>
          <input
            onChange={taskDataHandler}
            type={"text"}
            id={"newtask"}
            placeholder={"Edit Task"}
            name={"task"}
            value={taskData.task}
          />
          <label htmlFor={"pri"}>Priority</label>
          <select
            onChange={taskDataHandler}
            value={taskData.priority}
            id={"pri"}
            name={"priority"}
          >
            <option value={""}>Select Priority</option>
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>
          <button type="submit">Update Task</button>
        </form>
      </div>
    </div>
  );
};

EditTask.propTypes = {
  closeHandler: PropTypes.func,
};

export default EditTask;
