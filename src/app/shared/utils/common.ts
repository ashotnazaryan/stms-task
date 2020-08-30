export const isEmptyObject = (object: { [key: string]: any }) => {
  return Object.entries(object).length === 0;
};
