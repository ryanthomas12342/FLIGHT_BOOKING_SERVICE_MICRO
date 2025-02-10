module.exports = (str1, str2) => {
  const arrival = new Date(str1);
  const depart = new Date(str2);
  if (arrival > depart) {
    return false;
  }
  return true;
};
