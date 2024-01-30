export class ApiError extends Error {}

export class UnauthorizedError extends ApiError {}

export const handleErrorResponse = async (response: Response) => {
  if (response.ok) {
    return
  }

  const data = await response.json()

  const message =
    typeof data === 'object' && 'message' in data
      ? data.message
      : response.statusText

  if (response.status === 401) {
    throw new UnauthorizedError(message)
  } else {
    throw new ApiError(message)
  }
}
