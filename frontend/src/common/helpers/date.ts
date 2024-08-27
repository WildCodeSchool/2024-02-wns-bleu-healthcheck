// Date helpers

// Converts to a readable string based on the locale of the environment
export const formatDate = (isoDateString: string) => {
  const date = new Date(isoDateString);
  return date.toLocaleString(navigator.language); 
}