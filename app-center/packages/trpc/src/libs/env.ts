export const getJwtSecret = () => {
  console.log(process.env.JWT_SECRET);
  return process.env.JWT_SECRET;
};
