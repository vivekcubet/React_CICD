const getFilenameFromUrl = (url: any) => {
  try {
    if (url) {
      // Get the last index of the slash character in the URL.
      var lastIndexOfSlash = url.lastIndexOf('/');

      // If there is no slash character in the URL, return an empty string.
      if (lastIndexOfSlash === -1) {
        return '';
      }

      // Get the substring of the URL starting from the last slash character.
      var substring = url.substring(lastIndexOfSlash + 1);

      // Return the substring.
      return substring;
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

export default getFilenameFromUrl;
