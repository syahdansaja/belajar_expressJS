import Joi from "joi";
import User from "../../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import OTPRefresh from "../../Models/OTPRefresh.js";
import {sendEmail} from "../../providers/sendEmail.js";
import crypto from "crypto";



dotenv.config();


class LoginController {
    login = async (req, res) => {
        const schema = Joi.object({
            email: Joi.string().email().required().messages({
                'string.empty': "Email is required",
                'string.email': "Must be a valid email address",
                'any.required': "Email is required",
            }),
            password: Joi.string().min(6).required().messages({
                'string.empty': "Password is required",
                'string.min': "Password at least minimum 6 characters",
                'any.required': "Password is required",
            })
        });
        const {error} = schema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).send({
                statusCode: 400,
                message: "bad request, validation error",
                errors: error.details.map((err) => ({
                    field: err.path[0],
                    message: err.message
                }))
            })
        }


        // find user data , is exist or not
        const userData = await User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (!userData) {
            return res.status(404).json({
                statusCode: 404,
                message: "User not found",
            })
        }

        // does the user has carried out 2 factor verification or not
        if (!userData.otpVerifiedAt){
            return res.status(403).json({
                statusCode: 403,
                message: "Forbidden , the user not yet carried out 2 factor verification"
            })
        }

        // verify password
        const isPasswordValid = await bcrypt.compare(req.body.password, userData.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                statusCode: 403,
                message: "Password is incorrect",
            })
        }

        const token = jwt.sign({
            email: userData.email,
            name: userData.firstName + userData.lastName
        }, process.env.JWT_ACCESS_KEY, {
            expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION),
        });

        const refreshToken = jwt.sign({
            email: userData.email,
            name: userData.firstName + userData.lastName,
        }, process.env.JWT_REFRESH_KEY, {
            expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION)
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            statusCode: 200,
            message: "Successfully sign in",
            userData: {
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
            },
            token: token
        });
    }

    generateOTPPassword = async (user) => { // generating OTP Password for re-authenticating , because the refresh token is expired
        try {
            const OTPPassword = crypto.randomInt(100000, 999999).toString();

            const userData = await User.findOne({
                where: {
                    email: user.email
                }
            });

            if (!userData) {
                return false;
            }

            const generateNewOTP = await OTPRefresh.create({
                userId: userData.id,
                OTPPassword: OTPPassword,
                expiredAt: new Date(Date.now() + 30 * 60 * 1000),
            });

            if (!generateNewOTP) {
                return false;
            }

            const mailOptions = {
                from: `SYAHDAN DEVELOPER ${process.env.GMAIL_EMAIL}`,
                to: userData.email,
                subject: "Your OTP Code",
                text: `Your OTP Code is ${generateNewOTP.OTPPassword}. This code will expired in 30 minutes`,
                html: `
                <p>Dear User</p>
                <p>this OTP Password is for re-authentication because refresh token is expired</p>
                <p>Your OTP Code is:</p>
                <h2 style="color: #2e86de;">${generateNewOTP.OTPPassword}</h2>
                <p>This code will expire in <strong>30 minutes</strong>. Please do not share ths code with anyone.</p>
                <br />
                <p>Regards,</p>
                <p><strong>Syahdan Developer</strong></p>
                `
            }
            // check , is sendEmail success or fail
            const response = await sendEmail(mailOptions);
            if (!response){
                console.error("Failed to send OTP email");
                return false;
            }
            return true;
        } catch (error) {
            console.error("An error occurred while generating OTP Password : ", error);
            return false;
        }
    }

    generateNewAccessToken = async (req, res) => {
        const schema = Joi.object({
            refreshToken: Joi.string().required().messages({
                'string.empty': 'refreshToken is required',
                'any.required': 'refreshToken is required',
            })
        });
        const {error, value} = schema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                statusCode: 400,
                message: "bad request, validation error",
                errors: error.details.map((err) => ({
                    field: err.path[0],
                    message: err.message
                }))
            })
        }
        // get request data
        const { refreshToken } = value;

        // verify refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY,async (err, decoded) => {
            // validating if jwt refresh token is invalid
            if (err) {
                if (err.name === "TokenExpiredError") {
                    const sendNewOTPPassword = this.generateOTPPassword(decoded.email); // genrate new OTP password for re-authentication because refresh token expired
                    if (!sendNewOTPPassword) {
                        return res.status(500).json({
                            statusCode: 500,
                            message: "An error occurred while generating OTP Password",
                        })
                    }
                    return res.status(401).json({
                        statusCode: 401,
                        message: "Refresh token is expired, OTP refresh has been sent to your email",
                    })
                } else {
                    return res.status(401).json({
                        statusCode: 401,
                        message: "Access token is invalid"
                    })
                }
            }

            // get current user data by decoded email from jwt payload
            const userData = await User.findOne({
                where: {
                    email: decoded.email
                }
            });

            // validating , is the user exist or not
            if (!userData) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "User data is not found , maybe your token payload is invalid",
                })
            }

            // generating new Access Token
            const newAccessToken = await jwt.sign({
                email: userData.email,
                name: userData.firstName + userData.lastName,
            }, process.env.JWT_ACCESS_KEY, {
                expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION),
            });

            // return response
            return res.status(200).json({
                statusCode: 200,
                message: "Access token is valid, new access token is generated",
                token: newAccessToken
            })
        })
    }
}
export default new LoginController;