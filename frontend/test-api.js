
// Key taken from .env.local
const API_KEY = 'AIzaSyAgnv1ZDHdj-026uwd73JdSqSvvn9Jsw8g';
const MODEL = 'gemini-3-flash-preview';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

console.log(`Testing API connection to: ${MODEL}`);

try {
    const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello, are you working?" }] }]
        })
    });

    console.log(`Response Status Code: ${response.status}`);
    const parsed = await response.json();

    if (response.ok) {
        console.log('SUCCESS! API Response received.');
        console.log('Response preview:', parsed.candidates?.[0]?.content?.parts?.[0]?.text || 'No text content');
    } else {
        console.error('FAILURE! API returned error.');
        console.error('Error details:', JSON.stringify(parsed, null, 2));
    }
} catch (error) {
    console.error('Network Error:', error);
}
