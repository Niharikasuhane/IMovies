const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      min: 3,
      max: 20,
      unique: true,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      minlength: 6,
      select: false,
    },
    phone: { type: String, trim: true },
    city: { type: String, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.name && this.username) {
    this.name = this.username;
  }
  if (!this.username && this.name) {
    this.username = this.name.toLowerCase().replace(/\s+/g, "_").slice(0, 20);
  }
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", userSchema);
