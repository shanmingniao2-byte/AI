# AI Prompt Enhancer

一个使用 Python (Flask) 编写的网页应用，用于帮助创作者优化 AI 绘图提示词。核心功能包括：

- 对原始提示词进行结构化整理并优化关键字顺序；
- 根据关键词提供语义扩写建议；
- 多语言翻译（英文、中文、西班牙语、法语、日语）的提示词输出；
- 基于关键词类别给出灯光、镜头、情绪和风格的推荐修饰词。

## 本地运行

以下步骤在 Windows、macOS 与大多数 Linux 发行版上均适用，只需根据自己系统的命令行工具选择对应的激活命令即可。

1. **准备工作**

   - 安装 [Python 3.9+](https://www.python.org/downloads/)，安装时勾选 “Add Python to PATH”（Windows）。
   - 安装 [Git](https://git-scm.com/downloads)，用于克隆项目（也可直接下载压缩包）。

2. **获取项目代码**

   ```bash
   git clone https://github.com/<your-account>/AI.git
   cd AI
   ```

   > 如果是下载压缩包，解压后用终端/PowerShell/cmd 切换到项目根目录。

3. **创建并启用虚拟环境**

   - macOS / Linux（bash 或 zsh）：

     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

   - Windows（PowerShell）：

     ```powershell
     py -3 -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```

   激活成功后，命令行前缀会出现 `(.venv)`。

4. **安装依赖**

   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

5. **启动 Flask 开发服务器**

   - **推荐方式（使用 Flask 命令）**

     - macOS / Linux：

       ```bash
       flask --app app run --debug
       ```

     - Windows（PowerShell）：

       ```powershell
       $env:FLASK_APP = "app"
       flask run --debug
       ```

   - **或直接运行应用脚本**（跨平台通用）：

     ```bash
     python app.py
     ```

6. **访问应用**

   当终端显示 `Running on http://127.0.0.1:5000` 或类似信息时，打开浏览器输入该地址即可体验 AI 提示词增强工具。

> 若需要停止服务，返回到运行服务器的终端窗口并按下 `Ctrl + C`。

## 自定义词库

- `prompt_engine.py` 中的 `TRANSLATION_MEMORY`、`SYNONYM_MAP` 和 `CATEGORY_SUGGESTIONS` 可根据业务需求扩展。
- 将更多与图像生成相关的关键词加入词库可以提升优化和翻译效果。

## 注意事项

本项目示例使用启发式方法和离线词库，适合在无法联网的环境中演示流程。若要接入更强大的 AI 模型或在线翻译服务，可在 `PromptEngine` 中扩展对应逻辑。
