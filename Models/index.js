import User from "./User.js";
import OTPRefresh from "./OTPRefresh.js";

const defineAssociations = async () => {
  console.log("Defining Associations");
  User.hasMany(OTPRefresh, {
    foreignKey: {
      name: "userId"
    }
  });
  OTPRefresh.belongsTo(User, {
    foreignKey: {
      name: "userId"
    }
  });
}
export {defineAssociations};