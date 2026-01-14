
const API_KEY = 'AIzaSyAgnv1ZDHdj-026uwd73JdSqSvvn9Jsw8g';
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log(`Listing available models...`);

try {
    const response = await fetch(URL);
    const parsed = await response.json();

    if (response.ok) {
        console.log('SUCCESS! Models found:');
        parsed.models.forEach(m => {
            if (m.name.includes('gemini')) {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
            }
        });
    } else {
        console.error('FAILURE!');
        console.error(JSON.stringify(parsed, null, 2));
    }
} catch (error) {
    console.error('Network Error:', error);
}
