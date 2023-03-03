export const fetchGetNum = (amount: number) => {
  return new Promise<{ data: number }>((resolve) => {
    setTimeout(() => {
      resolve({ data: amount });
    }, 1000);
  });
};
