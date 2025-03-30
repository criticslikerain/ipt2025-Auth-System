const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Database initialization function
async function initializeDatabase() {
    try {
        // Create connection for database initialization
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ipt2025_db`);
        
        // Use the database
        await connection.query(`USE ipt2025_db`);

        // Create accounts table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS accounts (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(10),
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'User',
                verified DATETIME,
                verificationToken VARCHAR(255),
                resetToken VARCHAR(255),
                resetTokenExpires DATETIME,
                refreshToken VARCHAR(255),
                refreshTokenExpires DATETIME,
                passwordReset DATETIME,
                created DATETIME NOT NULL,
                updated DATETIME,
                acceptTerms BOOLEAN NOT NULL,
                UNIQUE KEY email_UNIQUE (email)
            )
        `);

        console.log('Database and tables initialized successfully');
        await connection.end();
    } catch (error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
}

// Call initialization before starting the server
initializeDatabase().then(() => {
    // Your existing middleware setup
    app.use(express.json());
    app.use(cors());

    // Add this logging middleware to debug incoming requests
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });

    // Your existing database configuration
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ipt2025_db'
    };

    // Create MySQL pool
    const pool = mysql.createPool(dbConfig);

    // Email configuration
    const nodemailer = require('nodemailer');

    // Create Ethereal SMTP transporter (single configuration)
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'jessica.zulauf35@ethereal.email',
            pass: '8qSEQ5hEvu5DZkcEsw'
        }
    });

    // Single sendEmail function for all email sending needs
    async function sendEmail({ to, subject, html }) {
        try {
            // Send email using Ethereal
            const info = await transporter.sendMail({
                from: '"Auth System" <jessica.zulauf35@ethereal.email>',
                to: to,
                subject: subject,
                html: html
            });

            console.log('Email sent:', info.messageId);
            // Log Ethereal URL where you can preview the email
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            return info;
        } catch (error) {
            console.error('Email sending error:', error);
            throw error;
        }
    }

    // CORS configuration
    app.use(cors({
        origin: 'http://localhost:4200',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Helper Functions
    const generateToken = (length = 32) => {
        return crypto.randomBytes(length).toString('hex');
    };

    // Authentication Routes

    // Login
    app.post('/api/account/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            console.log('Login attempt for email:', email); // Debug log

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const connection = await pool.getConnection();

            try {
                const [users] = await connection.execute(
                    'SELECT * FROM accounts WHERE email = ?',
                    [email]
                );

                console.log('User found:', users.length > 0); // Debug log

                const user = users[0];

                if (!user) {
                    return res.status(401).json({ message: 'Email or password is incorrect' });
                }

                const passwordMatch = await bcrypt.compare(password, user.password);
                console.log('Password match:', passwordMatch); // Debug log

                if (!passwordMatch) {
                    return res.status(401).json({ message: 'Email or password is incorrect' });
                }

                if (!user.verified) {
                    return res.status(401).json({ message: 'Please verify your email before logging in' });
                }

                // Generate tokens
                const jwtToken = jwt.sign(
                    { id: user.id, email: user.email, role: user.role },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '1d' }
                );

                const refreshToken = generateToken();
                const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

                // Save refresh token
                await connection.execute(
                    'UPDATE accounts SET refreshToken = ?, refreshTokenExpires = ? WHERE id = ?',
                    [refreshToken, refreshTokenExpires, user.id]
                );

                // Remove sensitive data
                delete user.password;
                delete user.refreshToken;
                delete user.verificationToken;

                res.json({
                    ...user,
                    jwtToken,
                    refreshToken
                });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Error during login', error: error.message });
        }
    });

    // Register
    app.post('/api/account/register', async (req, res) => {
        try {
            const { title, firstName, lastName, email, password, acceptTerms } = req.body;
            const connection = await pool.getConnection();

            try {
                // Check if email already exists
                const [existingUsers] = await connection.execute(
                    'SELECT * FROM accounts WHERE email = ?',
                    [email]
                );

                if (existingUsers.length) {
                    return res.status(400).json({ message: 'Email already registered' });
                }

                // Generate verification token
                const verificationToken = generateToken();

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Get current timestamp
                const created = new Date().toISOString().slice(0, 19).replace('T', ' ');

                // Insert new user
                const [result] = await connection.execute(
                    `INSERT INTO accounts 
                    (title, firstName, lastName, email, password, role, created, verificationToken, acceptTerms) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        title,
                        firstName,
                        lastName,
                        email,
                        hashedPassword,
                        'User',
                        created,
                        verificationToken,
                        acceptTerms
                    ]
                );

                // Send verification email
                const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:4200'}/account/verify-email?token=${verificationToken}`;
                
                await sendEmail({
                    to: email,
                    subject: 'Please verify your email',
                    html: `
                        <h4>Verify Email</h4>
                        <p>Thanks for registering!</p>
                        <p>Please click the below link to verify your email address:</p>
                        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                    `
                });

                // Return success response
                res.json({
                    message: 'Registration successful, please check your email for verification instructions',
                    userId: result.insertId
                });

            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Error registering user' });
        }
    });

    // Verify Email
    app.post('/api/account/verify-email', async (req, res) => {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ message: 'Verification token is required' });
            }

            const connection = await pool.getConnection();

            try {
                const [users] = await connection.execute(
                    'SELECT * FROM accounts WHERE verificationToken = ?',
                    [token]
                );

                const user = users[0];

                if (!user) {
                    return res.status(400).json({ message: 'Invalid verification token' });
                }

                // Update user verification status
                await connection.execute(
                    'UPDATE accounts SET verified = NOW(), verificationToken = NULL WHERE id = ?',
                    [user.id]
                );

                res.json({ message: 'Email verification successful' });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Verification error:', error);
            res.status(500).json({ message: 'Error during email verification' });
        }
    });

    // Forgot Password
    app.post('/api/account/forgot-password', async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            const connection = await pool.getConnection();

            try {
                const [users] = await connection.execute(
                    'SELECT * FROM accounts WHERE email = ?',
                    [email]
                );

                const user = users[0];

                if (!user) {
                    // For security reasons, still return success even if email not found
                    return res.json({ message: 'Please check your email for password reset instructions' });
                }

                // Generate reset token
                const resetToken = generateToken();
                const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

                // Save reset token
                await connection.execute(
                    'UPDATE accounts SET resetToken = ?, resetTokenExpires = ? WHERE id = ?',
                    [resetToken, resetTokenExpires, user.id]
                );

                // Create reset URL
                const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:4200'}/account/reset-password?token=${resetToken}`;

                // Log the reset token (for development purposes)
                console.log('Password reset token:', resetToken);
                console.log('Reset URL:', resetUrl);

                // Send reset email (this won't actually send in development)
                await sendEmail({
                    to: email,
                    subject: 'Reset Password',
                    html: `
                        <h4>Reset Password</h4>
                        <p>Please click the below link to reset your password:</p>
                        <p><a href="${resetUrl}">Reset Password</a></p>
                        <p>If you did not request this password reset, please ignore this email.</p>
                    `
                });

                res.json({ message: 'Please check your email for password reset instructions' });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({ message: 'Error processing forgot password request' });
        }
    });

    // Reset Password
    app.post('/api/account/reset-password', async (req, res) => {
        try {
            const { token, password } = req.body;

            if (!token || !password) {
                return res.status(400).json({ message: 'Token and password are required' });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters' });
            }

            const connection = await pool.getConnection();

            try {
                const [users] = await connection.execute(
                    'SELECT * FROM accounts WHERE resetToken = ? AND resetTokenExpires > NOW()',
                    [token]
                );

                const user = users[0];

                if (!user) {
                    return res.status(400).json({ message: 'Invalid or expired reset token' });
                }

                // Update password
                const hashedPassword = await bcrypt.hash(password, 10);
                await connection.execute(
                    'UPDATE accounts SET password = ?, resetToken = NULL, resetTokenExpires = NULL, passwordReset = NOW() WHERE id = ?',
                    [hashedPassword, user.id]
                );

                res.json({ message: 'Password reset successful' });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({ message: 'Error resetting password' });
        }
    });

    // Validate Reset Token
    app.post('/api/account/validate-reset-token', async (req, res) => {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ message: 'Token is required' });
            }

            const connection = await pool.getConnection();

            try {
                const [users] = await connection.execute(
                    'SELECT * FROM accounts WHERE resetToken = ? AND resetTokenExpires > NOW()',
                    [token]
                );

                if (!users.length) {
                    return res.status(400).json({ message: 'Invalid or expired token' });
                }

                res.json({ message: 'Token is valid' });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Validate token error:', error);
            res.status(500).json({ message: 'Error validating token' });
        }
    });

    // Refresh Token
    app.post('/api/account/refresh-token', async (req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({ message: 'Refresh token is required' });
            }

            const connection = await pool.getConnection();

            try {
                const [users] = await connection.execute(
                    'SELECT * FROM accounts WHERE refreshToken = ? AND refreshTokenExpires > NOW()',
                    [refreshToken]
                );

                const user = users[0];

                if (!user) {
                    return res.status(401).json({ message: 'Invalid or expired refresh token' });
                }

                // Generate new tokens
                const newJwtToken = jwt.sign(
                    { id: user.id, email: user.email, role: user.role },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '1d' }
                );

                const newRefreshToken = generateToken();
                const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                // Save new refresh token
                await connection.execute(
                    'UPDATE accounts SET refreshToken = ?, refreshTokenExpires = ? WHERE id = ?',
                    [newRefreshToken, refreshTokenExpires, user.id]
                );

                res.json({
                    jwtToken: newJwtToken,
                    refreshToken: newRefreshToken
                });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Refresh token error:', error);
            res.status(500).json({ message: 'Error refreshing token' });
        }
    });

    // Protected Routes (require authentication)

    // Get Profile
    app.get('/api/account/profile', authenticateToken, async (req, res) => {
        try {
            const connection = await pool.getConnection();

            try {
                const [users] = await connection.execute(
                    'SELECT id, title, firstName, lastName, email, role, created, updated FROM accounts WHERE id = ?',
                    [req.user.id]
                );

                const user = users[0];

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                res.json(user);
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Error retrieving profile' });
        }
    });

    // Update Profile
    app.put('/api/account/profile', authenticateToken, async (req, res) => {
        try {
            const { title, firstName, lastName, email } = req.body;
            const userId = req.user.id;

            const connection = await pool.getConnection();

            try {
                // Check if email is already taken
                if (email) {
                    const [existingUsers] = await connection.execute(
                        'SELECT * FROM accounts WHERE email = ? AND id != ?',
                        [email, userId]
                    );

                    if (existingUsers.length) {
                        return res.status(400).json({ message: 'Email is already taken' });
                    }
                }

                // Update profile
                await connection.execute(
                    `UPDATE accounts 
                    SET title = COALESCE(?, title),
                        firstName = COALESCE(?, firstName),
                        lastName = COALESCE(?, lastName),
                        email = COALESCE(?, email),
                        updated = NOW()
                    WHERE id = ?`,
                    [title, firstName, lastName, email, userId]
                );

                // Get updated user data
                const [users] = await connection.execute(
                    'SELECT id, title, firstName, lastName, email, role FROM accounts WHERE id = ?',
                    [userId]
                );

                res.json(users[0]);
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Error updating profile' });
        }
    });

    // Change Password
    app.post('/api/account/change-password', authenticateToken, async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Old and new passwords are required' });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters' });
            }

            const connection = await pool.getConnection();

            try {
                const [users] = await connection.execute(
                    'SELECT * FROM accounts WHERE id = ?',
                    [req.user.id]
                );

                const user = users[0];

                if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
                    return res.status(400).json({ message: 'Old password is incorrect' });
                }

                // Update password
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await connection.execute(
                    'UPDATE accounts SET password = ?, updated = NOW() WHERE id = ?',
                    [hashedPassword, req.user.id]
                );

                res.json({ message: 'Password changed successfully' });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ message: 'Error changing password' });
        }
    });

    // Get user by ID
    app.get('/api/account/:id', authenticateToken, async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
            
            if (user.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Remove sensitive data before sending
            const { password, ...userWithoutPassword } = user[0];
            res.json(userWithoutPassword);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Helper middleware to authenticate JWT
    function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api`);
    });
});




















