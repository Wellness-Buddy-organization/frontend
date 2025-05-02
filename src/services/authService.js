import axios from "axios";

export const loginUser = async ({ email, password }) => {
  const response = await axios.post(
    import.meta.env.VITE_API_URL + "/users/login",
    { email, password }
  );
  return response.data;
};

export const loginWithGoogle = () => {
  window.location.href = import.meta.env.VITE_API_URL + "/auth/google";
};
