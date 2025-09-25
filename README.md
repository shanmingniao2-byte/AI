# AI Prompt Enhancer

一个使用 Python (Flask) 编写的网页应用，用于帮助创作者优化 AI 绘图提示词。核心功能包括：

- 对原始提示词进行结构化整理并优化关键字顺序；
- 根据关键词提供提示词扩写与场景关键词建议；
- 输出多语言互译矩阵（英文、中文、西班牙语、法语、日语），便于跨语言协作；
- 基于关键词类别给出灯光、镜头、情绪和风格的推荐修饰词。

## 本地运行

以下步骤在 Windows、macOS 与大多数 Linux 发行版上均适用。每个步骤都列出了所需软件、打开方式与验证命令，便于初学者参考。

1. **准备命令行工具**

   | 操作系统 | 需要的软件 | 打开方式 |
   | --- | --- | --- |
   | Windows 10/11 | PowerShell（系统自带） | 在“开始菜单”搜索 **PowerShell** → 右键“以管理员身份运行” |
   | Windows（可选） | Windows Terminal | [Microsoft Store](https://aka.ms/terminal) 安装 → 打开后选择 PowerShell 选项卡 |
   | macOS | 终端 Terminal（系统自带） | 按 `Command + Space` 搜索 **Terminal** → 回车打开 |
   | Ubuntu / Debian 等 | GNOME Terminal 或其它终端 | `Ctrl + Alt + T` |
   | CentOS / Fedora 等 | GNOME Terminal 或其它终端 | `Super` 键打开应用列表 → 搜索 **Terminal** |

2. **安装必备软件**

   | 软件 | 用途 | 安装方式 |
   | --- | --- | --- |
   | Python 3.9+ | 运行后端、虚拟环境和依赖 | [官方下载页面](https://www.python.org/downloads/)。Windows 安装时勾选 “Add Python to PATH”；macOS 可使用 [Homebrew](https://brew.sh) 执行 `brew install python@3.11`；Linux 可使用发行版包管理器，例如 `sudo apt install python3 python3-venv python3-pip` |
   | Git | 克隆仓库或管理代码 | [Git 下载页面](https://git-scm.com/downloads)。macOS 可执行 `brew install git`，Linux 例如 `sudo apt install git` |
   | 文本编辑器（可选） | 查看或修改代码 | 推荐 [VS Code](https://code.visualstudio.com/)，安装后用“打开文件夹”指向仓库目录 |

   > 验证安装：在命令行执行 `python --version`（或 `python3 --version`）、`git --version`，确认输出版本号且无报错。

3. **获取项目代码**

   - **使用 Git 克隆（推荐）**

     1. 打开合适的 Git 终端工具：
        - Windows：可使用安装 Git 时附带的 **Git Bash**，或在 PowerShell 中执行 Git 命令。
        - macOS / Linux：使用系统终端即可。
     2. 在终端中定位到希望保存项目的目录，例如 `cd ~/Projects`。
     3. 执行以下命令克隆仓库并进入目录：

        ```bash
        git clone https://github.com/<your-account>/AI.git
        cd AI
        ```

     4. 通过 `ls`（Windows 为 `dir`）确认目录中存在 `app.py`、`templates` 等文件。

   - **通过浏览器下载 ZIP 压缩包**

     1. 打开常用浏览器（Chrome、Edge、Safari 或 Firefox 均可），访问仓库网页 `https://github.com/<your-account>/AI`。
     2. 点击页面右上角的绿色 **Code** 按钮，在弹出的菜单中选择 **Download ZIP**，浏览器会将压缩包保存到默认下载目录。
     3. 使用操作系统自带的压缩工具解压：
        - Windows：右键压缩包 → “全部提取” → 选择解压路径。
        - macOS：双击压缩包自动解压。
        - Linux：可在文件管理器中右键解压，或在终端执行 `unzip AI-main.zip`。
     4. 返回命令行，使用 `cd` 切换到解压后的目录，例如：

        ```bash
        cd ~/Downloads/AI-main
        ```

     5. 同样可使用 `ls`/`dir` 核对目录内容是否完整。

4. **创建并启用虚拟环境**

   | 操作系统 | 创建命令 | 激活命令 |
   | --- | --- | --- |
   | macOS / Linux | `python3 -m venv .venv` | `source .venv/bin/activate` |
   | Windows PowerShell | `py -3 -m venv .venv` | `.\.venv\Scripts\Activate.ps1` |

   激活成功后，命令行提示前会出现 `(.venv)`。若在 Windows 出现执行策略限制，可在 PowerShell 以管理员身份运行 `Set-ExecutionPolicy RemoteSigned` 并选择 `Y`，之后重新执行激活命令。

5. **安装依赖**

   在已经激活的虚拟环境中运行：

   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

   安装结束后可用 `pip list` 确认依赖是否正确安装。

6. **启动 Flask 开发服务器**

   - **方式 A：使用 Flask CLI**

     | 操作系统 | 启动命令 |
     | --- | --- |
     | macOS / Linux | `flask --app app run --debug` |
     | Windows PowerShell | `$env:FLASK_APP = "app"` 然后执行 `flask run --debug` |

   - **方式 B：直接运行脚本（跨平台通用）**

     ```bash
     python app.py
     ```

   如果提示找不到 `flask` 命令，请确认虚拟环境已激活。

7. **访问与停止应用**

   - 终端输出 `Running on http://127.0.0.1:5000`（或 `http://localhost:5000`）后，打开浏览器（Chrome、Edge、Safari 等）访问该地址即可看到网页界面。
   - 停止服务：切换到运行服务器的终端窗口，按 `Ctrl + C`。Windows PowerShell 会提示是否终止批处理，输入 `Y` 回车。
   - 再次启动时重复步骤 6；若关闭终端或重启电脑，需先执行步骤 1、3、4 重新进入项目和虚拟环境。

## 自定义词库

- `prompt_engine.py` 中的 `TRANSLATION_MEMORY`、`SYNONYM_MAP`、`SCENE_KEYWORD_EXPANSIONS` 与 `CATEGORY_SUGGESTIONS` 可根据业务需求扩展。
- 将更多与图像生成相关的关键词加入词库可以提升优化与互译效果。

## 注意事项

本项目示例使用启发式方法和离线词库，适合在无法联网的环境中演示流程。若要接入更强大的 AI 模型或在线翻译服务，可在 `PromptEngine` 中扩展对应逻辑。
