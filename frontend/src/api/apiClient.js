export const fetchWithAuth = async (url, options = {}) => {
  const defaultOptions = {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  let response = await fetch(url, defaultOptions);

  if (response.status === 401 && !url.includes("/api/auth/refresh")) {
    const refreshResponse = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      response = await fetch(url, defaultOptions);
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
};

export const getErrorMessage = async (response) => {
  try {
    const data = await response.json();
    return data.message || "An error occurred";
  } catch {
    try {
      return await response.text();
    } catch {
      return response.statusText || "An error occurred";
    }
  }
};
