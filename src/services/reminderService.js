import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const addReminder = async (data) => {
  const res = await axios.post(`${API_URL}/reminder`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateReminder = async (id, data) => {
  const res = await axios.put(`${API_URL}/reminder/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteReminder = async (id) => {
  const res = await axios.delete(`${API_URL}/reminder/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
