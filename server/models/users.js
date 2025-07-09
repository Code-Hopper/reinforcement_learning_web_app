import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    token: String,
    points: {
        type: Number,
        default: 0
    },
    skills: {
        type: [String],
        default: []
    },
    topics: {
        type: [String],
        default: []
    },
    tagsLearned: {
        type: [String],
        default: []
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const user = mongoose.model("User", userSchema);
export { user };
