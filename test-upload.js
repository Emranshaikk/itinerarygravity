const fs = require('fs');
const path = require('path');
const http = require('http');

async function testUpload() {
    // 1. Create a dummy test image
    const dummyImagePath = path.join(__dirname, 'dummy.txt');
    fs.writeFileSync(dummyImagePath, 'This is a test file to simulate an image upload.');

    const formData = new FormData();
    const fileData = new File([fs.readFileSync(dummyImagePath)], 'dummy.txt', { type: 'text/plain' });
    formData.append('file', fileData);

    try {
        console.log('Sending upload request locally...');
        // We have to use the local dev server so we don't start it again
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log("Upload Result:", result);

    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        fs.unlinkSync(dummyImagePath);
    }
}

testUpload();
