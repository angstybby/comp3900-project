export const validateZid = (zid: string): boolean => {
  const regex = /^z[0-9]{7}$/;
  return regex.test(zid);
};

export const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
  if (password.match(regex)) {
    return true;
  }

  return false;
};

export const validateName = (name: string): boolean => {
  const regex = /^[a-zA-Z\s]*$/;
  return regex.test(name);
};
