const fs = require('fs');
const nodemailer = require('nodemailer');

// Manually parse .env.local
const envFilePath = '.env.local';
if (fs.existsSync(envFilePath)) {
    const envFile = fs.readFileSync(envFilePath, 'utf8');
    envFile.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            const key = match[1];
            let value = match[2] || '';
            value = value.replace(/^['"](.*)['"]$/, '$1').trim();
            process.env[key] = value;
        }
    });
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function testEmail() {
    try {
        console.log("Sending test email with following SMTP Config:");
        console.log(`Host: ${process.env.SMTP_HOST}`);
        console.log(`Port: ${process.env.SMTP_PORT}`);
        console.log(`User: ${process.env.SMTP_USER}`);

        const mailOptions = {
            from: '"ItineraryGravity" <noreply@itinerarygravity.com>',
            to: "traveler@example.com",
            subject: 'Your Receipt for Bali 7-Day Adventure 📝',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #f9f9f9; padding: 24px; text-align: center; border-bottom: 1px solid #eaeaea;">
                        <h2 style="margin: 0; color: #10b981;">Payment Successful!</h2>
                        <p style="margin-top: 8px; color: #666;">Thank you for your purchase.</p>
                    </div>
                    <div style="padding: 24px;">
                        <p>Hi Test User,</p>
                        <p>Here is your receipt for your recent purchase on ItineraryGravity.</p>
                        
                        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
                            <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 1.1em;">Bali 7-Day Adventure</p>
                            <div style="display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 8px; margin-top: 8px;">
                                <span>Total Paid</span>
                                <span style="font-weight: bold;">₹2500.00</span>
                            </div>
                        </div>

                        <div style="text-align: center; margin: 32px 0;">
                            <a href="https://itinerarygravity.com" style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Itinerary</a>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Receipt email sent successfully!');
        console.log('Message ID: %s', info.messageId);
        console.log('🔗 Preview URL: %s', nodemailer.getTestMessageUrl(info));
        console.log('\nGo click the Preview URL above to see exactly what the user will receive!');

    } catch (error) {
        console.error('❌ Error sending receipt email:', error);
    }
}

testEmail();
