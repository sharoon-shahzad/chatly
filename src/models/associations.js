import User from "./user_model.js";
import Message from "./message_model.js";


User.hasMany(Message, { foreignKey: "user_id" });
Message.belongsTo(User, { foreignKey: "user_id" });



