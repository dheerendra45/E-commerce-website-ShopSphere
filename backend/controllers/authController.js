import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js';
import JWT from 'jsonwebtoken';

// Register Controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;           

    // Input Validation
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: 'Already registered, please login',
      });
    }

    // Register user
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in registration',
      error,
    });
  }
};

// Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Email not registered',
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: 'Invalid password',
      });
    }

    // Create JWT token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, 
      { expiresIn: '7d' });

    res.status(200).send({
      success: true,
      message: 'Login successfully',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address:user.address,
        role:user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in login',
      error,
    });
  }
};

// Test Controller (for protected routes)
export const testController = (req, res) => {
  console.log('Protected route accessed');
  res.send({ message: 'Protected route accessed' });
};
