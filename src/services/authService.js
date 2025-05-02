import axios from "axios";

export const loginUser = async ({ email, password }) => {
  const response = await axios.post(
    import.meta.env.VITE_API_URL + "/users/login",
    { email, password }
  );
  return response.data;
};

export const signupUser = async (formData) => {
  const response = await axios.post(
    import.meta.env.VITE_API_URL + "/users/signup",
    formData
  );
  return response.data;
};

export const signupWithGoogle = () => {
  window.location.href = import.meta.env.VITE_API_URL + "/auth/google";
};

export const loginWithGoogle = () => {
  window.location.href = import.meta.env.VITE_API_URL + "/auth/google";
};
