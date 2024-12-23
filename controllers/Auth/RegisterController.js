import Joi from "joi";
import multer from "multer";
import User from "../../Models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class RegisterController {
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'storage/avatars/');
        },
        filename: (req, file, cb) => {
            cb(null, crypto.randomBytes(8).toString('hex') + '-' + file.originalname);
        }
    })

    upload = multer({ storage: this.storage }).single('avatar');

    static async sendEmail (email, otpPassword) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            service: 'gmail',
            secure: false,
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: `SYAHDAN DEVELOPER ${process.env.GMAIL_EMAIL}`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP Code is ${otpPassword}. This code will expired in 30 minutes`,
            html: `
              <p>Dear User</p>
              <p>Your OTP Code is:</p>
              <h2 style="color: #2e86de;">${otpPassword}</h2>
              <p>This code will expired in <strong>30 minutes</strong>. Please do not share ths code with anyone.</p>
              <br />
              <p>Regards,</p>
              <p><strong>Syahdan Developer</strong></p>
            `
        }

        transporter.sendMail(mailOptions);
    }

    register = async (req, res) => {
        this.upload(req, res, async (err) => {
            if(err) {
                return res.status(500).json({ error: "File upload failed", details: err.message });
            }
            const schema = Joi.object({
                firstName: Joi.string().min(4).required().messages({
                    'string.empty': 'First name is required',
                    'string.min': 'First name at least 4 characters required',
                    'any.required': 'First name is required'
                }),
                lastName: Joi.string().min(4).messages({
                    'string.min': 'Last name at least 4 characters required'
                }),
                email: Joi.string().email().required().messages({
                    'string.empty': 'Email is required',
                    'string.email': 'must be type of email',
                    'any.required': 'Email is required'
                }),
                password: Joi.string().min(6).required().messages({
                    'string.empty': 'password is required',
                    'string.min': 'password at least 6 characters required',
                    'any.required': 'Password is required'
                }),
                phoneNumber: Joi.string().min(10).messages({
                    'string.min': 'Phone number at least 10 characters required'
                })
            });
            const {error, value} = schema.validate(req.body, {abortEarly: false});
            if (error) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "validation Error , Bad Request",
                    errors: error.details.map((err) => ({
                        field: err.path[0],
                        message: err.message
                    }))
                })
            }
            const {firstName, lastName, email, password, phoneNumber} = value;
            try {
                // check is user exist ?
                const isUserExist = User.findOne({
                    where: {
                        email: email,
                    }
                });

                if (isUserExist.id) {
                    res.status(400).json({
                        statusCode: 400,
                        error: "User already exists",
                        userExist: isUserExist
                    })
                }

                // generate OTP for verification
                const otp = crypto.randomInt(100000, 999999).toString();
                const otpExpiry = new Date(Date.now() + 30 * 60 * 1000);

                const user = await User.create({
                    firstName: firstName,
                    lastName: lastName ? lastName : null,
                    email: email,
                    password: password,
                    phone_number: phoneNumber ? phoneNumber : null,
                    avatar: req.file ? req.file.filename : null,
                    is_deleted: false,
                    otpPassword: otp,
                    otpExpiry: otpExpiry
                });
                // send OTP password via email for register verification
                await RegisterController.sendEmail(email, otp);

                res.status(201).json({
                    statusCode: 201,
                    message: "Register successfully, OTP verification sent to your email",
                    data: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phoneNumber: user.phone_number,
                        avatar: user.avatar
                    }
                });
            } catch (dbError) {
                res.status(500).json({
                    statusCode: 500,
                    error: "database error",
                    errorMessage: dbError.message,
                    dataSent: {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                        phoneNumber: phoneNumber
                    }
                })
            }
        })
    }

    // OTP Verification
    async OTPVerification(req, res) {
        const schemaValidator = Joi.object({
            OTP_Password: Joi.string().length(6).required().messages({
                'string.empty': 'OTP Password is required',
                'string.length': 'OTP Password is 6 digit length',
                'any.required': 'OTP Password is required'
            })
        })

        const {error , value} = schemaValidator.validate(req.body, {abortEarly: false});
        if(error) {
            return res.status(400).json({
                statusCode: 400,
                message: "validation Error , Bad Request",
                errors: error.details.map((err) => ({
                    field: err.path[0],
                    message: err.message
                }))
            });
        }

        const {OTP_Password} = value;
        const userData = await User.findOne({
            where: {
                otpPassword: OTP_Password
            }
        });
        // check user data is found or not
        if (!userData) {
            return res.status(404).json({
                statusCode: 404,
                message: "User data not found"
            })
        }
        // check , is OTP Password expired ?
        const dateNow = new Date(Date.now());
        if (dateNow > userData.otpExpiry) {
            return res.status(403).json({
                statusCode: 403,
                message: "OTP verification password is expored, request Forbidden",
                dateCompare: dateNow > userData.otpExpiry
            });
        }

        // update data user , set "otpVerifiedAt" attribute
        await userData.update({
            otpVerifiedAt: dateNow
        });

        await userData.save();

        return res.status(200).json({
            statusCode: 200,
            message: "succesfully verification"
        });
    }
}
export default new RegisterController;

const sendEmailFunction = RegisterController.sendEmail;
export { sendEmailFunction };