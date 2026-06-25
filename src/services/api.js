const API_URL = import.meta.env.VITE_API_URL;

export const fetchData = async (endpoint, options = {}) => {
  // this is to connect the front end to the back end
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "API request failed");
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return null;
};

export const loginUser = async (credentials) => {
  return fetchData('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (userData) => {
  return fetchData('/users/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const forgotPassword = async (email) => {
  return fetchData('/users/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async ({ token, password }) => {
  return fetchData('/users/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
};

export const createEvent = async (eventData) => {
  return fetchData("/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
};

export const updateEvent = async (eventId, eventData) => {
  return fetchData(`/events/${eventId}`, {
    method: "PATCH",
    body: JSON.stringify(eventData),
  });
};

export const deleteEvent = async (eventId) => {
  return fetchData(`/events/${eventId}`, {
    method: "DELETE",
  });
};

export const createPain = async (painData) => {
  return fetchData("/pains", {
    method: "POST",
    body: JSON.stringify(painData),
  });
};

export const updatePain = async (painId, painData) => {
  return fetchData(`/pains/${painId}`, {
    method: "PATCH",
    body: JSON.stringify(painData),
  });
};

export const deletePain = async (painId) => {
  return fetchData(`/pains/${painId}`, {
    method: "DELETE",
  });
};

export const createMood = async (moodData) => {
  return fetchData("/moods", {
    method: "POST",
    body: JSON.stringify(moodData),
  });
};

export const updateMood = async (moodId, moodData) => {
  return fetchData(`/moods/${moodId}`, {
    method: "PATCH",
    body: JSON.stringify(moodData),
  });
};

export const deleteMood = async (moodId) => {
  return fetchData(`/moods/${moodId}`, {
    method: "DELETE",
  });
};
