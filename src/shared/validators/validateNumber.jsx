export const validateNumber = (value) => {
  const number = Number(value);
  return !isNaN(number) && number > 0;
};

export const validateNumberMessage = "Debe ser un número mayor a 0.";