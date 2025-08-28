const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');

const JWT_SECRET = '7vse7O6C1VxdEK5Bl58TaBFepg7wZL0g';

export const generateToken = (data, expireIn) => {
  return jwt.sign(data, JWT_SECRET.toString('utf-8'), {
    expiresIn: expireIn,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET.toString('utf-8'));
  } catch (error) {
    return null;
  }
};

export const generateQR = async (url) => {
  try {
    const qrOption = {
      margin: 1,
      width: 2800,
    };
    const qrCode = await QRCode.toDataURL(url, qrOption);
    return qrCode;
  } catch (error) {
    console.log({ error: 'Error generando el código QR' });
  }
};
