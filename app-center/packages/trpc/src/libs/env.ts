export const getPublicKey = () => {
  return process.env.JWT_PUBLIC;
};

export const getPrivateKey = () => {
  return process.env.JWT_PRIVATE;
};
