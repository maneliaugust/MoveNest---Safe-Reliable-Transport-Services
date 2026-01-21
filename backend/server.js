require('dotenv').config();
const express = require('express');
const cors = require('cors');
const EmailService = require('./services/email.service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize email service
const emailService = new EmailService();

// In-memory storage for verification codes (in production, use Redis or database)
const resetCodes = new Map();

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MoveNest Backend API is running' });
});

// Send password reset code
app.post('/api/auth/send-reset-code', async (req, res) => {
    try {
        const { email, userName } = req.body;

        if (!email || !userName) {
            return res.status(400).json({
                success: false,
                message: 'Email and userName are required'
            });
        }

        // Generate 4-digit code
        const code = Math.floor(1000 + Math.random() * 9000).toString();

        // Store code with expiration (10 minutes)
        resetCodes.set(email, {
            code,
            expiresAt: Date.now() + 10 * 60 * 1000
        });

        console.log(`🔐 Generated code ${code} for ${email}`);

        // Send email
        const result = await emailService.sendPasswordResetEmail(email, userName, code);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send email: ' + result.error
            });
        }

        res.json({
            success: true,
            message: 'Verification code sent to your email'
        });

    } catch (error) {
        console.error('❌ Error in send-reset-code:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Verify reset code
app.post('/api/auth/verify-code', (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: 'Email and code are required'
            });
        }

        const storedData = resetCodes.get(email);

        if (!storedData) {
            return res.status(400).json({
                success: false,
                message: 'No reset code found for this email'
            });
        }

        // Check expiration
        if (Date.now() > storedData.expiresAt) {
            resetCodes.delete(email);
            return res.status(400).json({
                success: false,
                message: 'Verification code has expired'
            });
        }

        // Verify code
        if (storedData.code !== code) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
        }

        // Code is valid - don't delete yet, will be deleted after password reset
        res.json({
            success: true,
            message: 'Code verified successfully'
        });

    } catch (error) {
        console.error('❌ Error in verify-code:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Clear reset code (called after successful password reset)
app.post('/api/auth/clear-reset-code', (req, res) => {
    try {
        const { email } = req.body;
        resetCodes.delete(email);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 MoveNest Backend API running on http://localhost:${PORT}`);
    console.log(`📧 Email service: ${process.env.RESEND_API_KEY ? 'Configured' : 'NOT CONFIGURED - Add RESEND_API_KEY to .env'}`);
});
