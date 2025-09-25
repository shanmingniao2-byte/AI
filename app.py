AI 提示助手的 Flask 入口点。
从__future__导入注释

从Flask导入Flask、jsonify、render_template、请求

从prompt_engine导入ENGINE


应用程序 = Flask（__name__）


@app.route( “/” )
定义索引（）：
 
    语言 = ENGINE.available_languages()
    返回render_template( “index.html” ，languages=languages)


def _parse_payload （）：
 
    有效载荷=请求.get_json（强制=真）
    prompt = payload.get( “提示” ，“” )
    语言=有效载荷.获取（“语言” ，[]）
    创造力 = float （payload.get（"创造力" ，0.5 ））
    返回提示、语言、创造力


def _serialize_analysis （分析）：
 
    返回{
        “检测到的语言” ：分析.检测到的语言，
        “detected_language_code” ：分析.detected_language_code，
        “优化提示” ：分析.优化提示，
        “关键词” ：分析.关键词，
        “expanded_prompt” ：分析.expanded_prompt，
        “翻译” ：分析.翻译，
        “建议” ：分析.建议，
    }


@app.post( “/api/process” )
def process_prompt （）：
 
    提示、语言、创造力 = _parse_payload()

    分析 = ENGINE.process_prompt（提示，语言，创造力）

    返回jsonify（_serialize_analysis（分析））


@app.post( “/api/expand” )
def expand_prompt （）：
 
    提示，_语言，创造力 = _parse_payload()

    分析 = ENGINE.process_prompt（提示，[]，创造力）

    有效载荷=_serialize_analysis（分析）
    有效载荷[ “翻译” ] = {}
    返回jsonify（有效载荷）


@app.post( “/api/翻译” )
def translate_prompt （）：
 
    提示、语言、创造力 = _parse_payload()

    分析 = ENGINE.process_prompt（提示，语言，创造力）

    有效载荷=_serialize_analysis（分析）
    返回jsonify（有效载荷）


如果__name__ == "__main__" ：
    app.run（主机= “0.0.0.0” ，端口= 5000 ，调试= True ）
