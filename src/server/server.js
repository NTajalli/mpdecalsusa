require('dotenv').config();
require('ignore-styles');
const renderFormSummary = require('./renderFormSummary');
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const FormData = require('form-data');
const Mailgun = require('mailgun.js');
const MemoryStore = require('session-memory-store')(session);
const AWS = require('aws-sdk');
const archiver = require('archiver');
const axios = require('axios');

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
 });
 
const s3 = new AWS.S3();
const app = express();
const PORT = 3000;

function generateHTML(formData) {
    // Start with basic structure
    let html = `
        <html>
            <body>
                <h2>Form Submission</h2>
    `;

    // Add form text data
    for (let key in formData) {
        if (key !== "referenceFiles") {
            html += `<p><strong>${key}:</strong> ${formData[key]}</p>`;
        }
    }

    // Add images (You can adjust this if the structure of formData changes)
    formData.referenceFiles.forEach(file => {
        html += `<img src="${file.s3Url}"/>`; // Use the S3 URL of the uploaded image
    });

    // Close tags
    html += `
            </body>
        </html>
    `;

    return html;
}


async function uploadToS3(content, fileName, contentType) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME || 'mpdecalsusaformstorage', 
        Key: fileName,
        Body: content,
        ContentType: contentType
        // Removed ACL - using bucket policy instead
    };

    await s3.putObject(params).promise();
    const region = process.env.S3_REGION || 'us-east-1';
    return `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../views'));

// Middleware for serving static files
app.use(express.static(path.join(__dirname, '../../public')));
app.use('/css', express.static(path.join(__dirname, '../../public/css')));
app.use('/js', express.static(path.join(__dirname, '../../public/js')));
app.use('/images', express.static(path.join(__dirname, '../../public/images')));
app.use('/videos', express.static(path.join(__dirname, '../../public/videos')));

// Debug middleware
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});

// Middleware for parsing incoming payloads
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Session setup

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore(),
    cookie: {
        maxAge: 3600000 // 1 hour
    }
}));

// Routes
app.get('/', (req, res) => {
    res.render('layout', { body: 'home' });
});

app.get('/form', (req, res) => {
    res.render('layout', { body: 'form' });
});

const media = [
    { path: 'videos/Video.mp4', title: 'Video 1', description: 'Some description about the Video.', type: 'video' },
    { path: 'videos/Video_1.mp4', title: 'Video 2', description: 'Another description.', type: 'video' },
    { path: 'videos/Video_2.mp4', title: 'Video 3', description: 'Some description about the Video.', type: 'video' },
    { path: 'images/image0.jpeg', title: 'Image 1', description: 'Some description about the image.', type: 'image' },
    { path: 'images/image1.jpeg', title: 'Image 2', description: 'Another description.', type: 'image' },
    { path: 'images/image2.jpeg', title: 'Image 3', description: 'Some description about the image.', type: 'image' },
    { path: 'images/gallery1.jpg', title: 'Image 1', description: 'Some description about the image.', type: 'image' },
    { path: 'images/gallery2.jpg', title: 'Image 2', description: 'Another description.', type: 'image' },
    { path: 'images/gallery3.jpg', title: 'Image 3', description: 'Some description about the image.', type: 'image' },
    { path: 'images/image3.jpeg', title: 'Image 3', description: 'Some description about the image.', type: 'image' },
    { path: 'images/image4.jpeg', title: 'Image 4', description: 'Another description.', type: 'image' },
    { path: 'images/image5.jpeg', title: 'Image 5', description: 'Some description about the image.', type: 'image' },
    { path: 'images/gallery4.jpg', title: 'Image 4', description: 'Another description.', type: 'image' },
    { path: 'images/gallery5.jpg', title: 'Image 5', description: 'Some description about the image.', type: 'image' },
    { path: 'images/image6.jpeg', title: 'Image 3', description: 'Some description about the image.', type: 'image' },
    { path: 'images/image7.jpeg', title: 'Image 4', description: 'Another description.', type: 'image' },
    { path: 'images/image8.jpeg', title: 'Image 5', description: 'Some description about the image.', type: 'image' },
    { path: 'images/gallery6.jpg', title: 'Image 6', description: 'Another description.', type: 'image' },
    { path: 'images/gallery7.jpg', title: 'Image 7', description: 'Some description about the image.', type: 'image'},
    { path: 'images/gallery8.jpg', title: 'Image 8', description: 'Another description.', type: 'image' },
    { path: 'images/image9.jpeg', title: 'Image 3', description: 'Some description about the image.', type: 'image' },
    { path: 'images/image10.jpeg', title: 'Image 4', description: 'Another description.', type: 'image' },
    { path: 'images/image11.jpeg', title: 'Image 5', description: 'Some description about the image.', type: 'image' },
    { path: 'images/gallery9.jpg', title: 'Image 9', description: 'Some description about the image.', type: 'image' },
    { path: 'images/gallery10.jpg', title: 'Image 10', description: 'Another description.', type: 'image' },
    { path: 'images/gallery11.jpg', title: 'Image 11', description: 'Some description about the image.', type: 'image' }
];

app.get('/gallery', (req, res) => {
    res.render('layout', { body: 'gallery', media: media });
});

app.get('/contact', (req, res) => {
    res.render('layout', { body: 'contact', query: req.query });
});

// Debug endpoint
app.get('/debug/files', (req, res) => {
    const fs = require('fs');
    const publicPath = path.join(__dirname, '../../public');
    const cssPath = path.join(__dirname, '../../public/css');
    
    try {
        const publicFiles = fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : 'public dir not found';
        const cssFiles = fs.existsSync(cssPath) ? fs.readdirSync(cssPath) : 'css dir not found';
        
        res.json({
            serverPath: __dirname,
            publicPath,
            cssPath,
            publicFiles,
            cssFiles,
            cwd: process.cwd()
        });
    } catch (error) {
        res.json({ error: error.message });
    }
});

app.get('/get-form-data', (req, res) => {
    try {
        db.collection('tempFormData').findOne({ sessionId: req.sessionID }, (err, doc) => {
            if (err) {
                throw err;
            }
            res.json(doc ? doc.data : {});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch form data" });
    }
});

  
app.post('/save-form-data', (req, res) => {
    try {
        const formData = {
            sessionId: req.sessionID,
            data: req.body,
            createdAt: new Date()
        };
        res.sendStatus(200);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to save form data" });
    }
});

// Removed catch-all CSS route to let static middleware handle CSS files





// Mailgun Setup
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || process.env.API_KEY
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
});

app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: process.env.FROM_EMAIL,
            to: [process.env.TO_EMAIL],
            subject: `New Contact Message from ${name}`,
            html: `
                <h1 style="color: #004aad;">Contact Form Submission</h1>
                <p style="font-size: 16px;"><strong>${name}</strong> has sent a message through the contact form on the MpDecals USA website.</p>
                <h2 style="color: #004aad;">Message Details:</h2>
                <div style="background-color: #f2f2f2; padding: 15px; border-left: 4px solid #e84c3d; margin-bottom: 20px;">
                    <p style="font-size: 16px;"><strong>Message:</strong></p>
                    <p style="font-size: 16px; white-space: pre-line;">${message}</p>
                </div>
                <p style="font-size: 16px;"><strong>Contact Email:</strong> <a href="mailto:${email}" style="color: #e84c3d;">${email}</a></p>
                <h2 style="color: #004aad;">Next Steps:</h2>
                <ol style="font-size: 16px;">
                    <li>Review the message and assess the nature of the inquiry.</li>
                    <li>Respond to <strong>${name}</strong> at <a href="mailto:${email}" style="color: #e84c3d;">${email}</a> to provide the necessary information or assistance.</li>
                </ol>
                <p style="font-size: 16px;">Please ensure a prompt and courteous response to maintain our high standards of customer service.</p>
                `
        });

        console.log('Email sent successfully:', data);
        res.redirect('/contact?success=true');
    } catch (error) {
        console.error('Error sending email:', error);
        res.redirect('/contact?success=false');
    }
});

let recentFiles = [];

app.post('/send-email', async (req, res) => {
    try {
        const formData = req.body;
            
        // 1. Upload each image in referenceFiles to S3
        for (const file of formData.referenceImages) {
            const buffer = Buffer.from(file.dataURL.split(',')[1], 'base64'); // Convert data URL to buffer
            const fileKey = `images/${Date.now()}-${file.name}`;
            const s3Url = await uploadToS3(buffer, fileKey, file.type);
            file.s3Url = s3Url; // Add the S3 URL to the file object
        }

        const file = formData.logo;
        const buffer = Buffer.from(file.dataURL.split(',')[1], 'base64'); // Convert data URL to buffer
        const fileKey = `images/${Date.now()}-${file.name}`;
        const s3Url = await uploadToS3(buffer, fileKey, file.type);
        file.s3Url = s3Url;

        // 2. Generate the HTML content with updated formData
        const htmlContent = renderFormSummary(formData, formData.price);

        // 3. Upload the generated HTML content to S3
        const htmlKey = `form-submissions/${Date.now()}.html`;
        const htmlS3Url = await uploadToS3(htmlContent, htmlKey, 'text/html');

        // 4. Send an email with the S3 link to the HTML content
        await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: process.env.FROM_EMAIL,
            to: [process.env.TO_EMAIL],
            subject: 'New Custom Graphics Design Request Received',
            html: `
                <h1 style="color: #004aad;">New Design Request Notification</h1>
                <p style="font-size: 16px;">Hello Team,</p>
                <p style="font-size: 16px;">We have received a new custom graphics design request via our website. Please review the details at your earliest convenience to initiate the design process.</p>
                <h2 style="color: #004aad;">Request Details:</h2>
                <p style="font-size: 16px;">To view the complete submission details, please click on the link below. This will take you to the form submission stored in our AWS S3 bucket.</p>
                <p style="font-size: 16px;"><strong>Submission Link:</strong> <a href="${htmlS3Url}" style="color: #e84c3d;">View Submission</a></p>
                <h2 style="color: #004aad;">Next Steps:</h2>
                <ol style="font-size: 16px;">
                    <li>Review the submission details.</li>
                    <li>Contact the customer for any additional information or clarification if needed.</li>
                    <li>Prepare a preliminary design mockup based on the request.</li>
                </ol>
                `
        });

        console.log("Form email sent successfully");

        const msg2 = {
            from: process.env.FROM_EMAIL,
            to: [formData.email],
            subject: "We've Received Your Design Request - MpDecals USA",
            html: `
                <p>Dear ${formData.name},</p>
                <p>Thank you for reaching out to MpDecals USA with your custom bike graphics design request! We're excited to inform you that we've successfully received your submission and are eager to dive into the details.</p>
                <p><strong>What Happens Next?</strong><br>
                1. <strong>Review Process</strong>: Our team will carefully review the details you've shared to fully understand your vision.<br>
                2. <strong>Personalized Follow-Up</strong>: Within the next few days, we will reach out to you via email. We'll discuss your design in more detail, offer suggestions, and gather any additional information we might need.<br>
                3. <strong>Preliminary Quote & Timeline</strong>: After our initial discussion, we will provide you with a preliminary quote and an estimated timeline for your custom graphics.</p>
                <p>Need to Add More Details? If you wish to add more information to your design request or have any immediate questions, feel free to reach out to us at <a href='mailto:mpdecalsusa@gmail.com'>mpdecalsusa@gmail.com</a>. We’re here to make sure your bike graphics turn out exactly as you envision.</p>
                <p>We appreciate your interest in MpDecals USA and are looking forward to creating something truly unique for your bike. Stay tuned for our follow-up email, and thank you once again for considering us for your custom graphics needs.</p>
                <p>Warm regards,</p>
                <p><strong>The MpDecals USA Team</strong></p>
                <p><a href='https://mpdecalsusa.com'>mpdecalsusa.com</a></p>
                `
        };
        

        // await mg.messages.create(process.env.MAILGUN_DOMAIN, msg2);
        console.log("Customer confirmation email sent successfully");

        res.status(200).send("Emails sent successfully.");
    } catch (err) {
        console.error("Error in processing form submission:", err);
        try {
            await mg.messages.create(process.env.MAILGUN_DOMAIN, {
                from: process.env.FROM_EMAIL,
                to: [process.env.DEV_EMAIL],
                subject: 'Form Submission Error - MpDecals USA',
                html: `
                    <h1>Error in Form Submission</h1>
                    <p>An error occurred during a form submission process.</p>
                    <p>Error Details: ${err.message}</p>
                    `
            });
            console.log("Error notification sent to developer");
        } catch (emailError) {
            console.error("Error sending error notification to developer:", emailError);
        }

        res.status(500).send("Error processing form submission.");    }
});

// Export the app for Vercel
module.exports = app;
