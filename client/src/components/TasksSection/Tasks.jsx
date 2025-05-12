import styles from "./Tasks.module.css";
import {
  crosLight,
  filterLightLogo,
  plusLogo,
  sortLightLogo,
} from "../../assets/index.js";
import Task from "./Task.jsx";
import NewTask from "./NewTask.jsx";
import { useState, useEffect } from "react";
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
  const [filterBy, setFilterBy] = useState("All");
  const [singleTask, setSingleTask] = useState("");
  const [currentSort, setCurrentSort] = useState("default");
  const tasks = useSelector((state) => state.task.tasks);
  const isMessage = useSelector((state) => state.ui.isMessage);
  const message = useSelector((state) => state.ui.message);
  const messageType = useSelector((state) => state.ui.messageType);

  const newTaskHandler = () => {
    if (!isEditTask) {
      setIsNewTask((pre) => !pre);
    }
    setIsEditTask(false);
  };

  const filterHandler = (showMenu, e, filterType) => {
    e?.preventDefault();

    if (filterType) {
      setFilterBy(filterType);
      fetchTasks(currentSort, filterType);
      setIsFilterShow(false);
    } else {
      setIsFilterShow(showMenu);
    }
  };

  const shorterHandler = (showMenu, e, sortType) => {
    e?.preventDefault();

    if (sortType) {
      setCurrentSort(sortType.toLowerCase());
      dispatch(taskAction.setSortBy(sortType.toLowerCase()));
      fetchTasks(sortType.toLowerCase(), filterBy);
      setIsShortShow(false);
    } else {
      setIsShortShow(showMenu);
    }
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

  const fetchTasks = async (sortType = currentSort, filter = filterBy) => {
    try {
      const queryParams = new URLSearchParams({
        sorts: sortType,
        filter: filter,
      });

      const response = await fetch(`${URL}task?${queryParams}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      dispatch(
        taskAction.replaceTask({
          tasks: data.data,
          sortBy: sortType,
          filter: filter,
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(
        uiAction.errorMessageHandler({ message: "Failed to load tasks" })
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentSort, filterBy]);

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
                currentSort={currentSort}
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
