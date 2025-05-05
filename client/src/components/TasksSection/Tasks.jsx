import styles from "./Tasks.module.css";
import {
  crosLight,
  filterLightLogo,
  plusLogo,
  sortLightLogo,
} from "../../assets/index.js";
import Task from "./Task.jsx";
import NewTask from "./NewTask.jsx";
import { useEffect, useState } from "react";
import { TasksFilterCard } from "../UI/FunctionCard.jsx";
import EditTask from "./EditTask.jsx";
import { taskAction } from "../../store/tasks.js";
import { useDispatch, useSelector } from "react-redux";
import Message from "../UI/Message..jsx";
import { uiAction } from "../../store/ui.js";

const URL = import.meta.env.VITE_SERVER_URL;

const Tasks = () => {
  const dispatch = useDispatch();
  const [isNewTask, setIsNewTask] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  const [isFilterShow, setIsFilterShow] = useState(false);
  const [isShortShow, setIsShortShow] = useState(false);
  const [sortBy, setSortBy] = useState("Default");
  const [filterBy, setFilterBy] = useState("All");
  const [singleTask, setSingleTask] = useState("");
  const searchData = useSelector((state) => state.task.searchData);
  const isMessage = useSelector((state) => state.ui.isMessage);
  const message = useSelector((state) => state.ui.message);
  const messageType = useSelector((state) => state.ui.messageType);

  const newTaskHandler = () => {
    if (!isEditTask) {
      setIsNewTask((pre) => !pre);
    }
    setIsEditTask(false);
  };

  const filterHandler = (value, e, data) => {
    e.stopPropagation();
    setIsFilterShow(value);
    setIsShortShow(false);
    setFilterBy(data);
  };

  const shorterHandler = (value, e, data) => {
    e.stopPropagation();
    setIsShortShow(value);
    setIsFilterShow(false);
    setSortBy(data);
  };

  const editTaskHandler = async (taskId) => {
    try {
      // Close new task form if it's open
      setIsNewTask(false);

      const response = await fetch(`${URL}task/${taskId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("task fetch issue");
      }

      const data = await response.json();
      setIsEditTask(true);
      dispatch(taskAction.setEditingTask({ task: data.data }));
    } catch (err) {
      console.error(err);
      dispatch(
        uiAction.errorMessageHandler({ message: "Failed to fetch task" })
      );
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${URL}task`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      dispatch(taskAction.replaceTask({ tasks: data.data }));
    } catch (err) {
      console.error(err);
      dispatch(
        uiAction.errorMessageHandler({ message: "Failed to load tasks" })
      );
    }
  };

  const getTasks = () => {
    if (sortBy && filterBy) {
      const url =
        URL +
        `task?sorts=${sortBy === "Default" ? "" : sortBy}&filter=${
          filterBy === "All" ? "" : filterBy
        }&search=${searchData}`;

      fetch(url, { method: "GET", credentials: "include" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("task get issue");
          }
          return response.json();
        })
        .then((data) => {
          dispatch(taskAction.replaceTask({ tasks: data.data }));
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            uiAction.errorMessageHandler({ message: "Something went wrong!" })
          );
        });
    }
  };

  useEffect(() => {
    getTasks();
  }, [filterBy, sortBy, searchData]);

  useEffect(() => {
    fetchTasks();

    return () => {
      dispatch(taskAction.replaceTask({ tasks: [] }));
      dispatch(taskAction.clearEditingTask());
    };
  }, [dispatch]);

  const closeMessage = () => {
    dispatch(uiAction.closeMessageHandler());
  };

  useEffect(() => {
    const messageHideHandler = setTimeout(() => {
      dispatch(uiAction.closeMessageHandler());
    }, 5000);

    return () => {
      clearTimeout(messageHideHandler);
    };
  }, [isMessage, message]);

  const closeEditTaskHandler = () => {
    setIsEditTask(false);
  };

  return (
    <div className={styles["tasks-container"]}>
      {isMessage && (
        <Message
          message={message}
          type={messageType}
          closeHandler={closeMessage}
        />
      )}

      <div className={styles["task-header"]}>
        <p>Task Board</p>
        <div className={styles["task-header-options"]}>
          <div
            onClick={newTaskHandler}
            className={`${styles["create-task"]} ${
              isNewTask ? styles["close-task"] : ""
            } ${isEditTask ? styles["close-task"] : ""}`}
          >
            <div className={styles["create-task-logo"]}>
              <img
                src={isNewTask ? crosLight : isEditTask ? crosLight : plusLogo}
                alt={"plusLogo"}
              />
            </div>
            {isNewTask && <p>Close New</p>}{" "}
            {!isEditTask && !isNewTask && <p>Add New</p>}{" "}
            {isEditTask && <p>Close Edit</p>}
          </div>
          <div
            className={styles["filter"]}
            onClick={(e) => filterHandler(true, e)}
          >
            <img
              onClick={(e) => filterHandler(true, e)}
              src={filterLightLogo}
              alt={"filter"}
            />
            {isFilterShow && (
              <TasksFilterCard
                optionHandlder={filterHandler}
                options={["All", "Completed", "Pending"]}
              />
            )}
          </div>
          <div
            className={styles["sort"]}
            onClick={(e) => shorterHandler(true, e)}
          >
            <img src={sortLightLogo} alt={"sort"} />
            {isShortShow && (
              <TasksFilterCard
                options={["Default", "Date", "Priority"]}
                optionHandlder={shorterHandler}
              />
            )}
          </div>
        </div>
      </div>
      {isNewTask && <NewTask />}
      {isEditTask && <EditTask closeHandler={closeEditTaskHandler} />}
      <Task editTaskHandler={editTaskHandler} />
    </div>
  );
};

export default Tasks;
