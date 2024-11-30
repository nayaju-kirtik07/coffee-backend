const User = require("../models/user");
const Session = require("../models/session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Access_token = process.env.AccessToken;
const Refresh_token = process.env.RefreshToken;

exports.singUp = async (req, res) => {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).send("User already exists with this email");
      }
  
      let userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
      };
  
      // Handle password differently for Google signup
      if (req.body.isGoogleSignup) {
        // For Google users, set a random secure password
        const randomPassword = Math.random().toString(36).slice(-8);
        userData.hashPassword = bcrypt.hashSync(randomPassword, 10);
        userData.c_hashPassword = userData.hashPassword;
      } else {
        // For regular signup
        if (req.body.password !== req.body.c_password) {
          return res.status(400).send("Password and Confirm password must be same");
        }
        userData.hashPassword = bcrypt.hashSync(req.body.password, 10);
        userData.c_hashPassword = bcrypt.hashSync(req.body.c_password, 10);
      }
  
      const user = await new User(userData).save();
  
      if (!user) {
        return res.status(400).send("Invalid Inputs");
      }
  
      res.status(201).send(user);
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({
        error: err.message
      });
    }
  };

  exports.login = async (req, res) => {
    try {
        const refresh_token_expiration = "1d";
        const access_token_expiration = "30d";

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).send("User Not Found. Please sign up first.");
        }

        // Regular email/password login
        if (user && bcrypt.compareSync(req.body.password, user.hashPassword)) {
            const access_token = jwt.sign(
                {
                    userId: user.id,
                },
                Access_token,
                {
                    expiresIn: access_token_expiration,
                }
            );

            const refreshToken = jwt.sign(
                {
                    user: user.id,
                },
                Refresh_token,
                {
                    expiresIn: refresh_token_expiration,
                }
            );

            // Create new session
            const session = await new Session({
                userId: user.id,
                email: user.email,
                Access_Token: access_token,
                Refresh_Token: refreshToken,
                ExpiresIn: refresh_token_expiration,
            }).save();

            if (!session) {
                return res.status(500).json({
                    error: "Failed to create session",
                    success: false,
                });
            }

            // Send response
            res.status(201).json({
                userId: user.id,
                user: user.username,
                refresh_token: refreshToken,
                access_token: access_token,
                ExpiresIn: refresh_token_expiration,
                profileImage: user?.profileImage,
                success: true
            });
        } else {
            res.status(400).json({
                error: "Invalid credentials",
                success: false
            });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            error: err.message,
            success: false,
        });
    }
};
