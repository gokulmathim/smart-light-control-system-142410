import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

// PUBLIC_INTERFACE
export function getAuthHeader(token?: string) {
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

/** PUBLIC_INTERFACE
 * Generic GET request with auth
 */
export async function apiGet<T = unknown>(path: string, token?: string): Promise<T> {
  const response = await axios.get<T>(`${API_BASE}${path}`, {
    headers: getAuthHeader(token),
  });
  return response.data;
}

/** PUBLIC_INTERFACE
 * Generic POST request with auth
 */
export async function apiPost<T = unknown, U = unknown>(path: string, body: U, token?: string): Promise<T> {
  const response = await axios.post<T>(`${API_BASE}${path}`, body, {
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/** PUBLIC_INTERFACE
 * Generic DELETE request with auth
 */
export async function apiDelete<T = unknown>(path: string, token?: string): Promise<T> {
  const response = await axios.delete<T>(`${API_BASE}${path}`, {
    headers: getAuthHeader(token),
  });
  return response.data;
}

/** PUBLIC_INTERFACE
 * Generic PUT request with auth
 */
export async function apiPut<T = unknown, U = unknown>(path: string, body: U, token?: string): Promise<T> {
  const response = await axios.put<T>(`${API_BASE}${path}`, body, {
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
