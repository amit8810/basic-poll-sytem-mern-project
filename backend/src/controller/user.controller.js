import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { fullName, password, email, phoneNumber, role } = req.body;
    if (!fullName || !password || !email || !phoneNumber || !role) {
      return res.status(400).json({
        error: "All fields are required to register the user",
      });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    const user = new User({
      fullName,
      password,
      email,
      phoneNumber,
      role,
    });
    await user.save();

    const createdUser = await User.findById(user._id);

    return res.status(201).json({
      status: 200,
      user: createdUser,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Something went wrong while registering the user", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      return res.status(400).json({
        error: "user with email is not registered",
      });
    }

    const isPasswordValid = await existedUser.isPasswordCorrect(password); // method created in user model
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid user credentials",
      });
    }

    const loggedUser = await User.findById(existedUser._id).select("-password");

    const token = jwt.sign(
      { id: existedUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const options = {
      httpOnly: true,
      secure: false,
    };
    
    return res.status(200).cookie("accessToken", token, options).json({
      status: 200,
      user: loggedUser,
      message: "User logged in successfully",
    });

  } catch (error) {
    console.error("Error while logging user", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getCurrentUser = async (req, res) => {
  const user = req.user;
  return res.status(200).json({
      status: 200,
      user,
      message: "current user fetched successfully"
  })
};

const logoutUser = async (req, res) => {
  try {
      const options = {
          httpOnly: true,
          secure: true,
      };

      // Clear the access token cookie
      res.clearCookie("accessToken", options);

      return res.status(200).json({
          status: 200,
          message: "User logged out successfully."
      });
  } catch (error) {
      console.error("Error while logging out user:", error);
      return res.status(500).json({
          error: "Internal Server Error"
      });
  }
};

const updateDetails = async (req, res) => {
  try {
    const {fullName, email} = req.body;
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(userId, {fullName}, {new: true})

    return res.status(200).json({
      status: 200,
      updatedUser,
      message: "User details updated successfully"
    })


  } catch (error) {
    console.error("Error while updating user details:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

export { registerUser, loginUser, getCurrentUser, logoutUser, updateDetails };
