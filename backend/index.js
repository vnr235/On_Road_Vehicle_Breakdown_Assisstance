const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const validator = require('validator');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');
const twilio = require('twilio');
const { type } = require('os');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 2000;
const http = require('http');
const server = http.createServer(app);
const io = socketIO(server);



const jwtMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send({ message: 'Access Denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MYKEY');
        req.user = decoded; // Attach the decoded user data to the request object
        next();
    } catch (err) {
        res.status(400).send({ message: 'Invalid token' });
    }
};

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

app.use(express.json());
app.use(cors());

const sendMechanicNotification = async (mechanicId, customerName, phoneNumber, serviceType, location) => {
    try {
        // Fetch mechanic and ensure they are available
        const mechanic = await Mechanic.findOne({ _id: mechanicId });

        // Debug the mechanic query result
        console.log('Mechanic found:', mechanic);

        if (!mechanic) {
            console.error('Mechanic not found or is not available');
            return;
        }

        const mechanicPhoneNumber = mechanic.mobile || mechanic.phoneNumber; // Ensure consistent field for phone number

        if (!mechanicPhoneNumber || !/^\+?[0-9]{10,15}$/.test(mechanicPhoneNumber)) {
            console.error('Invalid mechanic phone number:', mechanicPhoneNumber);
            return;
        }

        const formattedPhoneNumber = mechanicPhoneNumber.startsWith('+')
            ? mechanicPhoneNumber
            : `+91${mechanicPhoneNumber}`;

        console.log(`Sending SMS to: ${formattedPhoneNumber}`);
        console.log(`Message: New Service Request: Customer ${customerName}, ${phoneNumber} requires ${serviceType} at ${location}.`);

        await client.messages.create({
            body: `New Service Request: Customer ${customerName}, ${phoneNumber} requires ${serviceType} at ${location}.`,
            to: formattedPhoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        console.log(`Notification sent to ${formattedPhoneNumber}`);
    } catch (error) {
        console.error('Error sending notification:', error);

        if (error.code === 21211) {
            console.error('Invalid phone number format:', error.moreInfo);
        }
    }
};

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: parseInt(process.env.SMTP_PORT), 
    secure: process.env.SMTP_SECURE === 'true', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    },
    tls: {
        rejectUnauthorized: false 
    }
});


// Connection to MongoDB
mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true, // Ensure TLS is enabled, which is often required by Atlas
    serverSelectionTimeoutMS: 5000,
}).then(() => {
    console.log('MongoDB Connected');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Defining Schemas and Models
const serviceRequestSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    serviceType: { type: String, required: true },
    location: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    status: { type: String, default: 'Pending' },
    mechanicId: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

const usersSchema = new mongoose.Schema({
    Name: { type: String, required: true, trim: true, minlength: 2 },
    username: { type: String, required: true, trim: true, unique: true, minlength: 3 },
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: v => /^\d{10}$/.test(v),
            message: 'Mobile number must be 10 digits'
        }
    },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, validate: [validator.isEmail, 'Invalid email'] },
    password: { type: String, required: true },
    userType: { type: String, default: 'Customer' }

});
const users = mongoose.model('users', usersSchema);

const mechanicSchema = new mongoose.Schema({
    Name: { type: String, required: true, trim: true, minlength: 2 },
    username: { type: String, required: true, trim: true, unique: true, minlength: 3 },
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: v => /^\d{10}$/.test(v),
            message: 'Mobile number must be 10 digits'
        }
    },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, validate: [validator.isEmail, 'Invalid email'] },
    password: { type: String, required: true },
    userType: { type: String, default: 'Mechanic' },
    isAvailable: {
        type: Boolean,
        default: false,
    },
    // location:{latitude, longitude}
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
});
const Mechanic = mongoose.model('Mechanic', mechanicSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});


app.post('/service-request', async (req, res) => {
    const { customerName, phoneNumber, serviceType, location, userId } = req.body;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ message: 'Invalid or missing user ID.' });
    }
    
    try {
        const availableMechanic = await Mechanic.findOne({ isAvailable: true });

        if (!availableMechanic) {
            return res.status(404).send({ message: 'No available mechanics at the moment. Please try again later.' });
        }

        const newServiceRequest = new ServiceRequest({
            customerName,
            phoneNumber,
            serviceType,
            location,
            userId: new mongoose.Types.ObjectId(userId),  
            mechanicId: availableMechanic._id
        });

        await newServiceRequest.save();
        console.log('Service request saved:', newServiceRequest);

        // Sending notification to mechanic
        sendMechanicNotification(availableMechanic._id, customerName, phoneNumber, serviceType, location);

        res.status(201).send({ message: 'Service request submitted successfully', mechanic: availableMechanic.Name });
    } catch (err) {
        console.error('Error submitting service request:', err);
        res.status(500).send({ message: `Error submitting service request: ${err.message}` });
    }
});




app.put('/service-request/approve/:id', jwtMiddleware, async (req, res) => {
    const requestId = req.params.id;

    try {
        const serviceRequest = await ServiceRequest.findById(requestId);
        if (!serviceRequest) {
            return res.status(404).send({ message: 'Service request not found' });
        }

        serviceRequest.status = 'Approved';
        await serviceRequest.save();

        const user = await users.findById(serviceRequest.userId); 
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const mechanic = await Mechanic.findById(serviceRequest.mechanicId); 
        if (!mechanic) {
            return res.status(404).send({ message: 'Mechanic not found' });
        }

        // Sending approval email to the user
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Service Request Approved',
            text: `Hello ${serviceRequest.customerName}, your service request has been approved by mechanic ${mechanic.Name}.`
        };

        await transporter.sendMail(mailOptions); 

        res.status(200).send({ message: 'Service request approved successfully', serviceRequest });

    } catch (error) {
        console.error('Error approving service request:', error);
        res.status(500).send({ message: `Error approving service request: ${error.message}` });
    }
});

app.put('/service-request/reject/:id', jwtMiddleware, async (req, res) => {
    const requestId = req.params.id;

    try {
        // Find the service request by ID
        const serviceRequest = await ServiceRequest.findById(requestId);
        if (!serviceRequest) {
            return res.status(404).send({ message: 'Service request not found' });
        }

        serviceRequest.status = 'Rejected';
        await serviceRequest.save();

        const user = await users.findById(serviceRequest.userId); 
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const mechanic = await Mechanic.findById(serviceRequest.mechanicId);
        if (!mechanic) {
            return res.status(404).send({ message: 'Mechanic not found' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Service Request Rejected',
            text: `Hello ${serviceRequest.customerName},we are sorry to say that your service request has been rejected by mechanic ${mechanic.name}.`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Service request rejected successfully', serviceRequest });

    } catch (error) {
        console.error('Error rejecting service request:', error);
        res.status(500).send({ message: `Error rejecting service request: ${error.message}` });
    }
});


app.get('/service-requests/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const serviceRequests = await ServiceRequest.find({ userId: userId });

        if (!serviceRequests) {
            return res.status(404).json({ message: 'No service requests found for this user' });
        }

        res.status(200).json(serviceRequests);
    } catch (error) {
        console.error('Error retrieving service requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/user/:mechanicId', async (req, res) => {
    try {
        const mechanicId = req.params.mechanicId;

        const requests = await ServiceRequest.find({ mechanicId: mechanicId, status:'Pending'});

        if (requests.length === 0) {
            return res.status(404).json({ message: 'No new service requests found for this mechanic.' });
        }

        res.status(200).json({ requests });
    } catch (error) {
        console.error('Error retrieving service requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { username, password, userType } = req.body;

    try {
        const Model = userType === 'Mechanic' ? Mechanic : users;
        const user = await Model.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Wrong password!' });
        }

        const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET || 'MYKEY', { expiresIn: '1h' });
        res.send({ message: 'Login successful', token, userId: user._id });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send({ message: 'Server error' });
    }
});

// Registration
app.post('/register', async (req, res) => {
    const { Name, username, mobile, email, password, userType, latitude, longitude } = req.body;

    try {
        if (!Name || !username || !mobile || !email || !password || !userType) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (userType === 'Mechanic' && (!latitude || !longitude)) {
            return res.status(400).json({ success: false, message: 'Mechanics must provide location data' });
        }
        const existingUser = await (userType === 'Mechanic' ? Mechanic : users).findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email or Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userType === 'Mechanic'
            ? new Mechanic({ Name, username, mobile, email, password: hashedPassword, latitude, longitude })
            : new users({ Name, username, mobile, email, password: hashedPassword });

        await newUser.save();

        res.status(201).json({ success: true, message: `${userType} registered successfully` });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
    }
});

// to update the detail of the user and mechanic 
app.put('/user/update/:id', jwtMiddleware, async (req, res) => {
    const userId = req.params.id;
    const { name, username, phoneNumber, email } = req.body;

    try {
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        user.Numberame = name;
        user.username = username;
        user.mobile = phoneNumber;
        user.email = email;
        await user.save();
        res.status(200).send({ message: 'User details updated successfully', user });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).send({ message: `Error updating user details: ${error.message}` });
    }
});

app.put('/mechanic/update/:id', jwtMiddleware, async (req, res) => {
    const mechanicId = req.params.id; 

    const { name, username, phoneNumber, email, location, latitude, longitude } = req.body;

    try {
        const mechanic = await Mechanic.findById(mechanicId);
        if (!mechanic) {
            return res.status(404).send({ message: 'Mechanic not found' });
        }

        mechanic.Name = name || mechanic.Name;
        mechanic.username = username || mechanic.username;
        mechanic.mobile = phoneNumber || mechanic.mobile;
        mechanic.email = email || mechanic.email;
        mechanic.latitude = latitude || mechanic.latitude;
        mechanic.longitude = longitude || mechanic.longitude;

        await mechanic.save();
        res.status(200).send({ message: 'Mechanic details updated successfully', mechanic });
    } catch (error) {
        if (error.code === 11000) {
            // Handling duplicate key error for unique fields
            res.status(400).send({ message: 'Username or Email already exists' });
        } else {
            console.error('Error updating mechanic details:', error.stack);
            res.status(500).send({ message: `Error updating mechanic details: ${error.message}` });
        }
    }
});



app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    const user = await users.findOne({ email });
    if (!user) {
        return res.status(404).send({ message: 'User with this email does not exist.' });
    }
    const token = crypto.randomBytes(32).toString('hex');

    // Saveing the reset token to the user (you would need to modify your user model to store a reset token and expiry time)
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; 
    await user.save();

    //Sending the email with the reset link
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click this link to reset your password: http://localhost:3000/reset-password/${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send({ message: 'Error sending email' });
        }
        res.send({ message: 'Password reset link sent to your email address' });
    });
});


app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).send({ message: 'Token and new password are required' });
    }

    try {
        const user = await users.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send({ message: 'Password reset token is invalid or has expired' });
        }

        // Hashing the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).send({ message: 'Password has been reset successfully' });
    } catch (err) {
        console.error('Error in reset password route:', err);
        res.status(500).send({ message: 'Server error' });
    }
});


// Fetching mechanic's status
app.get('/mechanic/status', jwtMiddleware, (req, res) => {
    const mechanicId = req.user.id;

    Mechanic.findById(mechanicId)
        .then((mechanic) => {
            if (!mechanic) {
                return res.status(404).send({ message: 'Mechanic not found' });
            }
            res.send({ isAvailable: mechanic.isAvailable });
        })
        .catch((err) => res.status(500).send({ message: 'Server error' }));
});

// Updating mechanic's status
app.put('/mechanic/update-status', jwtMiddleware, (req, res) => {
    const mechanicId = req.user.id;
    const { isAvailable } = req.body; // Ensure `isAvailable` is sent in the request body

    // Check if the field `isAvailable` is present
    if (typeof isAvailable === 'undefined') {
        return res.status(400).send({ message: 'isAvailable is required' });
    }

    Mechanic.findByIdAndUpdate(mechanicId, { isAvailable }, { new: true })
        .then((mechanic) => {
            if (!mechanic) {
                return res.status(404).send({ message: 'Mechanic not found' });
            }
            res.send({ message: 'Status updated successfully', isAvailable: mechanic.isAvailable });
        })
        .catch((err) => res.status(500).send({ message: 'Server error' }));
});


// get user data
app.get('/user-info', jwtMiddleware, (req, res) => {
    const userId = req.user.id;

    users.findById(userId)
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            const userData = {
                _id: user._id,
                name: user.Name,
                username: user.username,
                phoneNumber: user.mobile,
                email: user.email,
            };

            res.send(userData);
        })
        .catch((err) => res.status(500).send({ message: 'Server error' }));
});

app.get('/mechanic/requests', jwtMiddleware, async (req, res) => {
    try {
        const mechanicId = req.mechanic.id;

        // Fetch mechanic's availability status
        const mechanic = await Mechanic.findById(mechanicId);

        if (!mechanic || !mechanic.isAvailable) {
            return res.status(403).json({ message: 'Mechanic is not available to receive requests' });
        }

        // Retrieve service requests for the available mechanic
        const serviceRequests = await ServiceRequest.find({ mechanicId })
            .populate('customerId')  // Populate customer details
            .sort({ createdAt: -1 });

        res.status(200).json({ requests: serviceRequests });

    } catch (err) {
        console.error('Error fetching service requests:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/service-requests/user', jwtMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const serviceRequests = await ServiceRequest.find({ userId: userId });

        if (!serviceRequests.length) {
            return res.status(404).send({ message: 'No service requests found for this user.' });
        }

        res.status(200).send(serviceRequests);
    } catch (err) {
        console.error('Error fetching service requests:', err);
        res.status(500).send({ message: `Error fetching service requests: ${err.message}` });
    }
});



app.get('/mechanic/details', jwtMiddleware, async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.user.id);
        if (!mechanic) {
            return res.status(404).send({ message: 'Mechanic not found' });
        }
        res.send({
            name: mechanic.Name,
            PhoneNumber: mechanic.mobile,
            UserName: mechanic.username,
            mechanicId:mechanic.id,
            Email: mechanic.email,
            isAvailable: mechanic.isAvailable
        });
    } catch (err) {
        res.status(500).send({ message: 'Server error' });
    }
});

app.delete('/delete-profile/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await users.findById(id);
        if (user) {
            await users.findByIdAndDelete(id);
            return res.json({ message: 'User profile deleted successfully' });
        }
        const mechanic = await Mechanic.findById(id);
        if (mechanic) {
            await Mechanic.findByIdAndDelete(id);
            return res.json({ message: 'Mechanic profile deleted successfully' });
        }
        return res.status(404).json({ message: 'Profile not found' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
