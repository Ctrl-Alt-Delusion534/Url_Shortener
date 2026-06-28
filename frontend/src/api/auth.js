import { fetchWithAuth, getErrorMessage } from "./apiClient";

export const registerUser = async ({ name, email, password }) => {
  const response = await fetchWithAuth("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const loginUser = async ({ email, password }) => {
  const response = await fetchWithAuth("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const getCurrentUser = async () => {
  const response = await fetchWithAuth("/api/auth/me");
  if (!response.ok) {
    throw new Error("Not logged in");
  }
  return response.json();
};

export const logoutUser = async () => {
  const response = await fetchWithAuth("/api/auth/logout", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Logout failed");
  }
  return response.json();
};

export const checkEmailExists = async (email) => {
  const response = await fetchWithAuth(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error("Failed to check email");
  }
  const data = await response.json();
  return data.exists;
};
