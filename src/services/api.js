const API_URL = import.meta.env.VITE_API_URL;

export const fetchData = async (endpoint, options = {}) => {
  // this is to connect the front end to the back end
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) throw new Error('API request failed');
  return response.json();
};

export const createEvent = async (eventData) => {
  return fetchData('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
};

export const updateEvent = async (eventId, eventData) => {
  return fetchData(`/events/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(eventData),
  });
};

export const deleteEvent = async (eventId) => {
  return fetchData(`/events/${eventId}`, {
    method: 'DELETE',
  });
};