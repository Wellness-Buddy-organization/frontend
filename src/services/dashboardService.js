import axios from "axios";

export const fetchDashboardData = async (signal) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  const response = await axios.get(
    import.meta.env.VITE_API_URL + "/dashboard/me",
    {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    }
  );
  return response.data;
};
