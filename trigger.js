// trigger.js
import handler from './pages/api/daily.js';

const req = {};
const res = {
  status: (code) => ({
    send: (msg) => console.log(`Status: ${code}\n${msg}`)
  })
};

handler(req, res);
