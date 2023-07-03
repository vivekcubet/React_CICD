const generateUniqueId = () => {
  // Generate a random timestamp
  var timestamp = new Date().getTime();

  // Generate a random number between 0 and 9999
  var randomNumber = Math.floor(Math.random() * 10000);

  // Concatenate the timestamp and random number
  var uniqueId = timestamp.toString() + randomNumber.toString();

  return uniqueId;
};

export default generateUniqueId;
