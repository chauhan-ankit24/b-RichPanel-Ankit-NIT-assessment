const User = require("../Models/user");
const { isEmail } = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const TOKEN_KEY = process.env.TOKEN_KEY;
const stripe = require('stripe')('sk_test_51Nj5vhSDdCrLIyYKPqI56qiNBOXQHOlnq7aQG7pU8b6LLz3fvxd7h6MB2F26taE1ifaUsv3DEWQCnTRATWzuiwW300k0hwKldq');

const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!password && !email) {
      return res.send({ msg: "invalid input", status: 400 });
    }
    if (typeof password !== "string" && typeof email !== "string") {
      return res.send({ msg: "input must be a string", status: 400 });
    }
    if (password.trim().length == 0 || email.trim().length == 0) {
      return res.send({ msg: "all inputs are required", status: 400 });
    }
    const user = await User.find({ email: email.toLowerCase() });
    if (user.length == 0) {
      return res.send({ status: 400, msg: "user not found" });
    }
    // decrypting the password
    const auth = await bcrypt.compare(password, user[0].password);
    if (!auth) {
      return res.send({ msg: "invalid credientials", status: 400 });
    }
    // sending response
    res.send({ msg: "login succesfully", status: 200, user: user[0] });
  } catch (error) {
    res.send({ msg: "internal server error", status: 500 });
  }
};

const register = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    console.log(name, password, email);
    // checking email validation
    if (!isEmail(email)) {
      return res.send({ msg: "email is invalid", status: 400 });
    }
    // checking for old user
    const oldUser = await User.findOne({ email: email.toLowerCase() });
    if (oldUser) {
      return res.send({ msg: "user already exist", status: 400 });
    }
    // encrypting the password
    const encryptedPassword = await bcrypt.hash(password, 11);
    // creating a new user
    const newuser = await User.create({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword
    });
    // creating a jwt token
    const token = jwt.sign(
      { user_id: newuser._id, email },
      TOKEN_KEY,
      { expiresIn: "10d" }
    );
    newuser.token = token;
    await newuser.save();
    res.send({ msg: "user created", status: 200, user: newuser });
  } catch (error) {
    res.send({ msg: "internal server error", status: 500, error });
  }
};


const userUpdate = async (req, res) => {
  try {
    const { email, ...updatedUser } = req.body;

    const result = await User.findOneAndUpdate(
      { email }, // Find user by email
      { $set: updatedUser }, // Update fields in user
      { new: true } // Return the updated user
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};


const sessionPaymnet = async (req, res) => {
  try {
    const { token } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Your Product Name',
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      payment_method_types: ['card'],

    });
    res.status(200).json({ message: 'success' })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};



module.exports = { login, register, userUpdate, sessionPaymnet }