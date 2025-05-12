import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  sortBy: "default",
  filterBy: "All",
  searchQuery: "",
  editingTask: null,
};

const taskSlice = createSlice({
  name: "taskslice",
  initialState,
  reducers: {
    addNewTask(state, action) {
      state.tasks.push(action.payload.task);
    },
    updateTask(state, action) {
      const updatedTask = action.payload.task;
      const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter(
        (task) => task.id !== action.payload.taskId
      );
    },
    setEditingTask(state, action) {
      state.editingTask = action.payload.task;
    },
    clearEditingTask(state) {
      state.editingTask = null;
    },
    replaceTask(state, action) {
      state.tasks = action.payload.tasks;
      state.sortBy = action.payload.sortBy;
      state.filterBy = action.payload.filter;

      // Filter tasks based on search query
      if (state.searchQuery) {
        state.tasks = state.tasks.filter((task) =>
          task.task.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }

      // Sort tasks based on current sortBy
      switch (state.sortBy) {
        case "priority":
          state.tasks.sort((a, b) => Number(b.priority) - Number(a.priority));
          break;
        case "date":
          state.tasks.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        default:
          state.tasks.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
      }
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
});

export const taskAction = taskSlice.actions;

export default taskSlice.reducer;
