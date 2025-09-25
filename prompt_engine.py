"""Core prompt engineering logic for the AI prompt helper web app."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Sequence
import re


@dataclass
class PromptAnalysis:
    """Structured representation of the processed prompt."""

    detected_language: str
    detected_language_code: str
    optimized_prompt: str
    keywords: List[str]
    expanded_prompt: str
    translations: Dict[str, Dict[str, Any]]
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
            "portrait": {"zh": "肖像", "es": "retrato", "fr": "portrait", "ja": "ポートレート"},
            "landscape": {"zh": "风景", "es": "paisaje", "fr": "paysage", "ja": "風景"},
            "character": {"zh": "角色", "es": "personaje", "fr": "personnage", "ja": "キャラクター"},
            "architecture": {"zh": "建筑", "es": "arquitectura", "fr": "architecture", "ja": "建築"},
            "product": {"zh": "产品", "es": "producto", "fr": "produit", "ja": "プロダクト"},
            "creature": {"zh": "生物", "es": "criatura", "fr": "créature", "ja": "クリーチャー"},
            "cyberpunk": {"zh": "赛博朋克", "es": "cyberpunk", "fr": "cyberpunk", "ja": "サイバーパンク"},
            "sunset": {"zh": "日落", "es": "atardecer", "fr": "coucher de soleil", "ja": "夕日"},
            "sunrise": {"zh": "日出", "es": "amanecer", "fr": "lever de soleil", "ja": "日の出"},
            "mountain": {"zh": "山脉", "es": "montaña", "fr": "montagne", "ja": "山"},
            "forest": {"zh": "森林", "es": "bosque", "fr": "forêt", "ja": "森"},
            "desert": {"zh": "沙漠", "es": "desierto", "fr": "désert", "ja": "砂漠"},
            "ocean": {"zh": "海洋", "es": "océano", "fr": "océan", "ja": "海"},
            "city": {"zh": "城市", "es": "ciudad", "fr": "ville", "ja": "都市"},
            "neon": {"zh": "霓虹", "es": "neón", "fr": "néon", "ja": "ネオン"},
            "dramatic": {"zh": "戏剧性的", "es": "dramático", "fr": "dramatique", "ja": "ドラマチック"},
            "cinematic": {"zh": "电影感", "es": "cinematográfico", "fr": "cinématographique", "ja": "シネマティック"},
            "realistic": {"zh": "写实", "es": "realista", "fr": "réaliste", "ja": "リアル"},
            "watercolor": {"zh": "水彩", "es": "acuarela", "fr": "aquarelle", "ja": "水彩"},
            "anime": {"zh": "二次元", "es": "anime", "fr": "anime", "ja": "アニメ"},
            "macro": {"zh": "微距", "es": "macro", "fr": "macro", "ja": "マクロ"},
            "isometric": {"zh": "等距", "es": "isométrico", "fr": "isométrique", "ja": "アイソメ"},
            "aerial": {"zh": "航拍", "es": "aéreo", "fr": "aérien", "ja": "空撮"},
            "vibrant": {"zh": "鲜艳", "es": "vibrante", "fr": "vibrant", "ja": "鮮やか"},
            "pastel": {"zh": "粉彩", "es": "pastel", "fr": "pastel", "ja": "パステル"},
            "monochrome": {"zh": "单色", "es": "monocromo", "fr": "monochrome", "ja": "モノクロ"},
            "volumetric": {"zh": "体积光", "es": "volumétrico", "fr": "volumétrique", "ja": "ボリュメトリック"},
            "studio": {"zh": "棚拍", "es": "estudio", "fr": "studio", "ja": "スタジオ"},
            "texture": {"zh": "质感", "es": "textura", "fr": "texture", "ja": "質感"},
        },

        "zh": {
            "肖像": {"en": "portrait", "es": "retrato", "fr": "portrait", "ja": "ポートレート"},
            "风景": {"en": "landscape", "es": "paisaje", "fr": "paysage", "ja": "風景"},
            "角色": {"en": "character", "es": "personaje", "fr": "personnage", "ja": "キャラクター"},
            "建筑": {"en": "architecture", "es": "arquitectura", "fr": "architecture", "ja": "建築"},
            "产品": {"en": "product", "es": "producto", "fr": "produit", "ja": "プロダクト"},
            "生物": {"en": "creature", "es": "criatura", "fr": "créature", "ja": "クリーチャー"},
            "赛博朋克": {"en": "cyberpunk", "es": "cyberpunk", "fr": "cyberpunk", "ja": "サイバーパンク"},
            "日落": {"en": "sunset", "es": "atardecer", "fr": "coucher de soleil", "ja": "夕日"},
            "日出": {"en": "sunrise", "es": "amanecer", "fr": "lever de soleil", "ja": "日の出"},
            "山脉": {"en": "mountain", "es": "montaña", "fr": "montagne", "ja": "山"},
            "森林": {"en": "forest", "es": "bosque", "fr": "forêt", "ja": "森"},
            "沙漠": {"en": "desert", "es": "desierto", "fr": "désert", "ja": "砂漠"},
            "海洋": {"en": "ocean", "es": "océano", "fr": "océan", "ja": "海"},
            "城市": {"en": "city", "es": "ciudad", "fr": "ville", "ja": "都市"},
            "霓虹": {"en": "neon", "es": "neón", "fr": "néon", "ja": "ネオン"},
            "戏剧性的": {"en": "dramatic", "es": "dramático", "fr": "dramatique", "ja": "ドラマチック"},
            "电影感": {"en": "cinematic", "es": "cinematográfico", "fr": "cinématographique", "ja": "シネマティック"},
            "写实": {"en": "realistic", "es": "realista", "fr": "réaliste", "ja": "リアル"},
            "水彩": {"en": "watercolor", "es": "acuarela", "fr": "aquarelle", "ja": "水彩"},
            "二次元": {"en": "anime", "es": "anime", "fr": "anime", "ja": "アニメ"},
            "微距": {"en": "macro", "es": "macro", "fr": "macro", "ja": "マクロ"},
            "等距": {"en": "isometric", "es": "isométrico", "fr": "isométrique", "ja": "アイソメ"},
            "航拍": {"en": "aerial", "es": "aéreo", "fr": "aérien", "ja": "空撮"},
            "鲜艳": {"en": "vibrant", "es": "vibrante", "fr": "vibrant", "ja": "鮮やか"},
            "粉彩": {"en": "pastel", "es": "pastel", "fr": "pastel", "ja": "パステル"},
            "单色": {"en": "monochrome", "es": "monocromo", "fr": "monochrome", "ja": "モノクロ"},
            "体积光": {"en": "volumetric", "es": "volumétrico", "fr": "volumétrique", "ja": "ボリュメトリック"},
            "棚拍": {"en": "studio", "es": "estudio", "fr": "studio", "ja": "スタジオ"},
            "质感": {"en": "texture", "es": "textura", "fr": "texture", "ja": "質感"},
        },

        "es": {
            "retrato": {"en": "portrait", "zh": "肖像", "fr": "portrait", "ja": "ポートレート"},
            "paisaje": {"en": "landscape", "zh": "风景", "fr": "paysage", "ja": "風景"},
            "personaje": {"en": "character", "zh": "角色", "fr": "personnage", "ja": "キャラクター"},
            "arquitectura": {"en": "architecture", "zh": "建筑", "fr": "architecture", "ja": "建築"},
            "producto": {"en": "product", "zh": "产品", "fr": "produit", "ja": "プロダクト"},
            "criatura": {"en": "creature", "zh": "生物", "fr": "créature", "ja": "クリーチャー"},
            "cyberpunk": {"en": "cyberpunk", "zh": "赛博朋克", "fr": "cyberpunk", "ja": "サイバーパンク"},
            "atardecer": {"en": "sunset", "zh": "日落", "fr": "coucher de soleil", "ja": "夕日"},
            "amanecer": {"en": "sunrise", "zh": "日出", "fr": "lever de soleil", "ja": "日の出"},
            "montaña": {"en": "mountain", "zh": "山脉", "fr": "montagne", "ja": "山"},
            "bosque": {"en": "forest", "zh": "森林", "fr": "forêt", "ja": "森"},
            "desierto": {"en": "desert", "zh": "沙漠", "fr": "désert", "ja": "砂漠"},
            "océano": {"en": "ocean", "zh": "海洋", "fr": "océan", "ja": "海"},
            "ciudad": {"en": "city", "zh": "城市", "fr": "ville", "ja": "都市"},
            "neón": {"en": "neon", "zh": "霓虹", "fr": "néon", "ja": "ネオン"},
            "dramático": {"en": "dramatic", "zh": "戏剧性的", "fr": "dramatique", "ja": "ドラマチック"},
            "cinematográfico": {"en": "cinematic", "zh": "电影感", "fr": "cinématographique", "ja": "シネマティック"},
            "realista": {"en": "realistic", "zh": "写实", "fr": "réaliste", "ja": "リアル"},
            "acuarela": {"en": "watercolor", "zh": "水彩", "fr": "aquarelle", "ja": "水彩"},
            "anime": {"en": "anime", "zh": "二次元", "fr": "anime", "ja": "アニメ"},
            "macro": {"en": "macro", "zh": "微距", "fr": "macro", "ja": "マクロ"},
            "isométrico": {"en": "isometric", "zh": "等距", "fr": "isométrique", "ja": "アイソメ"},
            "aéreo": {"en": "aerial", "zh": "航拍", "fr": "aérien", "ja": "空撮"},
            "vibrante": {"en": "vibrant", "zh": "鲜艳", "fr": "vibrant", "ja": "鮮やか"},
            "pastel": {"en": "pastel", "zh": "粉彩", "fr": "pastel", "ja": "パステル"},
            "monocromo": {"en": "monochrome", "zh": "单色", "fr": "monochrome", "ja": "モノクロ"},
            "volumétrico": {"en": "volumetric", "zh": "体积光", "fr": "volumétrique", "ja": "ボリュメトリック"},
            "estudio": {"en": "studio", "zh": "棚拍", "fr": "studio", "ja": "スタジオ"},
            "textura": {"en": "texture", "zh": "质感", "fr": "texture", "ja": "質感"},
        },

        "fr": {
            "portrait": {"en": "portrait", "zh": "肖像", "es": "retrato", "ja": "ポートレート"},
            "paysage": {"en": "landscape", "zh": "风景", "es": "paisaje", "ja": "風景"},
            "personnage": {"en": "character", "zh": "角色", "es": "personaje", "ja": "キャラクター"},
            "architecture": {"en": "architecture", "zh": "建筑", "es": "arquitectura", "ja": "建築"},
            "produit": {"en": "product", "zh": "产品", "es": "producto", "ja": "プロダクト"},
            "créature": {"en": "creature", "zh": "生物", "es": "criatura", "ja": "クリーチャー"},
            "cyberpunk": {"en": "cyberpunk", "zh": "赛博朋克", "es": "cyberpunk", "ja": "サイバーパンク"},
            "coucher": {"en": "sunset", "zh": "日落", "es": "atardecer", "ja": "夕日"},
            "lever": {"en": "sunrise", "zh": "日出", "es": "amanecer", "ja": "日の出"},
            "montagne": {"en": "mountain", "zh": "山脉", "es": "montaña", "ja": "山"},
            "forêt": {"en": "forest", "zh": "森林", "es": "bosque", "ja": "森"},
            "désert": {"en": "desert", "zh": "沙漠", "es": "desierto", "ja": "砂漠"},
            "océan": {"en": "ocean", "zh": "海洋", "es": "océano", "ja": "海"},
            "ville": {"en": "city", "zh": "城市", "es": "ciudad", "ja": "都市"},
            "néon": {"en": "neon", "zh": "霓虹", "es": "neón", "ja": "ネオン"},
            "dramatique": {"en": "dramatic", "zh": "戏剧性的", "es": "dramático", "ja": "ドラマチック"},
            "cinématographique": {"en": "cinematic", "zh": "电影感", "es": "cinematográfico", "ja": "シネマティック"},
            "réaliste": {"en": "realistic", "zh": "写实", "es": "realista", "ja": "リアル"},
            "aquarelle": {"en": "watercolor", "zh": "水彩", "es": "acuarela", "ja": "水彩"},
            "anime": {"en": "anime", "zh": "二次元", "es": "anime", "ja": "アニメ"},
            "macro": {"en": "macro", "zh": "微距", "es": "macro", "ja": "マクロ"},
            "isométrique": {"en": "isometric", "zh": "等距", "es": "isométrico", "ja": "アイソメ"},
            "aérien": {"en": "aerial", "zh": "航拍", "es": "aéreo", "ja": "空撮"},
            "vibrant": {"en": "vibrant", "zh": "鲜艳", "es": "vibrante", "ja": "鮮やか"},
            "pastel": {"en": "pastel", "zh": "粉彩", "es": "pastel", "ja": "パステル"},
            "monochrome": {"en": "monochrome", "zh": "单色", "es": "monocromo", "ja": "モノクロ"},
            "volumétrique": {"en": "volumetric", "zh": "体积光", "es": "volumétrico", "ja": "ボリュメトリック"},
            "studio": {"en": "studio", "zh": "棚拍", "es": "estudio", "ja": "スタジオ"},
            "texture": {"en": "texture", "zh": "质感", "es": "textura", "ja": "質感"},
        },

        "ja": {
            "ポートレート": {"en": "portrait", "zh": "肖像", "es": "retrato", "fr": "portrait"},
            "風景": {"en": "landscape", "zh": "风景", "es": "paisaje", "fr": "paysage"},
            "キャラクター": {"en": "character", "zh": "角色", "es": "personaje", "fr": "personnage"},
            "建築": {"en": "architecture", "zh": "建筑", "es": "arquitectura", "fr": "architecture"},
            "プロダクト": {"en": "product", "zh": "产品", "es": "producto", "fr": "produit"},
            "クリーチャー": {"en": "creature", "zh": "生物", "es": "criatura", "fr": "créature"},
            "サイバーパンク": {"en": "cyberpunk", "zh": "赛博朋克", "es": "cyberpunk", "fr": "cyberpunk"},
            "夕日": {"en": "sunset", "zh": "日落", "es": "atardecer", "fr": "coucher de soleil"},
            "日の出": {"en": "sunrise", "zh": "日出", "es": "amanecer", "fr": "lever de soleil"},
            "山": {"en": "mountain", "zh": "山脉", "es": "montaña", "fr": "montagne"},
            "森": {"en": "forest", "zh": "森林", "es": "bosque", "fr": "forêt"},
            "砂漠": {"en": "desert", "zh": "沙漠", "es": "desierto", "fr": "désert"},
            "海": {"en": "ocean", "zh": "海洋", "es": "océano", "fr": "océan"},
            "都市": {"en": "city", "zh": "城市", "es": "ciudad", "fr": "ville"},
            "ネオン": {"en": "neon", "zh": "霓虹", "es": "neón", "fr": "néon"},
            "ドラマチック": {"en": "dramatic", "zh": "戏剧性的", "es": "dramático", "fr": "dramatique"},
            "シネマティック": {"en": "cinematic", "zh": "电影感", "es": "cinematográfico", "fr": "cinématographique"},
            "リアル": {"en": "realistic", "zh": "写实", "es": "realista", "fr": "réaliste"},
            "水彩": {"en": "watercolor", "zh": "水彩", "es": "acuarela", "fr": "aquarelle"},
            "アニメ": {"en": "anime", "zh": "二次元", "es": "anime", "fr": "anime"},
            "マクロ": {"en": "macro", "zh": "微距", "es": "macro", "fr": "macro"},
            "アイソメ": {"en": "isometric", "zh": "等距", "es": "isométrico", "fr": "isométrique"},
            "空撮": {"en": "aerial", "zh": "航拍", "es": "aéreo", "fr": "aérien"},
            "鮮やか": {"en": "vibrant", "zh": "鲜艳", "es": "vibrante", "fr": "vibrant"},
            "パステル": {"en": "pastel", "zh": "粉彩", "es": "pastel", "fr": "pastel"},
            "モノクロ": {"en": "monochrome", "zh": "单色", "es": "monocromo", "fr": "monochrome"},
            "ボリュメトリック": {"en": "volumetric", "zh": "体积光", "es": "volumétrico", "fr": "volumétrique"},
            "スタジオ": {"en": "studio", "zh": "棚拍", "es": "estudio", "fr": "studio"},
            "質感": {"en": "texture", "zh": "质感", "es": "textura", "fr": "texture"},
        },
    }
    SYNONYM_MAP = {
        "portrait": ["character study", "close-up headshot"],
        "landscape": ["panorama", "sweeping vista"],
        "character": ["figure", "subject"],
        "architecture": ["structural design", "urban skyline"],
        "product": ["merchandise shot", "catalog render"],
        "creature": ["fantasy beast", "mythic entity"],
        "cyberpunk": ["futuristic", "tech-noir neon"],
        "sunset": ["golden hour", "twilight sky"],
        "sunrise": ["dawn glow", "morning light"],
        "mountain": ["alpine", "summit"],
        "forest": ["woodland", "lush greenery"],
        "desert": ["dune sea", "arid expanse"],
        "ocean": ["seascape", "coastal horizon"],
        "city": ["urban", "metropolitan"],
        "neon": ["glowing", "luminous"],
        "dramatic": ["intense", "theatrical"],
        "cinematic": ["film-grade", "movie lighting"],
        "realistic": ["photoreal", "lifelike"],
        "watercolor": ["painterly", "soft brushstrokes"],
        "anime": ["cel shading", "stylised"],
        "macro": ["close focus", "extreme detail"],
        "isometric": ["axonometric", "3D grid"],
        "aerial": ["bird's-eye", "top-down"],
        "vibrant": ["saturated", "bold colors"],
        "pastel": ["soft palette", "muted tones"],
        "monochrome": ["single tone", "black-and-white"],
        "volumetric": ["god rays", "light shafts"],
        "studio": ["controlled lighting", "seamless backdrop"],
        "texture": ["surface detail", "material feel"],
        "lighting": ["illumination", "light setup"],
        "夜景": ["夜色", "夜幕"],
        "肖像": ["人物写生", "面部特写"],
        "风景": ["自然景观", "户外视野"],
        "建筑": ["建筑线条", "城市结构"],
        "产品": ["商品展示", "陈列照"],
        "生物": ["奇幻生物", "异兽"],
        "赛博朋克": ["未来城市", "霓虹未来"],
        "日落": ["黄昏", "余晖"],
        "日出": ["黎明", "晨光"],
        "山脉": ["群山", "高山"],
        "森林": ["林海", "密林"],
        "沙漠": ["荒漠", "沙海"],
        "海洋": ["大海", "海岸"],
        "城市": ["都市", "都会"],
        "霓虹": ["灯带", "光影"],
        "写实": ["真实质感", "逼真"],
        "二次元": ["动漫风", "卡通感"],
        "微距": ["细节特写", "超近距离"],
    }

    SCENE_KEYWORD_EXPANSIONS = {
        "cyberpunk": {
            "base": [
                "neon megacity", "holographic signage", "chrome alleyways"
            ],
            "context_map": {
                "rain": ["wet street reflections", "rain haze"],
                "night": ["midnight palette", "light trails"],
                "portrait": ["augmented implants", "digital makeup"]
            },
        },
        "landscape": {
            "base": [
                "rolling hills", "layered depth", "open horizon"
            ],
            "context_map": {
                "sunset": ["sunset glow", "warm rim light"],
                "sunrise": ["misty dawn", "soft morning haze"],
                "forest": ["treeline silhouettes", "valley fog"]
            },
        },
        "architecture": {
            "base": [
                "geometric facades", "glass reflections", "structural rhythm"
            ],
            "context_map": {
                "night": ["lit windows", "city glow"],
                "sunrise": ["warm facade light"],
                "isometric": ["axonometric grid", "clean lines"]
            },
        },
        "product": {
            "base": [
                "studio sweep", "floating hero shot", "detail highlight"
            ],
            "context_map": {
                "macro": ["texture closeup", "material pores"],
                "vibrant": ["bold accent colors"],
                "pastel": ["soft gradient backdrop"]
            },
        },
        "creature": {
            "base": [
                "fantasy anatomy", "scales and fur mix", "expressive posture"
            ],
            "context_map": {
                "forest": ["mossy ground", "bioluminescent spores"],
                "desert": ["dust storm", "weathered bones"],
                "ocean": ["coral glow", "dripping water"]
            },
        },
        "portrait": {
            "base": [
                "expressive eyes", "controlled focus", "balanced composition"
            ],
            "context_map": {
                "studio": ["three-point lighting", "seamless backdrop"],
                "cyberpunk": ["glitch accents", "neon rim"],
                "watercolor": ["soft edges", "bleeding pigments"]
            },
        },
        "macro": {
            "base": [
                "shallow depth", "micro textures", "bokeh orbs"
            ],
            "context_map": {
                "flora": ["pollen grains", "dew drops"],
                "product": ["fabric weave", "machined edges"],
            },
        },
        "anime": {
            "base": [
                "bold line art", "cel shading highlights", "expressive poses"
            ],
            "context_map": {
                "portrait": ["sparkling eyes", "stylised hair"],
                "city": ["anime skyline", "speed lines"],
                "fantasy": ["magic aura", "floating particles"],
            },
        },
        "sunset": {
            "base": [
                "warm gradient sky", "long cast shadows", "glowing horizon"
            ],
            "context_map": {
                "ocean": ["water reflections", "glitter path"],
                "city": ["silhouetted skyline", "window glow"],
                "mountain": ["alpenglow peaks", "valley haze"]
            },
        },
        "sunrise": {
            "base": [
                "cool-to-warm shift", "soft light bloom", "fresh atmosphere"
            ],
            "context_map": {
                "forest": ["fog bands", "sunbeams"],
                "desert": ["dune highlights", "morning chill"],
            },
        },
        "mountain": {
            "base": [
                "ridgeline layers", "snow caps", "aerial perspective"
            ],
            "context_map": {
                "sunset": ["amber highlights", "purple shadows"],
                "aerial": ["drone vantage", "valley map"],
                "forest": ["evergreen belt"]
            },
        },
        "forest": {
            "base": [
                "dappled light", "dense canopy", "ground foliage"
            ],
            "context_map": {
                "fog": ["floating mist", "god rays"],
                "river": ["sparkling stream", "wet stones"],
                "sunrise": ["glowing beams"]
            },
        },
        "desert": {
            "base": [
                "wind-carved dunes", "heat shimmer", "sun-bleached palette"
            ],
            "context_map": {
                "sunset": ["burning horizon", "cool shadows"],
                "traveler": ["footprints trail", "billowing cloak"],
            },
        },
        "ocean": {
            "base": [
                "rolling waves", "sea spray", "coastal breeze"
            ],
            "context_map": {
                "sunset": ["fiery reflections"],
                "storm": ["white caps", "dramatic clouds"],
                "product": ["wet highlights"]
            },
        },
        "city": {
            "base": [
                "layered skyline", "busy streets", "architectural grid"
            ],
            "context_map": {
                "night": ["window constellations", "traffic streaks"],
                "rain": ["mirror asphalt", "umbrella crowd"],
                "isometric": ["tilt-shift miniature"]
            },
        },
        "studio": {
            "base": [
                "softbox lighting", "controlled shadows", "clean backdrop"
            ],
            "context_map": {
                "product": ["tabletop setup", "reflective cards"],
                "portrait": ["beauty dish", "catchlights"],
            },
        },
        "volumetric": {
            "base": [
                "god rays", "light fog", "depth layering"
            ],
            "context_map": {
                "forest": ["sunbeams through branches"],
                "cyberpunk": ["laser haze"],
                "city": ["atmospheric perspective"]
            },
        },
        "赛博朋克": {
            "base": ["霓虹街区", "全息广告", "高层天际"],
            "context_map": {
                "夜景": ["灯光流线", "夜色氛围"],
                "雨": ["雨夜倒影", "潮湿路面"],
                "肖像": ["机械义体", "发光纹路"],
            },
        },
        "风景": {
            "base": ["远山层叠", "天空延展", "前景引导线"],
            "context_map": {
                "日落": ["金色余晖", "剪影树线"],
                "湖泊": ["镜面倒影", "薄雾水汽"],
            },
        },
        "建筑": {
            "base": ["立面线条", "节奏窗格", "结构重复"],
            "context_map": {
                "夜景": ["窗口灯光", "街灯点缀"],
                "日出": ["暖色光洗", "长阴影"]
            },
        },
        "产品": {
            "base": ["无缝背景", "高光描边", "展示角度"],
            "context_map": {
                "微距": ["材质纹理", "细节刻线"],
                "粉彩": ["柔和背景"],
                "鲜艳": ["撞色配搭"]
            },
        },
        "沙漠": {
            "base": ["沙丘曲线", "热浪扭曲", "孤立植被"],
            "context_map": {
                "旅人": ["足迹延伸", "飘动长巾"],
                "日落": ["橙红色调"]
            },
        },
        "海洋": {
            "base": ["浪花细节", "蓝绿渐层", "海风飞沫"],
            "context_map": {
                "日出": ["金色海面"],
                "风暴": ["碎浪", "乌云压顶"],
            },
        },
    }
    CATEGORY_SUGGESTIONS = {
        "lighting": {
            "keywords": {"cinematic", "dramatic", "studio", "neon", "volumetric", "sunset", "sunrise"},
            "options": [
                "volumetric lighting",
                "rim light",
                "softbox setup",
                "colored gel accents",
                "global illumination"
            ],
        },
        "camera": {
            "keywords": {"portrait", "macro", "aerial", "isometric", "landscape"},
            "options": [
                "85mm lens",
                "tilt-shift perspective",
                "depth of field",
                "bokeh",
                "high resolution"
            ],
        },
        "mood": {
            "keywords": {"dramatic", "vibrant", "pastel", "monochrome", "sunset", "sunrise"},
            "options": [
                "atmospheric fog",
                "cinematic color grading",
                "high contrast",
                "soft dreamy glow",
                "moody shadows"
            ],
        },
        "style": {
            "keywords": {"watercolor", "anime", "cyberpunk", "realistic", "creature", "architecture"},
            "options": [
                "artstation trending",
                "unreal engine render",
                "octane render",
                "painterly strokes",
                "hand-drawn line art"
            ],
        },
        "color": {
            "keywords": {"vibrant", "pastel", "monochrome", "sunset", "ocean", "forest"},
            "options": [
                "complementary palette",
                "analogous colors",
                "duotone treatment",
                "split complementary",
                "warm and cool contrast"
            ],
        },
        "composition": {
            "keywords": {"portrait", "product", "architecture", "landscape", "city"},
            "options": [
                "rule of thirds",
                "leading lines",
                "framing elements",
                "symmetrical balance",
                "negative space"
            ],
        },
        "material": {
            "keywords": {"texture", "product", "creature", "architecture", "realistic"},
            "options": [
                "subsurface scattering",
                "roughness variation",
                "metallic sheen",
                "fabric folds",
                "weathered surfaces"
            ],
        },
        "post": {
            "keywords": {"cyberpunk", "cinematic", "vibrant", "monochrome", "studio"},
            "options": [
                "noise reduction",
                "sharpen pass",
                "lens flare",
                "film grain",
                "glow bloom"
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
        subject_words = {
            "portrait",
            "landscape",
            "character",
            "mountain",
            "forest",
            "architecture",
            "product",
            "creature",
            "ocean",
            "city",
            "desert",
            "肖像",
            "风景",
            "山脉",
            "森林",
            "建筑",
            "产品",
            "生物",
            "海洋",
            "城市",
            "沙漠",
        }
        style_words = {
            "cyberpunk",
            "watercolor",
            "digital",
            "oil",
            "pixel",
            "anime",
            "realistic",
            "cinematic",
            "二次元",
            "写实",
        }

        for word in prioritized:
            if word in subject_words:
                sections["subject"].append(word)
            elif word in style_words:
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

    def _scene_expansions(
        self, keyword: str, keyword_set: Sequence[str], creativity: float
    ) -> List[str]:
        if keyword not in self.SCENE_KEYWORD_EXPANSIONS:
            return []

        data = self.SCENE_KEYWORD_EXPANSIONS[keyword]
        options: List[str] = list(data.get("base", []))
        context_map = data.get("context_map", {})

        # Normalise the lookup structure for quick membership checks.
        set_keywords = set(keyword_set)
        for context_keyword, phrases in context_map.items():
            if context_keyword in set_keywords:
                options.extend(phrases)

        if not options:
            return []

        # Determine how many scene phrases to surface based on creativity.
        unique_options: List[str] = []
        seen_options = set()
        for option in options:
            if option not in seen_options:
                unique_options.append(option)
                seen_options.add(option)

        count = max(1, int(round(creativity * len(unique_options))))
        return unique_options[:count]

    def expand_prompt(self, keywords: Sequence[str], creativity: float = 0.5) -> str:
        creativity = max(0.0, min(1.0, creativity))
        expanded_parts: List[str] = []
        for word in keywords:
            segments: List[str] = [word]

            synonyms = self.SYNONYM_MAP.get(word, [])
            if synonyms:
                count = max(1, int(round(creativity * len(synonyms))))
                segments.append(f"同义修饰: {', '.join(synonyms[:count])}")

            scene_phrases = self._scene_expansions(word, keywords, creativity)
            if scene_phrases:
                segments.append(f"场景关键词: {', '.join(scene_phrases)}")

            expanded_parts.append(" | ".join(segments))

        return "; ".join(expanded_parts)

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

        languages_order: List[str] = []
        if source_lang in self.LANGUAGE_LABELS:
            languages_order.append(source_lang)

        for lang in target_languages:
            if lang in self.LANGUAGE_LABELS and lang not in languages_order:
                languages_order.append(lang)

        if not languages_order:
            languages_order.append(source_lang)

        localized_texts: Dict[str, str] = {}
        for lang in languages_order:
            if lang == source_lang:
                localized_texts[lang] = optimisation["optimized"]
            else:
                localized_texts[lang] = self.translate_prompt(
                    optimisation["optimized"], source_lang, lang
                )

        translations: Dict[str, Dict[str, str]] = {}
        for lang in languages_order:
            base_text = localized_texts.get(lang, optimisation["optimized"])
            mutual: Dict[str, str] = {}
            for other in languages_order:
                if other == lang:
                    continue
                mutual[other] = self.translate_prompt(base_text, lang, other)

            translations[lang] = {
                "label": self.LANGUAGE_LABELS.get(lang, lang),
                "base_text": base_text,
                "mutual": mutual,
            }

        return PromptAnalysis(
            detected_language=self.LANGUAGE_LABELS.get(source_lang, source_lang),
            detected_language_code=source_lang,
            optimized_prompt=optimisation["optimized"],
            keywords=optimisation["keywords"],
            expanded_prompt=expanded,
            translations=translations,
            suggestions=optimisation["suggestions"],
        )


ENGINE = PromptEngine()
