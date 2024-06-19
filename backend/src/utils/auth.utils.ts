export const validateZid = (zid: string): boolean => {
    const regex = /^z[0-9]{7}$/;
    return regex.test(zid);
};

export const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if (password.match(regex)) {
        return true;
    }

    return false;
};
