// models/AnswerModel.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    answers: [
        {
            question: String,

            selectedLetter: String,       // e.g., "A"
            selectedOption: String,       // e.g., "A. JavaScript"

            correctLetter: String,        // e.g., "B"
            correctOption: String,        // e.g., "B. Python"

            isCorrect: Boolean            // ✅ Marks whether user's answer was correct
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AnswerModel = mongoose.model("Answer", answerSchema);
export default AnswerModel;
