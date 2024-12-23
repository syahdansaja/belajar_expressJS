import { Op } from "sequelize";
import User from "../Models/User.js";

// delete user data that not verificated
async function deleteUserDataScheduled () {
        await User.destroy({
            where: {
                otpExpiry: {
                    [Op.lt]: new Date(Date.now())
                }
            }
        });
}

export default deleteUserDataScheduled;