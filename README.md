# AI Prompt Enhancer

一个使用 Python (Flask) 编写的网页应用，用于帮助创作者优化 AI 绘图提示词。核心功能包括：

- 对原始提示词进行结构化整理并优化关键字顺序；
- 根据关键词提供语义扩写建议；
- 多语言翻译（英文、中文、西班牙语、法语、日语）的提示词输出；
- 基于关键词类别给出灯光、镜头、情绪和风格的推荐修饰词。

## 本地运行

1. 创建虚拟环境并安装依赖：

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. 启动 Flask 开发服务器：

   - **推荐方式（使用 Flask 命令）**

     ```bash
     flask --app app run --debug
     ```

   - **或直接运行应用脚本**

     ```bash
     python app.py
     ```

   在 Windows PowerShell 中，若使用 Flask 命令，请先执行：

   ```powershell
   $env:FLASK_APP = "app"
   flask run --debug
   ```

3. 当终端显示服务器已启动后，打开浏览器访问 `http://127.0.0.1:5000` 即可使用应用。

## 自定义词库

- `prompt_engine.py` 中的 `TRANSLATION_MEMORY`、`SYNONYM_MAP` 和 `CATEGORY_SUGGESTIONS` 可根据业务需求扩展。
- 将更多与图像生成相关的关键词加入词库可以提升优化和翻译效果。

## 注意事项

本项目示例使用启发式方法和离线词库，适合在无法联网的环境中演示流程。若要接入更强大的 AI 模型或在线翻译服务，可在 `PromptEngine` 中扩展对应逻辑。
