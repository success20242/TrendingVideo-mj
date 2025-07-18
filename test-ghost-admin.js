// test-ghost-admin.js
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const GHOST_ADMIN_API_URL = 'https://onyek-dawn-dew-1345.fly.dev/ghost/api/admin/posts/';
const ADMIN_API_KEY = '687a1632f6bf75027732aadb:ca149c0c9b83c8ed43cb10080461238a41168a089a5cf3d3d9b63baca0f20e7f';

const [id, secret] = ADMIN_API_KEY.split(':');
const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
  keyid: id,
  algorithm: 'HS256',
  expiresIn: '5m',
  audience: '/admin/',
});

(async () => {
  try {
    const res = await fetch(GHOST_ADMIN_API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Ghost ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (res.ok) {
      console.log('✅ Admin API key is VALID!');
      console.log(`Found ${data.posts.length} posts`);
    } else {
      console.error('❌ Admin API error:', data);
    }
  } catch (err) {
    console.error('❌ Network or auth error:', err.message);
  }
})();
