const isUrlValid = (url: string) => {
  // Regular expression pattern to match URL format
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  // Test if the URL matches the pattern
  return urlPattern.test(url);
};

export default isUrlValid;
