export const cl = (
  ...classes: (
    | { value: string | undefined }
    | string
    | false
    | null
    | undefined
  )[]
) => {
  return classes
    .filter((clas) => {
      return typeof clas === 'string'
    })
    .join(' ')
}
