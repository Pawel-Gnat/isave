const capitalizeFirstLetter = (string: string): string => {
  const lowerCased = string.toLowerCase();
  return lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
};

export default capitalizeFirstLetter;
