from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@app.route('/generate', methods=['POST'])
def generate_questions():
    data = request.get_json()
    topic = data.get('query', '')

    if not topic:
        return jsonify({'error': 'No topic provided'}), 400

    try:
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")

        prompt = f"""
Generate 5 multiple choice questions (MCQs) about "{topic}". 
Each question must include 4 options (A-D) and specify the correct answer.

Format:
Q: What is ...
A. Option 1
B. Option 2
C. Option 3
D. Option 4
Answer: B
"""

        response = model.generate_content(prompt)
        text = response.text.strip()

        # Parse raw response into structured data
        pattern = r"Q: (.*?)\nA\. (.*?)\nB\. (.*?)\nC\. (.*?)\nD\. (.*?)\nAnswer: (.)"
        matches = re.findall(pattern, text, re.DOTALL)

        questions = [
            {
                "question": q.strip(),
                "options": [
                    f"A. {a.strip()}",
                    f"B. {b.strip()}",
                    f"C. {c.strip()}",
                    f"D. {d.strip()}"
                ],
                "answer": ans.strip()
            }
            for q, a, b, c, d, ans in matches
        ]

        return jsonify({'questions': questions})

    except Exception as e:
        print("Gemini Error:", e)
        return jsonify({'error': 'Gemini AI failed to generate questions'}), 500

if __name__ == '__main__':
    app.run(port=8000)