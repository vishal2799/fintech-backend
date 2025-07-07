export const success = (data: any, message = 'Success') => ({
  success: true,
  message,
  data,
})

export const fail = (message = 'Something went wrong', status = 400) => {
  const error = new Error(message)
  ;(error as any).status = status
  throw error
}
