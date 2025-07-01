const fetch = require('node-fetch');

const client_id = '235216507530-fjumhq2un4avnpll6tr1qc3uo48jj4eq.apps.googleusercontent.com';
const client_secret = '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';
const redirect_uri = 'https://trendifyhub.vercel.app/auth/google/callback';
const code = '4/0AVMBsJjAqP8AH9G2DszQKB8_-9D91taeIwVwtElF7wPYdSVnD5sLlmyEx0TEHxwnDyEGYA'; // paste your real code

(async () => {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri,
      grant_type: 'authorization_code'
    })
  });

  const data = await res.json();
  console.log('✅ Blogger Tokens:\n', data);
})();