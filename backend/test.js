const axios = require('axios');

async function run() {
  try {
    console.log('Testing Shorten...');
    const result = await axios.post('http://localhost:3000/api/shorten', {
      url: 'https://youtube.com',
      customAlias: 'ytest'
    });
    console.log('Shorten Result:', result.data);

    console.log('Testing GET links...');
    const links = await axios.get('http://localhost:3000/api/links');
    console.log('Links Count:', links.data.length);

    console.log('Testing Redirect (Expected 404 or page HTML if standard browser)...');
    try {
        await axios.get('http://localhost:3000/ytest', { maxRedirects: 0 });
    } catch (e) {
        if (e.response && e.response.status === 301) {
            console.log('Redirect success to:', e.response.headers.location);
        } else {
            console.log('Redirect failed with status:', e.response?.status);
        }
    }

    console.log('Done!');
  } catch (e) {
    console.error(e.response?.data || e.message);
  }
}
run();
