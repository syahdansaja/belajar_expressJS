import { Op } from "sequelize";
import cron from "node-cron";
import User from "../Models/User.js";

// delete user data that not verificated
async function deleteUserDataScheduled () {
    try {
        await User.destroy({
            where: {
                otpExpiry: {
                    [Op.lt]: new Date(Date.now())
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

const scheduled = cron.schedule('* * 1 * *', () => {
    deleteUserDataScheduled();
});

export default scheduled;
export { deleteUserDataScheduled };