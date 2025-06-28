export const logError = (fn: any, error: any) => {
  if (process.env.NODE_ENV === 'production') {
    return fn();
  } else {
    console.error(error);
  }
};
