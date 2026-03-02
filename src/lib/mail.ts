import nodemailer from 'nodemailer';

// Use environment variables for production SMTP
// Fallback to a test account/console.log in development if SMTP isn't provided
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.password'
    }
});

/**
 * Sends a welcome email when a user successfully registers
 */
export async function sendWelcomeEmail(toEmail: string, name: string) {
    try {
        const mailOptions = {
            from: '"ItineraryGravity" <noreply@itinerarygravity.com>',
            to: toEmail,
            subject: 'Welcome to ItineraryGravity! 🌍',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h1 style="color: #EC4899;">Welcome, ${name}!</h1>
                    <p>We are thrilled to have you join <strong>ItineraryGravity</strong>!</p>
                    <p>Whether you're looking for your next adventure or sharing your own curated travel guides, you're in the right place.</p>
                    <div style="margin: 30px 0;">
                        <a href="${process.env.NEXTAUTH_URL || 'https://itinerarygravity.com'}/explore" style="background-color: #EC4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explore Itineraries</a>
                    </div>
                    <p>Safe travels,<br>The ItineraryGravity Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent: %s', info.messageId);

        // Return ethereal preview URL if using test account
        if (!process.env.SMTP_HOST) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
}

/**
 * Sends a detailed receipt when a user purchases an itinerary
 */
export async function sendPurchaseReceipt(toEmail: string, name: string, itineraryTitle: string, price: number, currency: string, itineraryUrl: string) {
    try {
        const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';

        const mailOptions = {
            from: '"ItineraryGravity" <noreply@itinerarygravity.com>',
            to: toEmail,
            subject: `Your Receipt for ${itineraryTitle} 📝`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #f9f9f9; padding: 24px; text-align: center; border-bottom: 1px solid #eaeaea;">
                        <h2 style="margin: 0; color: #10b981;">Payment Successful!</h2>
                        <p style="margin-top: 8px; color: #666;">Thank you for your purchase.</p>
                    </div>
                    <div style="padding: 24px;">
                        <p>Hi ${name},</p>
                        <p>Here is your receipt for your recent purchase on ItineraryGravity.</p>
                        
                        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
                            <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 1.1em;">${itineraryTitle}</p>
                            <div style="display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 8px; margin-top: 8px;">
                                <span>Total Paid</span>
                                <span style="font-weight: bold;">${symbol}${price.toFixed(2)}</span>
                            </div>
                        </div>

                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${itineraryUrl}" style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Itinerary</a>
                        </div>
                        
                        <p style="font-size: 0.9em; color: #888; text-align: center; margin-top: 32px;">
                            If you have any questions about this purchase, please contact support@itinerarygravity.com
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Receipt email sent: %s', info.messageId);

        if (!process.env.SMTP_HOST) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        return true;
    } catch (error) {
        console.error('Error sending receipt email:', error);
        return false;
    }
}
