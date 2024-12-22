import Joi from "joi";
import multer from "multer";
import User from "../../Models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class LoginController {
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'storage/avatars/');
        },
        filename: (req, file, cb) => {
            cb(null, crypto.randomBytes(8).toString('hex') + '-' + file.originalname);
        }
    })

    upload = multer({ storage: this.storage }).single('avatar');

    sendEmail = async (email, otpPassword) => {
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: "bosjerukasem@gmail.com",
            to: email,
            subject: "OTP Password",
            text: `Hallo , ini adalah kode verifikasi OTP anda , jangan berikan OTP Password ini kepada pihak lain OTP PASSWORD = ${otpPassword}`
        }

        await transporter.sendMail(mailOptions);
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
                await this.sendEmail(email, otp);

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
                    errorMessage: dbError.message
                })
            }
        })
    }

    async login(req, res){
        res.status(200).json({
            message: "berhasil login"
        });
    }
}
export default new LoginController();