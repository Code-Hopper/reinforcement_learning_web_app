from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import re
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# -----------------------------
# 📘 Route: Learn about a topic
# -----------------------------
@app.route('/learn-topic', methods=['POST'])
def learn_topic():
    data = request.get_json()
    topic = data.get('query', '')

    if not topic:
        return jsonify({'error': 'No topic provided'}), 400

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
You are a helpful teacher. Explain the topic "{topic}" to a beginner in a short and clear way using bullet points or small paragraphs. Keep it simple, engaging, and under 300 words.
"""

        response = model.generate_content(prompt)
        explanation = response.text.strip()

        return jsonify({
            'topic': topic,
            'explanation': explanation
        })

    except Exception as e:
        print("Gemini Learn Error:", e)
        return jsonify({'error': 'Gemini AI failed to generate learning content'}), 500

# -----------------------------
# 🧠 Route: Generate MCQs
# -----------------------------
@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    data = request.get_json()
    topic = data.get('query', '')
    level = data.get('level', 'Beginner')
    difficulty = data.get('difficulty', 'Easy')

    if not topic:
        return jsonify({'error': 'No topic provided'}), 400

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
Generate 5 {difficulty} multiple choice questions (MCQs) for a {level} level learner on the topic "{topic}". 
Each question should include 4 options (A-D) and the correct answer letter.

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

        suggested_topics = generate_related_topics(topic)

        return jsonify({
            'questions': questions,
            'suggestedTopics': suggested_topics
        })

    except Exception as e:
        print("Gemini Questions Error:", e)
        return jsonify({'error': 'Gemini AI failed to generate questions'}), 500

# -----------------------------
# ✅ Store Answers and Evaluate
# -----------------------------
@app.route('/store-answers', methods=['POST'])
def store_answers():
    data = request.get_json()
    answers = data.get('answers', [])
    topic = data.get('topic', 'Unknown')

    total = len(answers)
    correct = sum(1 for ans in answers if ans.get("isCorrect"))

    credit_points = correct * 10
    skill_level = evaluate_skill(correct, total)

    return jsonify({
        'message': 'Answers stored successfully.',
        'topic': topic,
        'totalQuestions': total,
        'correctAnswers': correct,
        'creditPoints': credit_points,
        'skillLevel': skill_level
    }), 201

# -----------------------------
# 🤖 AI Tutor: Topic Guide JSON
# -----------------------------
@app.route('/query-topic-guide', methods=['POST'])
def query_topic_guide():
    data = request.get_json()
    topic = data.get('topic', '')

    if not topic:
        return jsonify({'error': 'No topic provided'}), 400

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""
Act like a tutor. For the topic "{topic}", give:
1. A 2-3 line overview.
2. List of 4-6 points a beginner should learn first.
3. 3-5 suggested next topics.

Respond ONLY in valid JSON format like:
{{
  "topicTag" : "java"
  "response": "short overview...",
  "startingPoints": ["point1", "point2", ...],
  "suggestedTopics": ["topic1", "topic2", ...]
}}
"""

        res = model.generate_content(prompt)
        raw_output = res.text.strip()
        print("🧠 Gemini Raw Output:\n", raw_output)

        # Try to extract the JSON part only
        json_match = re.search(r'\{.*\}', raw_output, re.DOTALL)
        if not json_match:
            raise ValueError("No valid JSON found in Gemini response")

        json_data = json.loads(json_match.group())

        return jsonify(json_data)

    except json.JSONDecodeError as jde:
        print("❌ JSON Decode Error:", jde)
        return jsonify({'error': 'Gemini returned invalid JSON format'}), 500
    except Exception as e:
        print("AI Tutor Query Error:", e)
        return jsonify({'error': 'Failed to get topic guide'}), 500

# -----------------------------
# 🔧 Utility Functions
# -----------------------------
def generate_related_topics(base_topic):
    suggestions = {
        "JavaScript": ["ES6", "DOM Manipulation", "Async/Await", "ReactJS"],
        "Python": ["Data Types", "OOP in Python", "Flask", "Pandas"],
        "AI": ["Machine Learning", "Neural Networks", "Prompt Engineering", "NLP"],
        "Cybersecurity": ["Encryption", "Network Security", "Ethical Hacking", "Firewalls"]
    }

    return suggestions.get(base_topic, [
        f"{base_topic} Basics",
        f"Advanced {base_topic}",
        f"{base_topic} Use Cases",
        f"{base_topic} Tools"
    ])

def evaluate_skill(correct, total):
    if total == 0:
        return "No Attempt"
    percentage = (correct / total) * 100
    if percentage >= 90:
        return "Expert"
    elif percentage >= 70:
        return "Intermediate"
    elif percentage >= 50:
        return "Beginner"
    else:
        return "Needs Improvement"

# -----------------------------
# 🚀 Run Flask App
# -----------------------------
if __name__ == '__main__':
    app.run(port=8000)
