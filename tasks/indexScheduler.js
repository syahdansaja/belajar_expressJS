import deleteUserDataScheduled from "./deleteUserData.js";
import cron from "node-cron";

const scheduler = cron.schedule('* * 1 * *', async () => {
    await deleteUserDataScheduled();
})

export default scheduler;