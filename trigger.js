import handler from './pages/api/daily.js'; // ✅ Correct path if file is located here

const req = {}; // ✅ Mock request object
const res = {
  status: (code) => ({
    send: (msg) => console.log(`Status: ${code}\n${msg}`) // ✅ Output response in console
  })
};

handler(req, res); // ✅ Triggers your automation
