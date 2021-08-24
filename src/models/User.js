const { Schema, model } = require("mongoose");
const bcryptjs = require("bcryptjs");

const UserSchema = new Schema({
    name: String,
    lastName: String,
    password: String,
    phone: String,
    email: String,
    active: Boolean
}, {
    timestamps: true
});


UserSchema.methods.encrypt = async pass => {
    const salt = await bcryptjs.genSalt(8);
    return await bcrypt.hash(pass, salt);
};

UserSchema.methods.match = async function (pass) {
    return await bcryptjs.compare(pass, this.password)
}

module.exports = model("User", UserSchema);