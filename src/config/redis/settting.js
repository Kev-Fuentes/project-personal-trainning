const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = process.env;

const settingDev = {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT),
};

const settingPro = {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT),
  password: REDIS_PASS,
};

const setting = process.env.NODE_ENV === 'production' ? settingPro : settingDev;

const keyName = 'test:condorlabs-npm-helpers:counter';

module.exports = {
  setting,
  keyName,
};
