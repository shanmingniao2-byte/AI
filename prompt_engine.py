"""Core prompt engineering logic for the AI prompt helper web app."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable, List, Sequence
import re


@dataclass
class PromptAnalysis:
    """Structured representation of the processed prompt."""

    detected_language: str
    optimized_prompt: str
    keywords: List[str]
    expanded_prompt: str
    translations: Dict[str, str]
    suggestions: Dict[str, List[str]]


class PromptEngine:
    """Utility class containing the heuristic prompt optimisation pipeline."""

    STOPWORDS = {
        "the",
        "a",
        "an",
        "with",
        "and",
        "in",
        "of",
        "for",
        "on",
        "to",
        "by",
        "from",
        "using",
        "is",
        "are",
        "this",
        "that",
    }

    LANGUAGE_LABELS = {
        "en": "English",
        "zh": "中文 (Chinese)",
        "es": "Español (Spanish)",
        "fr": "Français (French)",
        "ja": "日本語 (Japanese)",
    }

    # Minimal bilingual dictionary tuned for common AI art vocabulary.
    TRANSLATION_MEMORY: Dict[str, Dict[str, Dict[str, str]]] = {
        "en": {
            "portrait": {
                "zh": "肖像",
                "es": "retrato",
                "fr": "portrait",
                "ja": "ポートレート",
            },
            "cinematic": {
                "zh": "电影感",
                "es": "cinematográfico",
                "fr": "cinématographique",
                "ja": "シネマティック",
            },
            "lighting": {
                "zh": "光照",
                "es": "iluminación",
                "fr": "éclairage",
                "ja": "ライティング",
            },
            "dramatic": {
                "zh": "戏剧性的",
                "es": "dramático",
                "fr": "dramatique",
                "ja": "ドラマチック",
            },
            "sunset": {
                "zh": "日落",
                "es": "atardecer",
                "fr": "coucher de soleil",
                "ja": "夕日",
            },
            "mountain": {
                "zh": "山脉",
                "es": "montaña",
                "fr": "montagne",
                "ja": "山",
            },
            "cyberpunk": {
                "zh": "赛博朋克",
                "es": "cyberpunk",
                "fr": "cyberpunk",
                "ja": "サイバーパンク",
            },
            "neon": {
                "zh": "霓虹",
                "es": "neón",
                "fr": "néon",
                "ja": "ネオン",
            },
            "detailed": {
                "zh": "细致的",
                "es": "detallado",
                "fr": "détaillé",
                "ja": "詳細な",
            },
        },
        "zh": {
            "肖像": {
                "en": "portrait",
                "es": "retrato",
                "fr": "portrait",
                "ja": "ポートレート",
            },
            "赛博朋克": {
                "en": "cyberpunk",
                "es": "cyberpunk",
                "fr": "cyberpunk",
                "ja": "サイバーパンク",
            },
            "日落": {
                "en": "sunset",
                "es": "atardecer",
                "fr": "coucher de soleil",
                "ja": "夕日",
            },
        },
        "es": {
            "retrato": {
                "en": "portrait",
                "zh": "肖像",
                "fr": "portrait",
                "ja": "ポートレート",
            },
        },
        "fr": {
            "portrait": {
                "en": "portrait",
                "zh": "肖像",
                "es": "retrato",
                "ja": "ポートレート",
            }
        },
        "ja": {
            "サイバーパンク": {
                "en": "cyberpunk",
                "zh": "赛博朋克",
                "es": "cyberpunk",
                "fr": "cyberpunk",
            }
        },
    }

    SYNONYM_MAP = {
        "portrait": ["character study", "close-up"],
        "cyberpunk": ["futuristic", "tech-noir"],
        "sunset": ["golden hour", "twilight sky"],
        "mountain": ["alpine", "summit"],
        "forest": ["woodland", "lush greenery"],
        "dramatic": ["intense", "theatrical"],
        "neon": ["glowing", "luminous"],
        "detailed": ["intricate", "highly detailed"],
        "watercolor": ["painterly", "soft brushstrokes"],
    }

    CATEGORY_SUGGESTIONS = {
        "lighting": {
            "keywords": {"cinematic", "dramatic", "studio", "natural", "sunset", "neon"},
            "options": [
                "volumetric lighting",
                "rim light",
                "soft shadows",
                "bloom effects",
            ],
        },
        "camera": {
            "keywords": {"portrait", "macro", "wide", "fisheye"},
            "options": [
                "85mm lens",
                "depth of field",
                "bokeh",
                "high resolution",
            ],
        },
        "mood": {
            "keywords": {"dramatic", "moody", "serene", "epic"},
            "options": [
                "atmospheric fog",
                "cinematic color grading",
                "dynamic composition",
                "high contrast",
            ],
        },
        "style": {
            "keywords": {"watercolor", "digital", "cyberpunk", "oil", "pixel"},
            "options": [
                "artstation trending",
                "unreal engine render",
                "octane render",
                "high fidelity",
            ],
        },
    }

    def available_languages(self) -> List[Dict[str, str]]:
        return [
            {"code": code, "label": label} for code, label in self.LANGUAGE_LABELS.items()
        ]

    def detect_language(self, text: str) -> str:
        if not text:
            return "en"
        if re.search(r"[\u4e00-\u9fff]", text):
            return "zh"
        if re.search(r"[ぁ-んァ-ン]", text):
            return "ja"
        if re.search(r"[áéíóúñ]", text.lower()):
            return "es"
        if re.search(r"[àâçéèêëîïôûùüÿñæœ]", text.lower()):
            return "fr"
        return "en"

    def _normalize(self, text: str) -> str:
        cleaned = re.sub(r"\s+", " ", text.strip().lower())
        return cleaned

    def _tokenize(self, text: str) -> List[str]:
        text = self._normalize(text)
        tokens = re.findall(r"[\w\-\u4e00-\u9fff]+", text)
        return tokens

    def _keywords(self, tokens: Sequence[str]) -> List[str]:
        keywords: List[str] = []
        seen = set()
        for token in tokens:
            if token in self.STOPWORDS:
                continue
            if token in seen:
                continue
            seen.add(token)
            keywords.append(token)
        return keywords

    def optimize_prompt(self, text: str) -> Dict[str, Iterable[str]]:
        tokens = self._tokenize(text)
        keywords = self._keywords(tokens)

        prioritized = sorted(
            keywords,
            key=lambda word: (-tokens.count(word), keywords.index(word)),
        )

        sections: Dict[str, List[str]] = {"subject": [], "style": [], "details": []}
        for word in prioritized:
            if word in {"portrait", "landscape", "character", "mountain", "forest"}:
                sections["subject"].append(word)
            elif word in {"cyberpunk", "watercolor", "digital", "oil", "pixel"}:
                sections["style"].append(word)
            else:
                sections["details"].append(word)

        ordered = []
        if sections["subject"]:
            ordered.append(", ".join(sections["subject"]))
        if sections["style"]:
            ordered.append(", ".join(sections["style"]))
        if sections["details"]:
            ordered.append(", ".join(sections["details"]))

        optimized = "; ".join(ordered)

        suggestions = self._generate_suggestions(keywords)

        return {
            "keywords": keywords,
            "optimized": optimized,
            "suggestions": suggestions,
        }

    def _generate_suggestions(self, keywords: Sequence[str]) -> Dict[str, List[str]]:
        suggestions: Dict[str, List[str]] = {}
        keyword_set = set(keywords)
        for category, data in self.CATEGORY_SUGGESTIONS.items():
            if keyword_set & data["keywords"]:
                suggestions[category] = data["options"]
        return suggestions

    def expand_prompt(self, keywords: Sequence[str], creativity: float = 0.5) -> str:
        creativity = max(0.0, min(1.0, creativity))
        expanded_parts: List[str] = []
        for word in keywords:
            synonyms = self.SYNONYM_MAP.get(word, [])
            count = max(1, int(round(creativity * len(synonyms)))) if synonyms else 0
            chosen = synonyms[:count]
            if chosen:
                expanded_parts.append(f"{word} ({', '.join(chosen)})")
            else:
                expanded_parts.append(word)
        return ", ".join(expanded_parts)

    def translate_prompt(
        self, text: str, source_lang: str, target_lang: str
    ) -> str:
        if source_lang == target_lang:
            return text

        tokens = self._tokenize(text)
        translated_tokens: List[str] = []
        memory = self.TRANSLATION_MEMORY.get(source_lang, {})

        for token in tokens:
            translated = None
            if token in memory and target_lang in memory[token]:
                translated = memory[token][target_lang]
            else:
                for origin_lang, pairs in self.TRANSLATION_MEMORY.items():
                    if token in pairs and source_lang in pairs[token]:
                        intermediate = pairs[token][source_lang]
                        translated = (
                            self.TRANSLATION_MEMORY.get(source_lang, {})
                            .get(intermediate, {})
                            .get(target_lang)
                        )
                        if translated:
                            break
            translated_tokens.append(translated or token)

        return " ".join(translated_tokens)

    def process_prompt(
        self, text: str, target_languages: Sequence[str], creativity: float
    ) -> PromptAnalysis:
        source_lang = self.detect_language(text)
        optimisation = self.optimize_prompt(text)
        expanded = self.expand_prompt(optimisation["keywords"], creativity)

        translations = {}
        for lang in target_languages:
            if lang not in self.LANGUAGE_LABELS:
                continue
            translations[lang] = self.translate_prompt(
                optimisation["optimized"], source_lang, lang
            )

        return PromptAnalysis(
            detected_language=self.LANGUAGE_LABELS.get(source_lang, source_lang),
            optimized_prompt=optimisation["optimized"],
            keywords=optimisation["keywords"],
            expanded_prompt=expanded,
            translations=translations,
            suggestions=optimisation["suggestions"],
        )


ENGINE = PromptEngine()
