import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
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
    },
  },
});

export const taskAction = taskSlice.actions;

export default taskSlice.reducer;
