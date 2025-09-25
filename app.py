"""Flask entrypoint for the AI prompt helper."""
from __future__ import annotations

from flask import Flask, jsonify, render_template, request

from prompt_engine import ENGINE


app = Flask(__name__)


@app.route("/")
def index():
    languages = ENGINE.available_languages()
    return render_template("index.html", languages=languages)


@app.post("/api/process")
def process_prompt():
    payload = request.get_json(force=True)
    prompt = payload.get("prompt", "")
    languages = payload.get("languages", [])
    creativity = float(payload.get("creativity", 0.5))

    analysis = ENGINE.process_prompt(prompt, languages, creativity)

    return jsonify(
        {
            "detected_language": analysis.detected_language,
            "detected_language_code": analysis.detected_language_code,
            "optimized_prompt": analysis.optimized_prompt,
            "keywords": analysis.keywords,
            "expanded_prompt": analysis.expanded_prompt,
            "translations": analysis.translations,
            "suggestions": analysis.suggestions,
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
