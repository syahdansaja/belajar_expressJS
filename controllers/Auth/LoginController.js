import Joi from "joi";
import User from "../../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
    }
}
export default new LoginController;