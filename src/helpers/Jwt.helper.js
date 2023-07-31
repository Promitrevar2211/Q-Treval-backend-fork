import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import config from '../../config/index.js'

dotenv.config();

const jwtOption = {
  // eslint-disable-next-line no-undef
  expiresIn: config.EXPIRED_IN || "1d",
};

const refreshJwtOption = {
  // eslint-disable-next-line no-undef
  expiresIn: config.REFRESH_EXPIRED_IN || "1y",
};

export function getJwt(data) {
  // eslint-disable-next-line no-undef
  return jsonwebtoken.jsonwebtoken.sign (data, config.JWT_SECRET_KEY, jwtOption);
}

export function getShortJwt(data) {
  // eslint-disable-next-line no-undef
  return jsonwebtoken.jsonwebtoken.sign (data, 'asaefasacsae', {
    expiresIn: '1h'
  });
}


export async function verifyShortJwt(authorization) {
  // eslint-disable-next-line no-undef
  const token = await jsonwebtoken.verify(authorization, 'asaefasacsae');
  return token;
}

export function getRefreshJwt(data) {
  // eslint-disable-next-line no-undef
  return jsonwebtoken.jsonwebtoken.sign (data, config.JWT_SECRET_KEY, refreshJwtOption);
}

export async function verifyJwt(authorization) {
  // eslint-disable-next-line no-undef
  const token = await jsonwebtoken.verify(authorization, config.JWT_SECRET_KEY);
  return token;
}
