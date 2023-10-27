export const extractNumbers = (inputString) => {
  const sanitizedString = inputString.replace(/,/g, ""); // Remove commas
  const numbers = sanitizedString.match(/\d+\.\d+|\d+/g) || [];
  return numbers.map((number) => parseFloat(number));
};

export const extractResolution = (inputString) => {
  const parts = inputString.match(/\d+/g); // Mencocokkan angka dalam string
  if (parts && parts.length === 2) {
    return {
      width: parseInt(parts[0]),
      height: parseInt(parts[1]),
    };
  } else {
    return null; // Atau objek dengan nilai default jika tidak sesuai format
  }
};
