export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204 || response.status === 202) {
    return null as T;
  }
  return response.json();
}