import crypto from 'crypto';


export const generateOTP = (length: number = 6): string => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let otp = '';

    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        otp += chars[randomBytes[i] % chars.length];
    }

    return otp;
};
