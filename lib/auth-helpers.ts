import bcrypt from 'bcrypt';

export const verifyPassword = async (password: string, hashedPassword: string) => {
  console.log('verifyPassword', password, hashedPassword);
  return await bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};
