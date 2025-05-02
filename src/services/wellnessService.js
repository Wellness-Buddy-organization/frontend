import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

export const fetchDashboard = () =>
  api.get("/dashboard/me").then((res) => res.data);

export const fetchReminders = () =>
  api.get("/reminder").then((res) => res.data);

export const fetchBreaks = () => api.get("/break").then((res) => res.data);

export const saveMood = (mood, stress) =>
  api.post("/mood", { mood, notes: `Stress: ${stress}` });

export const saveSleep = (hours) =>
  api.post("/sleep", { hours, quality: "good" });

export const saveWork = (hours) => api.post("/work", { hours });

export const logBreak = () =>
  api.post("/break", { duration: 5, type: "short" }).then((res) => res.data);
