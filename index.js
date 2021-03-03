const axios = require('axios');
const dayjs = require('dayjs');
require('dayjs/locale/fr');
const cron = require('node-cron');
const localizedFormat = require('dayjs/plugin/localizedFormat');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
require('dotenv').config();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Paris');
dayjs.extend(localizedFormat);
dayjs.locale('fr');

function log(...args) {
  console.log(`[${dayjs().format('lll')}]`, ...args);
}

function test() {
  log('Testing...');
  return axios.get(`${process.env.API_BASE}`, {
    params: { cmd: 'testftp' },
    auth: { username: process.env.CAM_USERNAME, password: process.env.CAM_PASSWORD },
    timeout: 20 * 1000,
  });
}

async function reboot() {
  log('Rebooting...');
  return axios.get(`${process.env.API_BASE}`, {
    params: { cmd: 'sysreboot' },
    auth: { username: process.env.CAM_USERNAME, password: process.env.CAM_PASSWORD },
  });
}

async function run() {
  log('Running task...');
  try {
    const response = await test();
    log(response && response.data);
    log('All good, see you later.');
  } catch (e) {
    log('Error!', e.response && e.response.status, e.response && e.response.statusText);
    if (e.code && e.code === 'ECONNABORTED') {
      await reboot();
    } else {
      log('Not a timeout, ignoring.');
    }
  }
}

run();
cron.schedule('0 * * * *', run);
