import Constants from 'expo-constants';

// Get the computer's IP that Expo Go connected to (no hardcoding needed)
const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';

export const API_URL = `http://${host}:5148`;

// Central fetch helper: builds the request, handles errors and empty body.
// All endpoint functions below go through this.
async function request(path, options = {}) {
  const { method = 'GET', body } = options;
  const headers = {};
  let payload;

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers, body: payload });
  } catch {
    // fetch only throws when the server can't be reached at all
    throw new Error('Kunde inte nå servern. Är backend igång?');
  }

  if (!response.ok) {
    throw new Error('Något gick fel i anropet.');
  }

  // DELETE svarar med 204 (ingen body) – response.json() skulle krascha
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Endpoint functions - screens call these instead of using fetch directly
export const getRecipes = () => request('/api/recipes');
export const getRecipe = (id) => request(`/api/recipes/${id}`);
export const createRecipe = (data) => request('/api/recipes', { method: 'POST', body: data });
export const updateRecipe = (id, data) => request(`/api/recipes/${id}`, { method: 'PUT', body: data });
export const deleteRecipe = (id) => request(`/api/recipes/${id}`, { method: 'DELETE' });
