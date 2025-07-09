const React = require('react');
const ReactDOMServer = require('react-dom/server');
const FormSummary = require('../react-components/components/FormSummary');

function renderFormSummary(data, price) {
    const componentContent = ReactDOMServer.renderToStaticMarkup(React.createElement(FormSummary, { data, price }));
    
    // Embed S3 URLs into a hidden div
    const s3UrlsDiv = data.referenceImages.map(file => `<div class="s3-url" data-type="referenceImage">${file.s3Url}</div>`)
    .concat(`<div class="s3-url" data-type="logo">${data.logo.s3Url}</div>`)
    .join('');

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Custom Graphics Design Request - ${data.name || 'Customer'}</title>
                <!-- Include JSZip library -->
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js"></script>
                <style>
                    .form-summary {
                        padding: 30px;
                        border-radius: 10px;
                        max-width: 100%;
                        margin: 20px auto;
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    } 

                    .form-summary table {
                        width: 100%;
                        border-collapse: collapse;
                        border-spacing: 0;
                    }

                    .form-summary th, .form-summary td {
                        border: 1px solid #555;
                        padding: 15px;
                        vertical-align: top;
                    }

                    .form-summary th {
                        color: #ff4444;
                        background: linear-gradient(135deg, #111 0%, #222 100%);
                        font-weight: 900;
                        text-transform: uppercase;
                        font-size: 14px;
                        letter-spacing: 1px;
                    }

                    .form-summary td:first-child {
                        color: #4a9eff;
                        font-weight: bold;
                        background: linear-gradient(135deg, #2a2a2a 0%, #333 100%);
                        width: 25%;
                    }

                    .form-summary td:not(:first-child) {
                        color: #e0e0e0;
                        font-weight: 500;
                        background: linear-gradient(135deg, #333 0%, #3a3a3a 100%);
                    }

                    /* Image Gallery Styles */
                    .image-gallery {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }

                    .image-item {
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 8px;
                        padding: 15px;
                        border: 1px solid #555;
                    }

                    .image-name {
                        color: #4a9eff;
                        font-weight: bold;
                        margin-bottom: 10px;
                        font-size: 14px;
                    }

                    .image-container {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }

                    .uploaded-image {
                        max-width: 200px;
                        max-height: 150px;
                        width: auto;
                        height: auto;
                        border-radius: 8px;
                        border: 2px solid #555;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        transition: transform 0.3s ease;
                    }

                    .uploaded-image:hover {
                        transform: scale(1.05);
                        border-color: #4a9eff;
                    }

                    .image-link {
                        color: #ff6b6b;
                        text-decoration: none;
                        font-size: 12px;
                        padding: 5px 10px;
                        background: rgba(255, 107, 107, 0.1);
                        border: 1px solid #ff6b6b;
                        border-radius: 4px;
                        transition: all 0.3s ease;
                    }

                    .image-link:hover {
                        background: rgba(255, 107, 107, 0.2);
                        transform: translateY(-1px);
                    }

                    .dashed-list {
                        text-indent: -1em;
                        padding-left: 1.5em;
                        display: block;
                    }

                    .dashed-list::before {
                        content: "-";
                        margin-right: 0.5em;
                    }

                    td.step-divider:first-child {
                        background: linear-gradient(135deg, #ff4444 0%, #ff6666 100%);
                        text-align: center;
                        font-weight: bold;
                        color: white;
                        padding: 15px 0;
                        border-top: 3px solid #ff4444;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        font-size: 16px;
                    }

                    /* Header Styles */
                    .report-header {
                        background: linear-gradient(135deg, #0f4c75 0%, #3282b8 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                        margin-bottom: 0;
                    }

                    .company-logo {
                        font-size: 32px;
                        font-weight: 900;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                        letter-spacing: 3px;
                    }

                    .report-title {
                        font-size: 24px;
                        margin-bottom: 10px;
                        color: #e0e0e0;
                    }

                    .report-subtitle {
                        font-size: 16px;
                        color: #b0b0b0;
                        margin-bottom: 20px;
                    }

                    .report-date {
                        font-size: 14px;
                        color: #90caf9;
                        background: rgba(255, 255, 255, 0.1);
                        padding: 8px 16px;
                        border-radius: 20px;
                        display: inline-block;
                    }

                    /* Download Button Styles */
                    #downloadButton {
                        background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        margin: 20px 0;
                        transition: all 0.3s ease;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }

                    #downloadButton:hover {
                        background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%);
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
                    }

                    h1.step-title {
                        display: none;
                    }

                    body {
                        background: linear-gradient(135deg, #0d1421 0%, #1a1a2e 100%);
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 0;
                        padding: 20px;
                        min-height: 100vh;
                    }

                    /* Responsive Design */
                    @media (max-width: 768px) {
                        .form-summary {
                            padding: 20px;
                            margin: 10px;
                        }
                        
                        .uploaded-image {
                            max-width: 150px;
                            max-height: 100px;
                        }
                        
                        .company-logo {
                            font-size: 24px;
                        }
                        
                        .report-title {
                            font-size: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <!-- Professional Header -->
                <div class="report-header">
                    <div class="company-logo">MpDecals USA</div>
                    <div class="report-title">Custom Graphics Design Request</div>
                    <div class="report-subtitle">Customer: ${data.name || 'N/A'} | Email: ${data.email || 'N/A'}</div>
                    <div class="report-date">Generated on ${currentDate}</div>
                </div>

                ${componentContent}
                
                <!-- Hidden div to store S3 URLs -->
                <div style="display:none;" id="s3Urls">${s3UrlsDiv}</div>

                <!-- Download Button -->
                <button id="downloadButton">📥 Download All Uploaded Files</button>

                <script>
                document.getElementById('downloadButton').addEventListener('click', async function() {
                    const urls = Array.from(document.querySelectorAll('.s3-url')).map(div => ({
                        url: div.textContent,
                        type: div.getAttribute('data-type')
                    }));
                    console.log(urls);
                
                    // Create a new JSZip instance
                    const zip = new JSZip();
                
                    // Fetch each file and add to zip
                    for (let { url, type } of urls) {
                        try {
                            const response = await fetch(url);
                            const blob = await response.blob();
                
                            // Determine directory based on type
                            let directory = "";
                            if (type === 'referenceImage') {
                                directory = "referenceImages/";
                            } else if (type === 'logo') {
                                directory = "logos/";
                            }
                
                            zip.file(directory + url.split('/').pop(), blob);
                        } catch (error) {
                            console.error(\`Error fetching \${url}:\`, error);
                        }
                    }
                
                    // Generate zip and trigger download
                    try {
                        const content = await zip.generateAsync({ type: "blob" });
                        const url = window.URL.createObjectURL(content);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'files.zip';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    } catch (error) {
                        console.error("Error generating zip:", error);
                    }
                });
                </script>
            </body>
        </html>
    `;
}

module.exports = renderFormSummary;
