import User from "../Models/User.js";
import OTPRefresh from "../Models/OTPRefresh.js";

class UserController {

  async index(req, res) {
    const userData = await User.findOne({
      where: {
        email: req.user.email
      },
      include: OTPRefresh
    });
    return res.json(userData);
  }

}

export default new UserController();
