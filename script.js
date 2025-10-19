// 预处理文本函数
function preprocessText(text) {
    if (!text) return '';
    
    // 去除文本两端的空白字符
    let processedText = text.trim();
    
    // 将多个连续的空格替换为单个空格
    processedText = processedText.replace(/\s+/g, ' ');
    
    // 将多个连续的换行符替换为单个换行符
    processedText = processedText.replace(/\n+/g, '\n');
    
    // 移除特殊字符，保留基本标点符号
    processedText = processedText.replace(/[^\w\s\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af.,!?;:'"()\[\]{}\/@#$%^&*+=<>~`|-]/g, '');
    
    return processedText;
}

// DOM元素 - 获取页面上的各种UI元素
// API密钥相关DOM元素
const apiKeyInput = document.getElementById('api-key-input'); // API密钥输入框
const saveApiKeyBtn = document.getElementById('save-api-key-btn'); // 保存API密钥按钮
const apiKeyToggleBtn = document.getElementById('api-key-toggle-btn'); // API密钥设置弹窗触发按钮
const apiKeyModal = document.getElementById('api-key-modal'); // API密钥设置弹窗
const closeApiKeyModalBtn = document.querySelector('.close-api-key-modal'); // 关闭API密钥弹窗按钮

// Gemini API密钥相关DOM元素
const geminiApiKeyInput = document.getElementById('gemini-api-key-input'); // Gemini API密钥输入框
const saveGeminiApiKeyBtn = document.getElementById('save-gemini-api-key-btn'); // 保存Gemini API密钥按钮

// 翻译功能相关DOM元素
const sourceLanguageSelect = document.getElementById('source-language'); // 源语言选择器
const targetLanguageSelect = document.getElementById('target-language'); // 目标语言选择器
const swapLanguagesBtn = document.getElementById('swap-languages'); // 交换源语言和目标语言按钮
const sourceTextInput = document.getElementById('source-text'); // 源文本输入框
const charCountSpan = document.getElementById('char-count'); // 字符计数显示元素
const translateBtn = document.getElementById('translate-btn'); // 翻译按钮
const translationOutputTextarea = document.getElementById('translation-output'); // 翻译结果输出框
const copyTranslationBtn = document.getElementById('copy-translation'); // 复制翻译结果按钮
const modelSelect = document.getElementById('model-select'); // 模型选择器

// 扩写功能相关DOM元素
const expandToggleBtn = document.getElementById('expand-toggle'); // 扩写模式切换按钮

// 提示词库相关DOM元素
const promptLibraryToggleBtn = document.getElementById('prompt-library-toggle'); // 提示词库弹窗触发按钮
const promptLibraryModal = document.getElementById('prompt-library-modal'); // 提示词库弹窗
const closePromptLibraryBtn = document.querySelector('.close-modal'); // 关闭提示词库弹窗按钮
const promptCategories = document.querySelectorAll('.category-pane'); // 所有提示词分类面板

// 主题切换相关DOM元素
const themeToggleBtn = document.getElementById('theme-toggle-btn'); // 主题切换按钮
const sunIcon = document.querySelector('.sun-icon'); // 太阳图标（白天模式）
const moonIcon = document.querySelector('.moon-icon'); // 月亮图标（夜间模式）

// 反向提示词相关DOM元素
const negativePromptText = document.getElementById('negative-prompt-text'); // 反向提示词输入框
const clearNegativePromptBtn = document.getElementById('clear-negative-prompt'); // 清除反向提示词按钮
const copyNegativePromptBtn = document.getElementById('copy-negative-prompt'); // 复制反向提示词按钮
const generateNegativePromptBtn = document.getElementById('generate-negative-prompt'); // 生成反向提示词按钮

// 清除按钮相关DOM元素
const clearSourceBtn = document.getElementById('clear-source-text'); // 清除源文本按钮
const clearTranslationBtn = document.getElementById('clear-translation'); // 清除翻译结果按钮

// 图片反推提示词功能相关DOM元素
const imageUploadArea = document.getElementById('image-upload-area'); // 图片上传区域
const imageInput = document.getElementById('image-input'); // 图片文件输入元素
const imagePreviewContainer = document.getElementById('image-preview-container'); // 图片预览容器
const previewImage = document.getElementById('preview-image'); // 预览图片元素
const removeImageBtn = document.getElementById('remove-image-btn'); // 移除图片按钮
const analyzeImageBtn = document.getElementById('analyze-image-btn'); // 分析图片按钮
const imagePromptOutput = document.getElementById('image-prompt-output'); // 图片提示词输出框
const copyPromptBtn = document.getElementById('copy-prompt-btn'); // 复制提示词按钮
const expandPromptBtn = document.getElementById('expand-prompt-btn'); // 扩写提示词按钮
const usePromptBtn = document.getElementById('use-prompt-btn'); // 使用提示词按钮
const promptCharCounter = document.getElementById('prompt-char-counter'); // 提示词字符计数器
const imageModelSelect = document.getElementById('image-model-select'); // 图片模型选择器

// 全局变量 - 存储应用状态和数据
let apiKey = localStorage.getItem('glm-api-key') || ''; // 从本地存储获取API密钥
let geminiApiKey = localStorage.getItem('gemini-api-key') || ''; // 从本地存储获取Gemini API密钥
let isExpandMode = localStorage.getItem('expand-mode') === 'true'; // 扩写模式状态
let originalText = ''; // 存储扩写前的原始文本
let expandedText = ''; // 存储扩写后的文本
let isShowingExpanded = false; // 当前是否显示扩写后的文本
let isDarkMode = localStorage.getItem('dark-mode') === 'true'; // 深色模式状态
let selectedPrompts = new Set(); // 存储已选中的提示词
let uploadedImageData = null; // 存储上传的图片数据

// 初始化函数 - 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 如果存在API密钥，则设置到输入框中
    if (apiKey) {
        apiKeyInput.value = apiKey;
    }
    
    // 如果存在Gemini API密钥，则设置到输入框中
    if (geminiApiKey) {
        geminiApiKeyInput.value = geminiApiKey;
    }

    // 初始化UI组件和数据
    updateCharCount(); // 更新字符计数
    updateExpandButtonState(); // 更新扩写按钮状态
    updatePromptCharCount(); // 初始化提示词字数统计

    // 设置默认语言选择
    if (sourceLanguageSelect.value === 'auto' && targetLanguageSelect.value === 'zh') {
        targetLanguageSelect.value = 'en';
    }

    // 初始化扩写模式
    if (isExpandMode) {
        expandToggleBtn.classList.add('active');
    }

    // 初始化翻译结果文本框
    translationOutputTextarea.removeAttribute('readonly');

    // 初始化提示词库
    initPromptLibrary();

    // 初始化主题模式
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    // 初始化拖放目标功能
    initDropTargets();

    // 清除按钮事件监听
    clearSourceBtn.addEventListener('click', () => {
        sourceTextInput.value = ''; // 清空源文本输入框
        // 重置扩写按钮状态
        isShowingExpanded = false;
        expandToggleBtn.classList.remove('active');
        expandToggleBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                <path d="M2 17L12 22L22 17"></path>
                <path d="M2 12L12 17L22 12"></path>
            </svg>
            扩写
        `;
        updateCharCount(); // 更新字符计数
        showNotification('已清除翻译文本', 'success'); // 显示成功通知
    });

    // 清除翻译结果按钮事件
    clearTranslationBtn.addEventListener('click', () => {
        translationOutputTextarea.value = ''; // 清空翻译结果
        showNotification('已清除翻译结果', 'success'); // 显示成功通知
    });

    // 清除反向提示词按钮事件
    clearNegativePromptBtn.addEventListener('click', () => {
        negativePromptText.value = ''; // 清空反向提示词
        showNotification('已清除反向提示词', 'success'); // 显示成功通知
    });

    // 生成反向提示词按钮事件
    generateNegativePromptBtn.addEventListener('click', () => {
        const sourceText = sourceTextInput.value.trim();
        if (!sourceText) {
            showNotification('请先输入要翻译的文本', 'error');
            return;
        }
        generateNegativePrompt(sourceText);
    });

    // API密钥弹窗事件
    apiKeyToggleBtn.addEventListener('click', () => {
        apiKeyModal.classList.add('show'); // 显示API密钥设置弹窗
    });

    closeApiKeyModalBtn.addEventListener('click', () => {
        apiKeyModal.classList.remove('show'); // 关闭API密钥设置弹窗
    });

    // 点击弹窗外部关闭弹窗
    window.addEventListener('click', (e) => {
        if (e.target === apiKeyModal) {
            apiKeyModal.classList.remove('show'); // 点击弹窗外部区域关闭弹窗
        }
    });

    // 图片反推提示词功能事件监听器
    imageUploadArea.addEventListener('click', () => {
        imageInput.click(); // 点击上传区域触发文件选择对话框
    });
    imageInput.addEventListener('change', handleImageUpload); // 文件选择变化时处理上传
    removeImageBtn.addEventListener('click', removeImage); // 移除已上传的图片
    analyzeImageBtn.addEventListener('click', analyzeImage); // 分析图片并生成提示词
    copyPromptBtn.addEventListener('click', copyImagePrompt); // 复制生成的提示词
    expandPromptBtn.addEventListener('click', expandImagePrompt); // 扩写生成的提示词
    usePromptBtn.addEventListener('click', useImagePrompt); // 使用生成的提示词填充到输入框

    // 添加提示词输入事件监听器，实时更新字数统计
    imagePromptOutput.addEventListener('input', updatePromptCharCount);

    // 添加拖放功能
    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.classList.add('dragover'); // 添加拖动悬停样式
    });
    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.classList.remove('dragover'); // 移除拖动悬停样式
    });
    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('dragover'); // 移除拖动悬停样式
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) { // 检查是否为图片文件
            handleImageFile(files[0]); // 处理拖放的图片文件
        }
    });
});

// 主题切换功能
themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode; // 切换主题模式状态
    localStorage.setItem('dark-mode', isDarkMode); // 保存主题模式设置到本地存储

    if (isDarkMode) {
        document.body.classList.add('dark-mode'); // 应用深色模式样式
        sunIcon.style.display = 'none'; // 隐藏太阳图标
        moonIcon.style.display = 'block'; // 显示月亮图标
        showNotification('已切换到夜间模式', 'success'); // 显示成功通知
    } else {
        document.body.classList.remove('dark-mode'); // 移除深色模式样式
        sunIcon.style.display = 'block'; // 显示太阳图标
        moonIcon.style.display = 'none'; // 隐藏月亮图标
        showNotification('已切换到白天模式', 'success'); // 显示成功通知
    }
});

// 保存API密钥功能
saveApiKeyBtn.addEventListener('click', () => {
    const newApiKey = apiKeyInput.value.trim(); // 获取输入的API密钥并去除两端空格
    if (newApiKey) {
        apiKey = newApiKey; // 更新API密钥变量
        localStorage.setItem('glm-api-key', apiKey); // 保存API密钥到本地存储
        showNotification('智谱AI API密钥已保存', 'success'); // 显示成功通知
    } else {
        showNotification('请输入有效的API密钥', 'error'); // 显示错误通知
    }
});

// 保存Gemini API密钥功能
saveGeminiApiKeyBtn.addEventListener('click', () => {
    const newGeminiApiKey = geminiApiKeyInput.value.trim(); // 获取输入的Gemini API密钥并去除两端空格
    if (newGeminiApiKey) {
        geminiApiKey = newGeminiApiKey; // 更新Gemini API密钥变量
        localStorage.setItem('gemini-api-key', geminiApiKey); // 保存Gemini API密钥到本地存储
        showNotification('Gemini API密钥已保存', 'success'); // 显示成功通知
    } else {
        showNotification('请输入有效的Gemini API密钥', 'error'); // 显示错误通知
    }
});

// 交换语言功能
swapLanguagesBtn.addEventListener('click', () => {
    const sourceLang = sourceLanguageSelect.value; // 获取当前源语言
    const targetLang = targetLanguageSelect.value; // 获取当前目标语言

    // 如果源语言是自动检测，则不能交换
    if (sourceLang === 'auto') {
        showNotification('自动检测语言不能交换', 'error'); // 显示错误通知
        return;
    }

    // 交换语言选择
    sourceLanguageSelect.value = targetLang;
    targetLanguageSelect.value = sourceLang;

    // 同时交换文本内容
    const sourceText = sourceTextInput.value;
    const resultText = translationOutputTextarea.value;

    if (sourceText && resultText && resultText !== '翻译结果将显示在这里...') {
        sourceTextInput.value = resultText; // 将结果文本设为源文本
        translationOutputTextarea.value = sourceText; // 将源文本设为结果文本
        updateCharCount(); // 更新字符计数
    }
});

// 更新字符计数功能
sourceTextInput.addEventListener('input', updateCharCount);

function updateCharCount() {
    const count = sourceTextInput.value.length; // 获取源文本输入框的字符数
    charCountSpan.textContent = count; // 更新字符计数显示

    // 根据字符数设置样式和按钮状态
    if (count > 5000) {
        charCountSpan.style.color = '#f44336'; // 超过5000字符显示红色
        translateBtn.disabled = true; // 禁用翻译按钮
    } else {
        charCountSpan.style.color = '#777'; // 否则使用默认颜色
        translateBtn.disabled = false; // 启用翻译按钮
    }

    // 更新扩写按钮状态
    updateExpandButtonState();
}

// 更新扩写按钮状态功能
function updateExpandButtonState() {
    const currentText = sourceTextInput.value.trim(); // 获取当前输入文本并去除两端空格

    if (!currentText) {
        // 没有文本时禁用扩写按钮
        expandToggleBtn.disabled = true; // 禁用按钮
        expandToggleBtn.classList.add('disabled'); // 添加禁用样式
        expandToggleBtn.title = '请先输入文本再使用扩写功能'; // 设置提示文本
    } else {
        // 有文本时启用扩写按钮
        expandToggleBtn.disabled = false; // 启用按钮
        expandToggleBtn.classList.remove('disabled'); // 移除禁用样式
        expandToggleBtn.title = 'AI扩写提示词'; // 设置提示文本
    }
}

// 翻译按钮点击事件
translateBtn.addEventListener('click', performTranslation);

// 回车键翻译（Ctrl+Enter）功能
sourceTextInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') { // 检测是否按下了Ctrl+Enter组合键
        performTranslation(); // 执行翻译功能
    }
});

// 扩写模式切换功能
expandToggleBtn.addEventListener('click', () => {
    // 如果按钮被禁用，则不执行任何操作
    if (expandToggleBtn.disabled) {
        return;
    }

    const currentText = sourceTextInput.value.trim(); // 获取当前输入文本并去除两端空格

    // 如果当前有文本，则切换显示原始文本和扩写后文本
    if (currentText) {
        if (isShowingExpanded) {
            // 当前显示扩写后文本，切换到原始文本
            sourceTextInput.value = originalText; // 恢复原始文本
            isShowingExpanded = false; // 更新状态标记
            expandToggleBtn.classList.remove('active'); // 移除激活状态样式
            expandToggleBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                    <path d="M2 17L12 22L22 17"></path>
                    <path d="M2 12L12 17L22 12"></path>
                </svg>
                扩写
            `;
            showNotification('已切换到原始文本', 'success'); // 显示成功通知
        } else {
            // 当前显示原始文本，如果有扩写后文本则切换到扩写后文本
            if (expandedText && originalText === currentText) {
                // 只有当当前文本与原始文本相同时，才切换到扩写文本
                sourceTextInput.value = expandedText; // 显示扩写文本
                isShowingExpanded = true; // 更新状态标记
                expandToggleBtn.classList.add('active'); // 添加激活状态样式
                expandToggleBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                        <path d="M2 17L12 22L22 17"></path>
                        <path d="M2 12L12 17L22 12"></path>
                    </svg>
                    原文
                `;
                showNotification('已切换到扩写文本', 'success'); // 显示成功通知
            } else {
                // 没有扩写后文本或当前文本已修改，执行扩写
                performExpansion();
            }
        }
    } else {
        // 没有文本，只是切换模式状态
        isExpandMode = !isExpandMode; // 切换扩写模式状态
        localStorage.setItem('expand-mode', isExpandMode); // 保存模式状态到本地存储

        if (isExpandMode) {
            expandToggleBtn.classList.add('active'); // 添加激活状态样式
            expandToggleBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                    <path d="M2 17L12 22L22 17"></path>
                    <path d="M2 12L12 17L22 12"></path>
                </svg>
                扩写模式
            `;
            showNotification('已开启扩写模式', 'success'); // 显示成功通知
        } else {
            expandToggleBtn.classList.remove('active'); // 移除激活状态样式
            expandToggleBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                    <path d="M2 17L12 22L22 17"></path>
                    <path d="M2 12L12 17L22 12"></path>
                </svg>
                扩写模式
            `;
            showNotification('已关闭扩写模式', 'success'); // 显示成功通知
        }
    }

    updateCharCount(); // 更新字符计数
});

// 执行扩写功能
async function performExpansion() {
    const sourceText = sourceTextInput.value.trim(); // 获取源文本并去除两端空格

    if (!sourceText) {
        showNotification('请输入要扩写的文本', 'error'); // 显示错误通知
        return;
    }

    if (!apiKey && !geminiApiKey) {
        showNotification('请先设置API密钥', 'error'); // 显示错误通知
        apiKeyInput.focus(); // 聚焦到API密钥输入框
        return;
    }

    // 获取当前选择的模型
    const model = modelSelect.value;
    
    // 检查当前选择的模型是否为Gemini模型
    const isGeminiModel = model.startsWith('gemini-');
    
    // 如果使用Gemini模型但没有Gemini API密钥，则提示用户
    if (isGeminiModel && !geminiApiKey) {
        showNotification('使用Gemini模型需要设置Gemini API密钥', 'error'); // 显示错误通知
        geminiApiKeyInput.focus(); // 聚焦到Gemini API密钥输入框
        return;
    }
    
    // 如果使用GLM模型但没有GLM API密钥，则提示用户
    if (!isGeminiModel && !apiKey) {
        showNotification('使用GLM模型需要设置智谱AI API密钥', 'error'); // 显示错误通知
        apiKeyInput.focus(); // 聚焦到API密钥输入框
        return;
    }

    // 保存原始文本
    originalText = sourceText;
    // 重置扩写状态，确保可以再次扩写
    isShowingExpanded = false;

    // 处理文本
    const processedText = preprocessText(sourceText);

    // 显示加载状态
    expandToggleBtn.disabled = true;
    expandToggleBtn.innerHTML = '<span class="loading"></span> 扩写中...';

    try {
        const sourceLang = sourceLanguageSelect.value; // 获取源语言选择
        
        // 检测输入文本的语言
        let detectedLanguage = sourceLang;
        if (sourceLang === 'auto') {
            // 简单的语言检测逻辑
            const text = sourceText.toLowerCase();
            const chineseRegex = /[\u4e00-\u9fa5]/;
            const englishRegex = /^[a-zA-Z\s\d\.\,\!\?\;\:\'\"\-\(\)\[\]\{\}\/\@\#\$\%\^\&\*\+\=\~\`\|\\]+$/;
            
            if (chineseRegex.test(text)) {
                detectedLanguage = 'zh'; // 检测为中文
            } else if (englishRegex.test(text) && text.length > 0) {
                detectedLanguage = 'en'; // 检测为英文
            }
            // 如果都不是，保持为auto，后续会使用默认处理
        }

        // 构建扩写提示
        let prompt = '';
        if (detectedLanguage === 'zh' || (sourceLang === 'auto' && detectedLanguage === 'auto')) {
            prompt = `请对以下AI文生图提示词进行专业扩写和丰富，使其更加详细和生动。请遵循以下指导原则：
1. 专注于主体描述：详细描述主要对象的外观、特征、姿态、表情等
2. 增强环境描述：添加合适的场景、背景、氛围等环境元素
3. 丰富视觉细节：增加颜色、光照、材质、纹理等视觉元素
4. 优化构图提示：添加视角、景深、构图方式等摄影术语
5. 添加风格元素：指定艺术风格、渲染风格、时代特征等
6. 保持提示词的有效性：确保所有添加的内容都有助于生成高质量图像
7. 避免无意义的描述：不要添加与图像生成无关的背景故事或解释性文字
8. 强调画面构成：明确描述画面中的主要元素和次要元素的布局关系
9. 强调色彩比重：详细说明画面中各种颜色的占比、分布和对比关系
10. 强调尺寸大小：明确指出人物、动物、物品等在画面中的相对尺寸和绝对尺寸
11. 强调画面优先性：明确指出画面中各元素的重要程度和视觉焦点，使用权重词（如：prominent, central, foreground, background）来表示
12. 重要要求：请务必使用中文进行扩写，不要使用英文或其他语言

请直接返回扩写后的中文提示词，不要添加任何解释或说明：

${processedText}`;
        } else if (detectedLanguage === 'en') {
            prompt = `Please professionally expand and enrich the following AI image generation prompt to make it more detailed and vivid. Please follow these guidelines:
1. Focus on subject description: Detail the appearance, features, posture, expression, etc. of the main subjects
2. Enhance environmental description: Add appropriate scenes, backgrounds, atmosphere, and other environmental elements
3. Enrich visual details: Increase colors, lighting, materials, textures, and other visual elements
4. Optimize composition prompts: Add perspective, depth of field, composition methods, and other photographic terms
5. Add style elements: Specify artistic style, rendering style, era characteristics, etc.
6. Maintain prompt effectiveness: Ensure all added content contributes to generating high-quality images
7. Avoid meaningless descriptions: Do not add background stories or explanatory text unrelated to image generation
8. Emphasize composition: Clearly describe the layout relationship between main and secondary elements in the image
9. Emphasize color proportions: Detail the proportion, distribution, and contrast relationship of various colors in the image
10. Emphasize size: Clearly indicate the relative and absolute sizes of people, animals, objects, etc. in the image
11. Emphasize priority: Clearly indicate the importance and visual focus of each element in the image, using weight words (such as: prominent, central, foreground, background)
12. [CRITICAL] Strict requirement: The expansion result must be 100% in English, absolutely no Chinese, Japanese, or other languages' words, letters, or characters
13. [SPECIAL NOTE] Do not include any non-English terms, even if they are commonly used in AI art prompts
14. [ABSOLUTELY FORBIDDEN] Do not include any form of non-English abbreviations, words, or mixed-language content

Please directly return the expanded English prompt without any explanation or description:

${processedText}`;
        } else {
            // 对于其他语言，使用通用模板，但强调使用相同语言
            const languageNames = {
                'ja': '日语',
                'ko': '韩语',
                'fr': '法语',
                'de': '德语',
                'es': '西班牙语',
                'ru': '俄语',
                'pt': '葡萄牙语',
                'it': '意大利语',
                'ar': '阿拉伯语'
            };
            
            const langName = languageNames[detectedLanguage] || detectedLanguage;
            
            prompt = `请对以下AI文生图提示词进行专业扩写和丰富，使其更加详细和生动。请遵循以下指导原则：
1. 专注于主体描述：详细描述主要对象的外观、特征、姿态、表情等
2. 增强环境描述：添加合适的场景、背景、氛围等环境元素
3. 丰富视觉细节：增加颜色、光照、材质、纹理等视觉元素
4. 优化构图提示：添加视角、景深、构图方式等摄影术语
5. 添加风格元素：指定艺术风格、渲染风格、时代特征等
6. 保持提示词的有效性：确保所有添加的内容都有助于生成高质量图像
7. 避免无意义的描述：不要添加与图像生成无关的背景故事或解释性文字
8. 强调画面构成：明确描述画面中的主要元素和次要元素的布局关系
9. 强调色彩比重：详细说明画面中各种颜色的占比、分布和对比关系
10. 强调尺寸大小：明确指出人物、动物、物品等在画面中的相对尺寸和绝对尺寸
11. 强调画面优先性：明确指出画面中各元素的重要程度和视觉焦点，使用权重词来表示
12. 【最重要】严格要求：扩写结果必须100%使用${langName}，绝对不能出现任何中文、英文或其他语言的单词、字母或字符
13. 【特别注意】即使是一些常见的技术术语也必须翻译成${langName}对应词汇
14. 【绝对禁止】不要在扩写结果中包含任何形式的非${langName}缩写、非${langName}单词或混合语言内容

请直接返回扩写后的${langName}提示词，不要添加任何解释或说明：

${processedText}`;
        }

        // 根据模型选择调用不同的API
        let response;
        if (isGeminiModel) {
            // 调用Gemini API
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 8192,
                        topP: 0.8,
                        topK: 40
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH", 
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_NONE"
                        }
                    ]
                })
            });
        } else {
            // 调用GLM API
            const requestBody = {
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 8192
            };
            
            // 如果是GLM-4.5模型，添加thinking参数
            if (model === 'glm-4.5') {
                requestBody.thinking = {
                    type: "enabled"  // 启用深度思考模式
                };
            }
            
            response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API错误响应:", errorData);
            throw new Error(errorData.error?.message || `请求失败，状态码: ${response.status}`);
        }

        const data = await response.json();
        console.log("API成功响应:", data);
        let expandedResult;
        
        if (isGeminiModel) {
            // 处理Gemini API响应，添加更详细的错误检查
            if (!data || typeof data !== 'object') {
                throw new Error('API返回的数据格式不正确: 响应不是有效对象');
            }
            
            if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
                throw new Error('API返回的数据格式不正确: 缺少candidates数组或数组为空');
            }
            
            if (!data.candidates[0].content || typeof data.candidates[0].content !== 'object') {
                throw new Error('API返回的数据格式不正确: 缺少content对象');
            }
            
            if (!data.candidates[0].content.parts || !Array.isArray(data.candidates[0].content.parts) || data.candidates[0].content.parts.length === 0) {
                throw new Error('API返回的数据格式不正确: 缺少parts数组或数组为空');
            }
            
            if (!data.candidates[0].content.parts[0] || typeof data.candidates[0].content.parts[0] !== 'object' || !data.candidates[0].content.parts[0].text) {
                throw new Error('API返回的数据格式不正确: 缺少text属性');
            }
            
            expandedResult = data.candidates[0].content.parts[0].text.trim();
        } else {
            // 处理GLM API响应，添加更详细的错误检查
            if (!data || typeof data !== 'object') {
                throw new Error('API返回的数据格式不正确: 响应不是有效对象');
            }
            
            if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
                throw new Error('API返回的数据格式不正确: 缺少choices数组或数组为空');
            }
            
            if (!data.choices[0].message || typeof data.choices[0].message !== 'object') {
                throw new Error('API返回的数据格式不正确: 缺少message对象');
            }
            
            if (!data.choices[0].message.content || typeof data.choices[0].message.content !== 'string') {
                throw new Error('API返回的数据格式不正确: 缺少content字符串');
            }
            
            expandedResult = data.choices[0].message.content.trim();
        }

        // 保存扩写后的文本
        expandedText = expandedResult;

        // 显示扩写后的文本
        sourceTextInput.value = expandedText;
        isShowingExpanded = true;
        expandToggleBtn.classList.add('active');

        // 更新按钮文本
        expandToggleBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                <path d="M2 17L12 22L22 17"></path>
                <path d="M2 12L12 17L22 12"></path>
            </svg>
            原文
        `;

        // 不再自动生成反向提示词，用户需要点击生成按钮

        showNotification('扩写成功', 'success');
    } catch (error) {
        console.error('扩写错误:', error);
        showNotification(`扩写失败: ${error.message}`, 'error');
    } finally {
        // 恢复按钮状态
        expandToggleBtn.disabled = false;
        expandToggleBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                <path d="M2 17L12 22L22 17"></path>
                <path d="M2 12L12 17L22 12"></path>
            </svg>
            扩写
        `;
    }
}

// 提示词库切换
promptLibraryToggleBtn.addEventListener('click', () => {
    if (promptLibraryModal.classList.contains('show')) {
        promptLibraryModal.classList.remove('show');
    } else {
        promptLibraryModal.classList.add('show');
    }
});

// 关闭提示词库
closePromptLibraryBtn.addEventListener('click', () => {
    promptLibraryModal.classList.remove('show');
});

// 点击模态框外部关闭提示词库
promptLibraryModal.addEventListener('click', function (event) {
    // 如果点击的是模态框本身（不是内容区域），则关闭提示词库
    if (event.target === promptLibraryModal) {
        promptLibraryModal.classList.remove('show');
    }
});

// 执行翻译
async function performTranslation() {
    const sourceText = sourceTextInput.value.trim();

    if (!sourceText) {
        showNotification('请输入要翻译的文本', 'error');
        return;
    }

    // 检查API密钥
    const model = modelSelect.value;
    let isGeminiModel = false;
    
    if (model.startsWith('gemini-')) {
        isGeminiModel = true;
        if (!geminiApiKey) {
            showNotification('请先设置Gemini API密钥', 'error');
            geminiApiKeyInput.focus();
            return;
        }
    } else {
        if (!apiKey) {
            showNotification('请先设置智谱AI API密钥', 'error');
            apiKeyInput.focus();
            return;
        }
    }

    // 处理文本
    const processedText = preprocessText(sourceText);

    // 显示加载状态
    translateBtn.disabled = true;
    translateBtn.innerHTML = '<span class="loading"></span> 翻译中...';
    translationOutputTextarea.value = '正在翻译中，请稍候...';

    try {
        const sourceLang = sourceLanguageSelect.value;
        const targetLang = targetLanguageSelect.value;

        // 构建翻译提示
        let prompt = '';

        // 语言映射
        const languageNames = {
            'zh': '中文',
            'en': '英文',
            'ja': '日语',
            'ko': '韩语',
            'fr': '法语',
            'de': '德语',
            'es': '西班牙语',
            'ru': '俄语',
            'pt': '葡萄牙语',
            'it': '意大利语',
            'ar': '阿拉伯语'
        };

        if (sourceLang === 'auto') {
            prompt = `请将以下文本翻译为${languageNames[targetLang]}。要求：翻译结果必须只包含${languageNames[targetLang]}，不允许出现任何其他语言的词汇、短语或句子。不要添加任何解释、说明或其他描述。只返回纯${languageNames[targetLang]}翻译结果：\n\n${processedText}`;
        } else {
            prompt = `请将以下${languageNames[sourceLang]}文本翻译为${languageNames[targetLang]}。要求：翻译结果必须只包含${languageNames[targetLang]}，不允许出现任何其他语言的词汇、短语或句子。不要添加任何解释、说明或其他描述。只返回纯${languageNames[targetLang]}翻译结果：\n\n${processedText}`;
        }

        let translatedText = '';
        
        if (isGeminiModel) {
            // 调用Gemini API
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 8192,
                        topP: 0.8,
                        topK: 40
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH", 
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_NONE"
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Gemini API错误响应:", errorData);
                throw new Error(errorData.error?.message || `请求失败，状态码: ${response.status}`);
            }

            const data = await response.json();
            console.log("Gemini翻译API成功响应:", data);
            
            // 从Gemini API响应中提取文本，添加更详细的错误检查
            if (!data || typeof data !== 'object') {
                throw new Error('API返回的数据格式不正确: 响应不是有效对象');
            }
            
            // 检查是否有promptFeedback，这通常表示内容被安全过滤器阻止
            if (data.promptFeedback && data.promptFeedback.blockReason) {
                throw new Error(`内容被安全过滤器阻止: ${data.promptFeedback.blockReason}`);
            }
            
            if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
                throw new Error('API返回的数据格式不正确: 缺少candidates数组或数组为空');
            }
            
            // 检查第一个candidate是否有finishReason，这表示生成是否完成
            if (data.candidates[0].finishReason && data.candidates[0].finishReason !== 'STOP') {
                throw new Error(`内容生成未正常完成，原因: ${data.candidates[0].finishReason}`);
            }
            
            if (!data.candidates[0].content || typeof data.candidates[0].content !== 'object') {
                throw new Error('API返回的数据格式不正确: 缺少content对象');
            }
            
            if (!data.candidates[0].content.parts || !Array.isArray(data.candidates[0].content.parts) || data.candidates[0].content.parts.length === 0) {
                // 尝试从其他可能的字段获取内容
                if (data.candidates[0].content.text) {
                    translatedText = data.candidates[0].content.text.trim();
                } else {
                    throw new Error('API返回的数据格式不正确: 缺少parts数组或数组为空');
                }
            } else {
                if (!data.candidates[0].content.parts[0] || typeof data.candidates[0].content.parts[0] !== 'object' || !data.candidates[0].content.parts[0].text) {
                    throw new Error('API返回的数据格式不正确: 缺少text属性');
                }
                
                translatedText = data.candidates[0].content.parts[0].text.trim();
            }
        } else {
            // 调用GLM API
            const requestBody = {
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.2,
                max_tokens: 8192
            };
            
            // 如果是GLM-4.5模型，添加thinking参数
            if (model === 'glm-4.5') {
                requestBody.thinking = {
                    type: "enabled"  // 启用深度思考模式
                };
            }
            
            const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `请求失败，状态码: ${response.status}`);
            }

            const data = await response.json();
            console.log("GLM翻译API成功响应:", data);
            
            // 从GLM API响应中提取文本，添加更详细的错误检查
            if (!data || typeof data !== 'object') {
                throw new Error('API返回的数据格式不正确: 响应不是有效对象');
            }
            
            if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
                throw new Error('API返回的数据格式不正确: 缺少choices数组或数组为空');
            }
            
            if (!data.choices[0].message || typeof data.choices[0].message !== 'object') {
                throw new Error('API返回的数据格式不正确: 缺少message对象');
            }
            
            if (!data.choices[0].message.content || typeof data.choices[0].message.content !== 'string') {
                throw new Error('API返回的数据格式不正确: 缺少content字符串');
            }
            
            translatedText = data.choices[0].message.content.trim();
        }

        // 显示翻译结果
        translationOutputTextarea.value = translatedText;
        copyTranslationBtn.style.display = 'block';

        // 添加到翻译历史
        addToHistory(sourceText, translatedText, sourceLang, targetLang);
        
        // 保存中英文对照关系，用于鼠标选中文本显示功能
        saveTranslationMapping(sourceText, translatedText, sourceLang, targetLang);

        showNotification('翻译成功', 'success');
    } catch (error) {
        console.error('翻译错误:', error);
        translationOutputTextarea.value = `翻译失败: ${error.message}`;
        showNotification(`翻译失败: ${error.message}`, 'error');
    } finally {
        // 恢复按钮状态
        translateBtn.disabled = false;
        translateBtn.textContent = '翻译';
    }
}

// 复制翻译结果
copyTranslationBtn.addEventListener('click', () => {
    const text = translationOutputTextarea.value;
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('已复制到剪贴板', 'success');
        })
        .catch(err => {
            console.error('复制失败:', err);
            showNotification('复制失败', 'error');
        });
});

// 显示通知
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 创建新通知
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // 自动隐藏通知
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return '刚刚';
    } else if (diffMins < 60) {
        return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
        return `${diffHours}小时前`;
    } else if (diffDays < 7) {
        return `${diffDays}天前`;
    } else {
        return date.toLocaleDateString();
    }
}

// HTML转义
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 初始化提示词库
function initPromptLibrary() {
    // 不清空全局选中的提示词集合，保留之前的选中状态

    // 初始化提示词项的选中状态
    document.querySelectorAll('.prompt-item').forEach(item => {
        // 获取中文部分的文本
        const zhElement = item.querySelector('.zh');
        const prompt = zhElement ? zhElement.textContent : item.getAttribute('data-prompt');

        // 检查文本框中是否包含该提示词（支持逗号分隔）
        if (prompt) {
            // 创建正则表达式，匹配逗号分隔的提示词
            const regex = new RegExp(`(^|,\\s*)${prompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(,\\s*|$)`);

            if (regex.test(sourceTextInput.value)) {
                // 如果文本框中包含该提示词，则设置为选中状态
                item.classList.add('selected');
                selectedPrompts.add(prompt);
            } else if (selectedPrompts.has(prompt)) {
                // 如果该提示词在选中集合中，但文本框中没有，则从选中集合中移除
                selectedPrompts.delete(prompt);
                item.classList.remove('selected');
            }
        }
    });

    // 分类标签点击事件
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            // 移除所有标签的active类
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            // 添加当前标签的active类
            this.classList.add('active');

            // 获取目标分类ID
            const targetCategory = this.getAttribute('data-category');

            // 隐藏所有分类内容
            document.querySelectorAll('.category-pane').forEach(category => {
                category.classList.remove('active');
                category.style.display = 'none';
            });

            // 显示目标分类内容
            const targetElement = document.getElementById(targetCategory);
            if (targetElement) {
                targetElement.classList.add('active');
                targetElement.style.display = 'block';
            }
        });
    });

    // 提示词项点击事件
    document.querySelectorAll('.prompt-item').forEach(item => {
        item.addEventListener('click', function () {
            // 获取中文部分的文本
            const zhElement = this.querySelector('.zh');
            const prompt = zhElement ? zhElement.textContent : this.getAttribute('data-prompt');

            if (prompt) {
                // 切换选中状态
                if (this.classList.contains('selected')) {
                    // 取消选中
                    this.classList.remove('selected');
                    selectedPrompts.delete(prompt);

                    // 从文本框中移除该提示词
                    const currentText = sourceTextInput.value;
                    // 处理逗号分隔的提示词
                    const regex = new RegExp(`\\s*,?\\s*${prompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*,?\\s*`, 'g');
                    sourceTextInput.value = currentText.replace(regex, ',').replace(/^,|,$/g, '').trim();
                    updateCharCount();

                    showNotification('已移除提示词', 'success');
                } else {
                    // 选中
                    this.classList.add('selected');
                    selectedPrompts.add(prompt);

                    // 将提示词添加到翻译输入框，用逗号分隔
                    if (sourceTextInput.value.trim() === '') {
                        sourceTextInput.value = prompt;
                    } else {
                        // 确保文本框末尾有逗号，然后添加新提示词
                        sourceTextInput.value = sourceTextInput.value.replace(/,\s*$/, '') + ', ' + prompt;
                    }
                    updateCharCount();

                    showNotification('已添加提示词', 'success');
                }
            }
        });

        // 添加拖拽功能
        item.draggable = true;

        item.addEventListener('dragstart', function (e) {
            // 获取英文部分的文本
            const enElement = this.querySelector('.en');
            const prompt = enElement ? enElement.textContent : this.getAttribute('data-prompt');

            // 存储拖拽数据
            e.dataTransfer.setData('text/plain', prompt);

            // 添加拖拽样式
            this.classList.add('dragging');

            // 设置拖拽效果
            e.dataTransfer.effectAllowed = 'copy';
        });

        item.addEventListener('dragend', function () {
            // 移除拖拽样式
            this.classList.remove('dragging');
        });
    });

    // 添加清空所有选中提示词的按钮
    const modalHeader = document.querySelector('.modal-header');

    // 检查是否已经存在清空选择按钮，如果存在则先移除
    const existingClearButton = document.querySelector('.clear-all-btn');
    if (existingClearButton) {
        existingClearButton.remove();
    }

    const clearButton = document.createElement('button');
    clearButton.textContent = '清空选择';
    clearButton.className = 'clear-all-btn';
    clearButton.style.marginLeft = '10px';
    clearButton.style.padding = '5px 10px';
    clearButton.style.backgroundColor = '#f1f3f4';
    clearButton.style.color = '#5f6368';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '4px';
    clearButton.style.cursor = 'pointer';
    clearButton.style.fontSize = '12px';

    clearButton.addEventListener('click', function () {
        // 从文本框中移除所有选中的提示词
        let currentText = sourceTextInput.value;
        selectedPrompts.forEach(prompt => {
            // 处理逗号分隔的提示词
            const regex = new RegExp(`\\s*,?\\s*${prompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*,?\\s*`, 'g');
            currentText = currentText.replace(regex, ',');
        });
        // 移除开头和结尾的逗号，并清理多余的逗号
        currentText = currentText.replace(/^,|,$/g, '').replace(/,+/g, ',').trim();
        sourceTextInput.value = currentText;
        updateCharCount();

        // 清空所有选中的提示词状态
        document.querySelectorAll('.prompt-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        selectedPrompts.clear();
        showNotification('已清空所有选中的提示词', 'success');
    });

    modalHeader.appendChild(clearButton);
}

// 生成反向提示词
async function generateNegativePrompt(inputText) {
    try {
        const model = modelSelect.value;
        let isGeminiModel = false;
        
        // 检查API密钥
        if (model.startsWith('gemini-')) {
            isGeminiModel = true;
            if (!geminiApiKey) {
                showNotification('请先设置Gemini API密钥', 'error');
                return;
            }
        } else {
            if (!apiKey) {
                showNotification('请先设置智谱AI API密钥', 'error');
                return;
            }
        }

        // 构建生成反向提示词的提示
        const negativePrompt = `请根据以下文本，生成一组合适的反向提示词（Negative Prompt）。反向提示词用于告诉AI不要生成什么样的内容。

请遵循以下指导原则：
1. 分析文本中的主要元素和风格
2. 生成需要避免的元素，这些元素应该是与高质量图像相悖的内容，而不是与文本内容相反的内容
3. 包括常见的图像质量问题（如模糊、低质量、变形等）
4. 包括与文本风格相悖的元素
5. 确保反向提示词全面且有效
6. 使用英文逗号分隔各个反向提示词
7. 只返回反向提示词，不要添加任何解释或说明
8. 重要：反向提示词必须全部使用英文，不能包含任何中文字符
9. 重要：不要生成与文本内容相反的提示词，而是生成需要避免的低质量、不相关或不当的内容

文本：
${inputText}`;

        let negativePromptResult = '';
        
        if (isGeminiModel) {
            // 调用Gemini API生成反向提示词
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: negativePrompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 8192
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `请求失败，状态码: ${response.status}`);
            }

            const data = await response.json();
            console.log("Gemini API成功响应:", data);

            // 从Gemini API响应中提取文本，添加错误检查
            if (!data || typeof data !== 'object') {
                throw new Error('API返回的数据格式不正确: 响应不是有效对象');
            }

            // 检查是否有promptFeedback，表示内容可能被安全过滤器阻止
            if (data.promptFeedback && data.promptFeedback.blockReason) {
                throw new Error(`内容被安全过滤器阻止: ${data.promptFeedback.blockReason}`);
            }

            if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
                throw new Error('API返回的数据格式不正确: 缺少candidates数组或数组为空');
            }

            if (!data.candidates[0].content || typeof data.candidates[0].content !== 'object') {
                throw new Error('API返回的数据格式不正确: 缺少content对象');
            }

            // 检查finishReason，确保生成完成
            if (data.candidates[0].finishReason && data.candidates[0].finishReason !== 'STOP') {
                console.warn(`生成未正常完成，finishReason: ${data.candidates[0].finishReason}`);
            }

            if (!data.candidates[0].content.parts || !Array.isArray(data.candidates[0].content.parts) || data.candidates[0].content.parts.length === 0) {
                // 尝试从content.text直接获取内容（某些响应格式可能不同）
                if (data.candidates[0].content.text && typeof data.candidates[0].content.text === 'string') {
                    negativePromptResult = data.candidates[0].content.text.trim();
                } else {
                    throw new Error('API返回的数据格式不正确: 缺少parts数组或数组为空');
                }
            } else {
                negativePromptResult = data.candidates[0].content.parts[0].text.trim();
            }
        } else {
            // 调用GLM API生成反向提示词
            const requestBody = {
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: negativePrompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 8192
            };
            
            // 如果是GLM-4.5模型，添加thinking参数
            if (model === 'glm-4.5') {
                requestBody.thinking = {
                    type: "enabled"  // 启用深度思考模式
                };
            }
            
            const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `请求失败，状态码: ${response.status}`);
            }

            const data = await response.json();
            // 从GLM API响应中提取文本，添加错误检查
            if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
                throw new Error('API返回的数据格式不正确');
            }
            negativePromptResult = data.choices[0].message.content.trim();
        }

        // 检查并移除中文字符
        const chineseRegex = /[\u4e00-\u9fa5]/g;
        if (chineseRegex.test(negativePromptResult)) {
            // 如果有中文字符，移除它们
            negativePromptResult = negativePromptResult.replace(chineseRegex, '').trim();
            
            // 移除可能产生的多余逗号和空格
            negativePromptResult = negativePromptResult.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '');
            
            // 如果结果为空，提供默认的反向提示词
            if (!negativePromptResult) {
                negativePromptResult = "blurry, low quality, distorted, deformed, ugly, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blurry, ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), out of frame, extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), Photoshop, video game, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eyed, blurry, bad anatomy, bad proportions, malformed limbs, cloned face, gross proportions, (malformed limbs), (missing arms), (missing legs), (extra arms), (extra legs), mutated hands, (fused fingers), (too many fingers), (long neck)";
            }
        }

        // 显示反向提示词
        const negativePromptContainer = document.querySelector('.negative-prompt-container');
        const negativePromptText = document.getElementById('negative-prompt-text');

        if (negativePromptContainer && negativePromptText) {
            negativePromptText.value = negativePromptResult;
            negativePromptContainer.classList.add('visible');
        }
    } catch (error) {
        console.error('生成反向提示词错误:', error);
        // 不显示错误通知，因为这不是主要功能
    }
}

// 复制反向提示词
document.addEventListener('DOMContentLoaded', () => {
    const copyNegativePromptBtn = document.getElementById('copy-negative-prompt');
    if (copyNegativePromptBtn) {
        copyNegativePromptBtn.addEventListener('click', () => {
            const negativePromptText = document.getElementById('negative-prompt-text');
            if (negativePromptText && negativePromptText.value) {
                navigator.clipboard.writeText(negativePromptText.value)
                    .then(() => {
                        showNotification('反向提示词已复制到剪贴板', 'success');
                    })
                    .catch(err => {
                        console.error('复制失败:', err);
                        showNotification('复制失败', 'error');
                    });
            }
        });
    }
});

// 确保复制反向提示词按钮的事件监听器在页面加载后也能正确设置
window.addEventListener('load', () => {
    const copyNegativePromptBtn = document.getElementById('copy-negative-prompt');
    if (copyNegativePromptBtn) {
        // 移除之前可能存在的事件监听器
        copyNegativePromptBtn.removeEventListener('click', copyNegativePromptHandler);
        // 添加新的事件监听器
        copyNegativePromptBtn.addEventListener('click', copyNegativePromptHandler);
    }
});

// 复制反向提示词的处理函数
function copyNegativePromptHandler() {
    const negativePromptText = document.getElementById('negative-prompt-text');
    if (negativePromptText && negativePromptText.value) {
        navigator.clipboard.writeText(negativePromptText.value)
            .then(() => {
                showNotification('反向提示词已复制到剪贴板', 'success');
            })
            .catch(err => {
                console.error('复制失败:', err);
                showNotification('复制失败', 'error');
            });
    }
}

// 初始化拖放目标功能
function initDropTargets() {
    // 为反向提示词文本框添加拖放功能
    if (negativePromptText) {
        negativePromptText.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            this.classList.add('drag-over');
        });

        negativePromptText.addEventListener('dragleave', function () {
            this.classList.remove('drag-over');
        });

        negativePromptText.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('drag-over');

            const prompt = e.dataTransfer.getData('text/plain');
            if (prompt) {
                // 将提示词添加到反向提示词文本框，用逗号分隔
                if (this.value.trim() === '') {
                    this.value = prompt;
                } else {
                    // 确保文本框末尾有逗号，然后添加新提示词
                    this.value = this.value.replace(/,\s*$/, '') + ', ' + prompt;
                }
                showNotification('已添加提示词到反向提示词', 'success');
            }
        });
    }

    // 为翻译文本框添加拖放功能
    if (sourceTextInput) {
        sourceTextInput.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            this.classList.add('drag-over');
        });

        sourceTextInput.addEventListener('dragleave', function () {
            this.classList.remove('drag-over');
        });

        sourceTextInput.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('drag-over');

            const prompt = e.dataTransfer.getData('text/plain');
            if (prompt) {
                // 将提示词添加到翻译文本框，用逗号分隔
                if (this.value.trim() === '') {
                    this.value = prompt;
                } else {
                    // 确保文本框末尾有逗号，然后添加新提示词
                    this.value = this.value.replace(/,\s*$/, '') + ', ' + prompt;
                }
                updateCharCount();
                showNotification('已添加提示词到翻译文本', 'success');
            }
        });
    }

    // 为结果文本框添加拖放功能
    if (translationOutputTextarea) {
        translationOutputTextarea.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            this.classList.add('drag-over');
        });

        translationOutputTextarea.addEventListener('dragleave', function () {
            this.classList.remove('drag-over');
        });

        translationOutputTextarea.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('drag-over');

            const prompt = e.dataTransfer.getData('text/plain');
            if (prompt) {
                // 将提示词添加到结果文本框，用逗号分隔
                if (this.value.trim() === '') {
                    this.value = prompt;
                } else {
                    // 确保文本框末尾有逗号，然后添加新提示词
                    this.value = this.value.replace(/,\s*$/, '') + ', ' + prompt;
                }
                showNotification('已添加提示词到结果文本框', 'success');
            }
        });
    }
}

// 图片反推提示词功能相关函数

// 处理图片上传
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageFile(file);
    } else {
        showNotification('请选择有效的图片文件', 'error');
    }
}

// 处理图片文件
function handleImageFile(file) {
    // 检查文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
        showNotification('图片大小不能超过5MB', 'error');
        return;
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        showNotification('请选择有效的图片文件', 'error');
        return;
    }

    console.log("开始处理图片文件:", file.name);
    console.log("文件类型:", file.type);
    console.log("文件大小:", file.size);

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            uploadedImageData = e.target.result;
            console.log("图片数据读取成功，数据长度:", uploadedImageData.length);
            console.log("图片数据前缀:", uploadedImageData.substring(0, 30));
            
            // 验证图片数据格式
            if (!uploadedImageData.startsWith('data:image/')) {
                throw new Error('图片数据格式不正确');
            }
            
            previewImage.src = uploadedImageData;
            imagePreviewContainer.style.display = 'flex';
            imageUploadArea.style.display = 'none';
            // 启用分析按钮
            analyzeImageBtn.disabled = false;
            showNotification('图片上传成功', 'success');
        } catch (error) {
            console.error('图片处理错误:', error);
            showNotification('图片处理失败: ' + error.message, 'error');
        }
    };
    
    reader.onerror = function() {
        console.error('文件读取错误');
        showNotification('图片读取失败', 'error');
    };
    
    reader.readAsDataURL(file);
}

// 移除图片
function removeImage() {
    uploadedImageData = null;
    imageInput.value = '';
    imagePreviewContainer.style.display = 'none';
    imageUploadArea.style.display = 'flex';
    imagePromptOutput.value = '';
    copyPromptBtn.style.display = 'none';
    usePromptBtn.style.display = 'none';
    updatePromptCharCount(); // 更新字数统计
    showNotification('已移除图片', 'success');
}

// 根据选择的模型生成对应的提示词
function generatePromptForModel(model) {
    const geminiPrompt = `Analyze this image comprehensively and generate a detailed prompt for image generation. Focus on these key aspects:
            
Main Subject: Clearly identify the primary subject(s) in the image.
Visual Characteristics: Describe appearance, texture, materials, and physical properties.
Artistic Style: Identify the artistic style, period, and visual techniques.
Environment & Context: Describe the setting, background, and spatial relationships.
Composition: Analyze the arrangement, framing, and visual flow.
Lighting & Shadows: Detail the lighting conditions and shadow effects.
Color Palette: Identify dominant colors and their relationships.
Mood & Emotion: Describe the emotional tone and atmosphere.
Technical Quality: Note resolution, clarity, and technical aspects.
Special Effects: Identify any visual effects or post-processing.
Narrative Elements: Describe any story or action depicted.
Symbolic Meaning: Identify symbolic or metaphorical elements.
Scale and Proportion: Analyze the relative sizes and proportions of elements.
Movement and Dynamics: Identify any sense of motion or dynamic elements.
Cultural and Historical Context: Determine cultural references and historical period.
Texture and Material Properties: Detail surface qualities and material characteristics.
Spatial Depth and Perspective: Analyze depth cues and perspective techniques.
Focal Points and Emphasis: Identify what draws the viewer's attention first.
Pattern and Repetition: Note any recurring visual elements or patterns.
Contextual Relationships: Explain how elements relate to each other contextually.
Biological Species: For living organisms, identify the specific species or type (animals, plants, insects, etc.).
Human Ethnicity and Racial Features: For human subjects, describe racial characteristics, ethnic features, and cultural identity markers.

Generate a detailed, structured prompt that captures these elements effectively for AI image generation. Use clear, descriptive language and prioritize the most visually significant aspects. There is no character limit - provide as much detail as needed for a comprehensive description. IMPORTANT: Do not use any numbered lists, bullet points, or prefixes in your response. Start directly with the description.`;

    const glmPrompt = `Please analyze this image in detail and create a structured prompt for image generation AI. Examine:

Primary Subject: What is the main focus of this image?
Appearance Details: Describe textures, materials, colors, and visual properties.
Style & Technique: What artistic style and techniques are used?
Setting & Background: Where is this scene taking place?
Composition: How are elements arranged in the frame?
Lighting: What are the lighting conditions and effects?
Color Scheme: What are the dominant colors and their relationships?
Atmosphere: What mood or emotion does the image convey?
Technical Aspects: What technical qualities are notable?
Effects: Are there any special visual effects?
Story: What narrative or action is shown?
Symbolism: What symbolic elements are present?
Proportions and Scale: How do the sizes of elements relate to each other?
Motion and Dynamics: Is there any sense of movement or action?
Cultural References: What cultural or historical elements are present?
Surface Qualities: What textures and material properties are visible?
Depth and Perspective: How is three-dimensional space represented?
Visual Hierarchy: What elements draw the most attention?
Patterns and Repetition: Are there repeating elements or patterns?
Element Relationships: How do different elements relate to each other?
Biological Identification: For living creatures, identify the species or biological classification.
Human Racial Characteristics: For people depicted, describe ethnic features, racial characteristics, and cultural identity indicators.

Create a detailed prompt that effectively describes these elements for AI image generation. Use clear, structured language and emphasize the most important visual aspects. There is no character limit - provide as much detail as needed for a comprehensive description. IMPORTANT: Do not use any numbered lists, bullet points, or prefixes in your response. Start directly with the description.`;

    // 根据模型类型返回对应的提示词
    if (model.includes('gemini') || model.includes('Gemini')) {
        return geminiPrompt;
    } else {
        return glmPrompt;
    }
}

// 分析图片并生成提示词
async function analyzeImage() {
    if (!uploadedImageData) {
        showNotification('请先上传图片', 'error');
        return;
    }

    // 检查API密钥
    if (!apiKey && !geminiApiKey) {
        showNotification('请先设置API密钥', 'error');
        apiKeyModal.classList.add('show');
        return;
    }

    // 获取当前选择的图片模型
    const currentModel = imageModelSelect.value;
    const isGeminiModel = currentModel.startsWith('gemini-');
    
    // 使用优化后的提示词生成函数
    const promptText = generatePromptForModel(currentModel);

    // 显示加载状态
    analyzeImageBtn.disabled = true;
    analyzeImageBtn.innerHTML = `
        <div class="loading-spinner"></div>
        分析中...
    `;

    try {
        // 验证图片数据是否存在
        if (!uploadedImageData) {
            throw new Error('没有可用的图片数据');
        }
        
        // 将图片转换为base64格式
        const base64Image = uploadedImageData.split(',')[1]; // 移除data:image/...;base64,前缀
        
        // 验证base64数据
        if (!base64Image || base64Image.length === 0) {
            throw new Error('图片数据转换失败');
        }
        
        // 添加调试日志
        console.log("图片分析开始");
        console.log("上传的图片数据长度:", uploadedImageData ? uploadedImageData.length : 0);
        console.log("Base64图片数据长度:", base64Image ? base64Image.length : 0);
        
        // 获取当前选择的图片模型
        const currentModel = imageModelSelect.value;
        const isGeminiModel = currentModel.startsWith('gemini-');
        
        console.log("选择的模型:", currentModel);
        console.log("是否为Gemini模型:", isGeminiModel);
        console.log("API密钥状态:", apiKey ? "已设置" : "未设置", geminiApiKey ? "Gemini已设置" : "Gemini未设置");

        let response;
        let promptResult;

        if (isGeminiModel) {
            // 检查Gemini API密钥
            if (!geminiApiKey) {
                showNotification('请先设置Gemini API密钥', 'error');
                apiKeyModal.classList.add('show');
                return;
            }

            // Gemini API调用
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: promptText
                                },
                                {
                                    inline_data: {
                                        mime_type: "image/jpeg",
                                        data: base64Image
                                    }
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 8192
                    }
                })
            });

            console.log("Gemini响应状态:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Gemini API错误响应:", errorData);
                throw new Error(errorData.error?.message || `请求失败，状态码: ${response.status}`);
            }

            const data = await response.json();
            console.log("Gemini API成功响应:", data);

            // 从Gemini API响应中提取文本，添加错误检查
            if (!data || typeof data !== 'object') {
                throw new Error('API返回的数据格式不正确: 响应不是有效对象');
            }

            // 检查是否有promptFeedback，表示内容可能被安全过滤器阻止
            if (data.promptFeedback && data.promptFeedback.blockReason) {
                throw new Error(`内容被安全过滤器阻止: ${data.promptFeedback.blockReason}`);
            }

            if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
                throw new Error('API返回的数据格式不正确: 缺少candidates数组或数组为空');
            }

            if (!data.candidates[0].content || typeof data.candidates[0].content !== 'object') {
                throw new Error('API返回的数据格式不正确: 缺少content对象');
            }

            // 检查finishReason，确保生成完成
            if (data.candidates[0].finishReason && data.candidates[0].finishReason !== 'STOP') {
                console.warn(`生成未正常完成，finishReason: ${data.candidates[0].finishReason}`);
            }

            if (!data.candidates[0].content.parts || !Array.isArray(data.candidates[0].content.parts) || data.candidates[0].content.parts.length === 0) {
                // 尝试从content.text直接获取内容（某些响应格式可能不同）
                if (data.candidates[0].content.text && typeof data.candidates[0].content.text === 'string') {
                    promptResult = data.candidates[0].content.text.trim();
                } else {
                    throw new Error('API返回的数据格式不正确: 缺少parts数组或数组为空');
                }
            } else {
                promptResult = data.candidates[0].content.parts[0].text.trim();
            }
        } else {
            // 检查GLM API密钥
            if (!apiKey) {
                showNotification('请先设置智谱AI API密钥', 'error');
                apiKeyModal.classList.add('show');
                return;
            }

            // GLM模型处理
            // 构建请求体 - 使用image_url格式
            const requestBody = {
                model: currentModel,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                "type": "text",
                                "text": promptText
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": uploadedImageData
                                }
                            }
                        ]
                    }
                ],
                temperature: 0.3,
                max_tokens: 8192  // 取消字节上限限制
            };
            
            // 如果是GLM-4.5模型，添加thinking参数
            if (currentModel === 'glm-4.5') {
                requestBody.thinking = {
                    type: "enabled"  // 启用深度思考模式
                };
            }

            console.log("图片分析请求:", JSON.stringify(requestBody, null, 2));

            // 调用GLM API
            response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            console.log("响应状态:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("GLM API错误响应:", errorData);
                console.error("错误详情:", JSON.stringify(errorData, null, 2));
                console.error("响应状态:", response.status);
                console.error("响应状态文本:", response.statusText);
                throw new Error(errorData.error?.message || `请求失败，状态码: ${response.status}`);
            }

            const data = await response.json();
            console.log("API成功响应:", data);
            console.log("响应数据类型:", typeof data);
            console.log("响应数据结构:", JSON.stringify(data, null, 2));

            // 从GLM API响应中提取文本，添加错误检查
            if (!data || typeof data !== 'object') {
                throw new Error('API返回的数据格式不正确: 响应不是有效对象');
            }

            if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
                throw new Error('API返回的数据格式不正确: 缺少choices数组或数组为空');
            }

            if (!data.choices[0] || typeof data.choices[0] !== 'object') {
                throw new Error('API返回的数据格式不正确: choices[0]不是有效对象');
            }

            if (!data.choices[0].message || typeof data.choices[0].message !== 'object') {
                throw new Error('API返回的数据格式不正确: 缺少message对象');
            }

            if (!data.choices[0].message.content || typeof data.choices[0].message.content !== 'string') {
                throw new Error('API返回的数据格式不正确: message.content不是有效字符串');
            }

            promptResult = data.choices[0].message.content.trim();
            
            // 检查生成的提示词是否为空
            if (!promptResult) {
                throw new Error('API返回的提示词内容为空');
            }
            
            console.log("生成的提示词长度:", promptResult.length);
        }

        // 处理生成的提示词，取消开头的分点格式及前缀
        function cleanPromptResult(text) {
            // 移除开头的数字编号和点号（如 "1. "、"1) "、"1、"等）
            text = text.replace(/^(\d+[\.\)\、]\s*)+/, '');
            
            // 移除开头的字母编号（如 "a. "、"A) "、"a、"等）
            text = text.replace(/^([a-zA-Z][\.\)\、]\s*)+/, '');
            
            // 移除开头的项目符号（如 "- "、"* "、"• "、"· "等）
            text = text.replace(/^[-*•·]\s*/, '');
            
            // 移除开头的罗马数字（如 "I. "、"II) "、"iii、"等）
            text = text.replace(/^([IVXivx]+[\.\)\、]\s*)+/, '');
            
            // 移除开头的常见前缀（如 "提示词："、"描述："、"图像："、"画面："、"场景："等）
            text = text.replace(/^(提示词|描述|图像|画面|场景|内容|元素|风格|构图|光影|色彩|氛围|主题|背景|细节|特征|表现|效果|呈现|展示|描绘|刻画|勾勒|渲染|营造|构建|设计|创作|生成|输出|结果)[:：]\s*/, '');
            
            // 移除开头的英文前缀（如 "Prompt:"、"Description:"、"Image:"、"Scene:"等）
            text = text.replace(/^(Prompt|Description|Image|Scene|Content|Elements|Style|Composition|Lighting|Color|Atmosphere|Theme|Background|Details|Features|Expression|Effect|Presentation|Display|Depiction|Portrayal|Outline|Rendering|Creation|Design|Generation|Output|Result)[:：]\s*/i, '');
            
            // 移除开头的引号和括号
            text = text.replace(/^["'""'()\[\]{}]\s*/, '');
            
            // 移除开头可能的多余空格和换行
            text = text.trim();
            
            return text;
        }
        
        // 清理生成的提示词
        promptResult = cleanPromptResult(promptResult);

        // 显示生成的提示词
        imagePromptOutput.value = promptResult;
        copyPromptBtn.style.display = 'block';
        expandPromptBtn.style.display = 'block';
        usePromptBtn.style.display = 'block';
        updatePromptCharCount(); // 更新字数统计
        showNotification('提示词生成成功', 'success');
    } catch (error) {
        console.error('图片分析错误:', error);
        console.error('错误堆栈:', error.stack);
        console.error('错误名称:', error.name);
        console.error('错误消息:', error.message);
        showNotification(`分析失败: ${error.message}`, 'error');
    } finally {
        // 恢复按钮状态
        if (typeof analyzeImageBtn !== 'undefined' && analyzeImageBtn) {
            analyzeImageBtn.disabled = false;
            analyzeImageBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                </svg>
                分析图片`
        };
    }
}

// 复制生成的提示词
function copyImagePrompt() {
    if (imagePromptOutput.value.trim() === '') {
        showNotification('没有可复制的提示词', 'error');
        return;
    }

    navigator.clipboard.writeText(imagePromptOutput.value)
        .then(() => {
            showNotification('提示词已复制到剪贴板', 'success');
        })
        .catch(err => {
            console.error('复制失败:', err);
            showNotification('复制失败', 'error');
        });
}

// 使用生成的提示词
function useImagePrompt() {
    if (imagePromptOutput.value.trim() === '') {
        showNotification('没有可使用的提示词', 'error');
        return;
    }

    // 将提示词直接覆盖到翻译文本框
    sourceTextInput.value = imagePromptOutput.value;

    // 重置扩写模式状态，防止自动切换回之前的文本
    originalText = imagePromptOutput.value;
    expandedText = '';
    isShowingExpanded = false;

    // 更新扩写按钮状态
    updateExpandButtonState();

    updateCharCount();
    showNotification('提示词已覆盖到翻译文本框', 'success');

    // 滚动到翻译区域
    document.querySelector('.translation-container').scrollIntoView({ behavior: 'smooth' });
}

// 更新提示词字数统计
function updatePromptCharCount() {
    const charCount = imagePromptOutput.value.length;
    promptCharCounter.textContent = `${charCount} 字`;
    
    // 移除字数限制，始终使用默认颜色
    promptCharCounter.style.color = '';
    promptCharCounter.removeAttribute('title');
}

// 存储中英文对照关系的数据结构
let englishChineseMapping = [];
// 调试模式标志，用于开发时查看详细信息
const DEBUG_MODE = true; // 设置为true可以看到调试日志

// 扩写图片生成的提示词
async function expandImagePrompt() {
    const originalPrompt = imagePromptOutput.value;
    if (!originalPrompt.trim()) {
        showNotification('没有可扩写的提示词', 'error');
        return;
    }

    // 检查API密钥
    if (!apiKey && !geminiApiKey) {
        showNotification('请先设置API密钥', 'error');
        apiKeyModal.classList.add('show');
        return;
    }

    // 显示加载状态
    analyzeImageBtn.disabled = true;
    analyzeImageBtn.innerHTML = '<span class="loading-spinner"></span> 扩写中...';
    expandPromptBtn.disabled = true;

    try {
        // 准备扩写提示词
        const expandPrompt = `请基于以下提示词进行扩写，添加更多细节、风格描述和创意元素，使其更加丰富和具体。保持原提示词的核心内容和意图不变，但添加更多细节描述、风格元素、光影效果、构图建议等，使其更适合用于高质量图像生成。扩写后的提示词应该更加详细和专业，但不要添加任何前缀或引导性语句，直接开始描述内容。

原提示词：
${originalPrompt}

请直接输出扩写后的提示词，不要添加任何前缀或解释。`;

        // 获取当前选择的模型
        const currentModel = modelSelect.value;
        const isGeminiModel = currentModel.startsWith('gemini-');

        let response;
        let expandedPrompt;

        if (isGeminiModel) {
            // 检查Gemini API密钥
            if (!geminiApiKey) {
                showNotification('请先设置Gemini API密钥', 'error');
                apiKeyModal.classList.add('show');
                return;
            }

            // Gemini API调用
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: expandPrompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 8192,
                        topP: 0.8,
                        topK: 40
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH", 
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_NONE"
                        }
                    ]
                })
            });

            console.log("Gemini扩写响应状态:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Gemini API错误响应:", errorData);
                throw new Error(errorData.error?.message || `请求失败，状态码: ${response.status}`);
            }

            const data = await response.json();
            console.log("Gemini扩写API成功响应:", data);

            // 从Gemini API响应中提取文本，添加更详细的错误检查
            if (!data || typeof data !== 'object') {
                throw new Error('API返回的数据格式不正确: 响应不是有效对象');
            }
            
            // 检查是否有promptFeedback，这通常表示内容被安全过滤器阻止
            if (data.promptFeedback && data.promptFeedback.blockReason) {
                throw new Error(`内容被安全过滤器阻止: ${data.promptFeedback.blockReason}`);
            }
            
            if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
                throw new Error('API返回的数据格式不正确: 缺少candidates数组或数组为空');
            }
            
            // 检查第一个candidate是否有finishReason，这表示生成是否完成
            if (data.candidates[0].finishReason && data.candidates[0].finishReason !== 'STOP') {
                throw new Error(`内容生成未正常完成，原因: ${data.candidates[0].finishReason}`);
            }
            
            if (!data.candidates[0].content || typeof data.candidates[0].content !== 'object') {
                throw new Error('API返回的数据格式不正确: 缺少content对象');
            }
            
            if (!data.candidates[0].content.parts || !Array.isArray(data.candidates[0].content.parts) || data.candidates[0].content.parts.length === 0) {
                // 尝试从其他可能的字段获取内容
                if (data.candidates[0].content.text) {
                    expandedPrompt = data.candidates[0].content.text.trim();
                } else {
                    throw new Error('API返回的数据格式不正确: 缺少parts数组或数组为空');
                }
            } else {
                if (!data.candidates[0].content.parts[0] || typeof data.candidates[0].content.parts[0] !== 'object' || !data.candidates[0].content.parts[0].text) {
                    throw new Error('API返回的数据格式不正确: 缺少text属性');
                }
                
                expandedPrompt = data.candidates[0].content.parts[0].text.trim();
            }
        } else {
            // 检查GLM API密钥
            if (!apiKey) {
                showNotification('请先设置智谱AI API密钥', 'error');
                apiKeyModal.classList.add('show');
                return;
            }

            // 调用GLM API进行扩写，使用glm-4-flash模型
            const requestBody = {
                model: 'glm-4-flash', // 使用固定的模型，避免依赖selectedModel变量
                messages: [
                    {
                        role: 'user',
                        content: expandPrompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 8192  // 取消字节上限限制
            };
            
            // 如果是GLM-4.5模型，添加thinking参数
            if (model === 'glm-4.5') {
                requestBody.model = 'glm-4.5'; // 使用GLM-4.5模型
                requestBody.thinking = {
                    type: "enabled"  // 启用深度思考模式
                };
            }
            
            response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            console.log("扩写响应状态:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API错误响应:", errorData);
                throw new Error(errorData.error?.message || `请求失败，状态码: ${response.status}`);
            }

            const data = await response.json();
            console.log("扩写API成功响应:", data);

            // 从GLM API响应中提取文本，添加更详细的错误检查
            if (!data || typeof data !== 'object') {
                throw new Error('API返回的数据格式不正确: 响应不是有效对象');
            }
            
            if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
                throw new Error('API返回的数据格式不正确: 缺少choices数组或数组为空');
            }
            
            if (!data.choices[0].message || typeof data.choices[0].message !== 'object') {
                throw new Error('API返回的数据格式不正确: 缺少message对象');
            }
            
            if (!data.choices[0].message.content || typeof data.choices[0].message.content !== 'string') {
                throw new Error('API返回的数据格式不正确: 缺少content字符串');
            }
            
            expandedPrompt = data.choices[0].message.content.trim();
        }

        // 显示扩写后的提示词
        imagePromptOutput.value = expandedPrompt;
        
        // 保存中英文对照关系，用于鼠标选中文本时显示对应中文
        // 这里假设originalPrompt是中文，expandedPrompt是英文
        if (originalPrompt && expandedPrompt) {
            if (DEBUG_MODE) console.log('保存扩写功能的中英文对照关系');
            // 不要清空整个数组，而是保留之前的映射
            // 简单分割文本，实际应用中可能需要更复杂的算法
            const chineseSentences = originalPrompt.split(/[。！？；\n]+/).filter(s => s.trim());
            const englishSentences = expandedPrompt.split(/[.!?;\n]+/).filter(s => s.trim());
            
            // 创建对照映射，这里采用简单的句子对应，实际应用可能需要更复杂的匹配算法
            const minLength = Math.min(chineseSentences.length, englishSentences.length);
            for (let i = 0; i < minLength; i++) {
                englishChineseMapping.push({
                    english: englishSentences[i].trim(),
                    chinese: chineseSentences[i].trim()
                });
            }
            if (DEBUG_MODE) console.log('中英文对照关系:', englishChineseMapping);
        }
        
        updatePromptCharCount(); // 更新字数统计
        showNotification('提示词扩写成功', 'success');
    } catch (error) {
        console.error('扩写提示词时出错:', error);
        showNotification('扩写失败: ' + error.message, 'error');
    } finally {
        // 恢复按钮状态
        analyzeImageBtn.disabled = false;
        analyzeImageBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 11-6.219-8.56"></path>
            </svg>
            分析图片
        `;
        expandPromptBtn.disabled = false;
    }
}
// ========== 帮助模块 ==========
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const closeHelpModalBtn = document.querySelector('.close-help-modal');
const helpNavLinks = document.querySelectorAll('.help-nav a');

// 打开帮助弹窗
helpBtn.addEventListener('click', () => {
    helpModal.classList.add('show');
    // 默认激活第一个导航项
    if (helpNavLinks.length > 0 && !helpNavLinks[0].classList.contains('active')) {
        helpNavLinks[0].click();
    }
});

// 关闭帮助弹窗
closeHelpModalBtn.addEventListener('click', () => {
    helpModal.classList.remove('show');
});

// 点击弹窗外部关闭
helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        helpModal.classList.remove('show');
    }
});

// 导航链接点击事件
helpNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // 移除所有导航项的 active 类
        helpNavLinks.forEach(l => l.classList.remove('active'));
        // 为当前点击的导航项添加 active 类
        link.classList.add('active');

        // 获取目标 section ID
        const targetSectionId = 'help-' + link.getAttribute('data-section');
        console.log('点击了导航项，目标section ID:', targetSectionId);

        // 隐藏所有帮助内容区块
        document.querySelectorAll('.help-section').forEach(section => {
            section.classList.remove('active');
        });

        // 显示对应的内容区块
        const targetSection = document.getElementById(targetSectionId);
        console.log('找到目标section:', targetSection);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    });
});

// 测试文生图功能帮助部分是否能正常显示
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否存在文生图功能的帮助部分
    const textToImageHelpSection = document.getElementById('help-text-to-image');
    console.log('文生图功能帮助部分存在:', textToImageHelpSection !== null);
    
    // 如果存在，可以在这里添加一些调试代码
    if (textToImageHelpSection) {
        console.log('文生图功能帮助部分HTML:', textToImageHelpSection.innerHTML);
    }
});

// ========== 文生图功能 ==========
// 获取DOM元素
const positivePromptTextarea = document.getElementById('positive-prompt-textarea');
const negativePromptTextarea = document.getElementById('negative-prompt-textarea');
const positivePromptCharCounter = document.getElementById('positive-prompt-char-counter');
const negativePromptCharCounter = document.getElementById('negative-prompt-char-counter');
const imageResolutionSelect = document.getElementById('image-resolution-select');
const generateImageBtn = document.getElementById('generate-image-btn');
const generatedImageDisplay = document.getElementById('generated-image-display');
const downloadImageBtn = document.getElementById('download-image-btn');
const regenerateImageBtn = document.getElementById('regenerate-image-btn');
const imageGenerationInfo = document.getElementById('image-generation-info');
const clearPositivePromptBtnTti = document.getElementById('clear-positive-prompt-btn');
const clearNegativePromptBtnTti = document.getElementById('clear-negative-prompt-btn-tti');

// 创建图像放大查看模态框
const imageModal = document.createElement('div');
imageModal.className = 'image-modal';
imageModal.innerHTML = `
    <div class="image-modal-content">
        <span class="close-image-modal">&times;</span>
        <img src="" alt="放大的图像" class="modal-image">
    </div>
`;
document.body.appendChild(imageModal);

// 获取模态框元素
const modalImage = imageModal.querySelector('.modal-image');
const closeImageModalBtn = imageModal.querySelector('.close-image-modal');

// 存储生成的图像数据
let generatedImageData = null;
let lastPositivePrompt = '';
let lastNegativePrompt = '';
let lastImageResolution = '1024x1024';

// 更新正向提示词字数统计
function updatePositivePromptCharCount() {
    if (positivePromptTextarea && positivePromptCharCounter) {
        const charCount = positivePromptTextarea.value.length;
        positivePromptCharCounter.textContent = `${charCount} 字`;
    }
}

// 更新反向提示词字数统计
function updateNegativePromptCharCount() {
    if (negativePromptTextarea && negativePromptCharCounter) {
        const charCount = negativePromptTextarea.value.length;
        negativePromptCharCounter.textContent = `${charCount} 字`;
    }
}

// 生成图像
async function generateImage() {
    if (!positivePromptTextarea || !generateImageBtn || !generatedImageDisplay || !imageGenerationInfo) {
        showNotification('页面元素未正确加载', 'error');
        return;
    }

    const positivePrompt = positivePromptTextarea.value.trim();
    const negativePrompt = negativePromptTextarea ? negativePromptTextarea.value.trim() : '';
    const imageResolution = imageResolutionSelect ? imageResolutionSelect.value : '1024x1024';

    // 检查正向提示词是否为空
    if (!positivePrompt) {
        showNotification('请输入正向提示词', 'error');
        return;
    }

    // 检查API密钥
    if (!apiKey) {
        showNotification('请先设置API密钥', 'error');
        return;
    }

    // 处理反向提示词，确保不包含中文字符
    let processedNegativePrompt = negativePrompt;
    if (processedNegativePrompt) {
        const chineseRegex = /[\u4e00-\u9fa5]/g;
        if (chineseRegex.test(processedNegativePrompt)) {
            // 如果有中文字符，移除它们
            processedNegativePrompt = processedNegativePrompt.replace(chineseRegex, '').trim();
            
            // 移除可能产生的多余逗号和空格
            processedNegativePrompt = processedNegativePrompt.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '');
            
            // 如果结果为空，提供默认的反向提示词
            if (!processedNegativePrompt) {
                processedNegativePrompt = "blurry, low quality, distorted, deformed, ugly, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blurry, ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), out of frame, extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), Photoshop, video game, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eyed, blurry, bad anatomy, bad proportions, malformed limbs, cloned face, gross proportions, (malformed limbs), (missing arms), (missing legs), (extra arms), (extra legs), mutated hands, (fused fingers), (too many fingers), (long neck)";
            }
            
            // 通知用户反向提示词已被修改
            showNotification('反向提示词中的中文字符已被移除', 'info');
        }
    }

    // 显示加载状态
    generateImageBtn.disabled = true;
    generateImageBtn.innerHTML = '<span class="loading-spinner"></span> 生成中...';
    
    // 清除之前的图像和信息
    generatedImageDisplay.innerHTML = '';
    imageGenerationInfo.innerHTML = '';
    if (downloadImageBtn) downloadImageBtn.style.display = 'none';
    if (regenerateImageBtn) regenerateImageBtn.style.display = 'none';

    // 重试函数
    const fetchWithRetry = async (url, options, maxRetries = 2, retryDelay = 2000) => {
        let lastError;
        
        for (let i = 0; i <= maxRetries; i++) {
            try {
                // 创建一个AbortController用于请求超时
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时
                
                // 添加signal到请求选项
                const fetchOptions = {
                    ...options,
                    signal: controller.signal
                };
                
                const response = await fetch(url, fetchOptions);
                
                // 清除超时定时器
                clearTimeout(timeoutId);
                
                // 如果是500错误，并且还有重试次数，则等待后重试
                if (response.status === 500 && i < maxRetries) {
                    console.log(`遇到500错误，第${i + 1}次重试...`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1))); // 递增延迟
                    continue;
                }
                
                return response;
            } catch (error) {
                lastError = error;
                console.error(`第${i + 1}次请求失败:`, error);
                
                // 如果不是最后一次尝试，等待后重试
                if (i < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1))); // 递增延迟
                }
            }
        }
        
        throw lastError;
    };

    try {
        // 准备生成图像的提示词
        const systemPrompt = `你是一个专业的图像生成助手。根据用户提供的正向提示词和反向提示词，生成高质量的图像描述。请确保生成的图像符合用户的期望，并避免反向提示词中提到的内容。

正向提示词：${positivePrompt}
反向提示词：${processedNegativePrompt || '无'}`;

        // 调用API生成图像（带重试机制）
        const response = await fetchWithRetry('https://open.bigmodel.cn/api/paas/v4/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'cogview-4', // 使用GLM文生图模型
                prompt: positivePrompt,
                negative_prompt: processedNegativePrompt || '',
                n: 1, // 生成1张图片
                size: imageResolution, // 用户选择的图片尺寸
                quality: 'standard', // 图片质量
                style: 'vivid' // 图片风格
            })
        });

        console.log("图像生成响应状态:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API错误响应:", errorData);
            
            // 根据错误状态码提供更具体的错误信息
            let errorMessage = '';
            if (response.status === 401) {
                errorMessage = 'API密钥无效，请检查您的API密钥设置';
            } else if (response.status === 429) {
                errorMessage = '请求过于频繁，请稍后再试';
            } else if (response.status === 500) {
                errorMessage = '服务器内部错误，已尝试重试但仍然失败，请稍后再试或联系客服';
            } else if (response.status === 503) {
                errorMessage = '服务暂时不可用，请稍后再试';
            } else {
                errorMessage = errorData.error?.message || `请求失败，状态码: ${response.status}`;
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("图像生成API成功响应:", data);

        if (data.data && data.data.length > 0) {
            // 获取生成的图像URL
            const imageUrl = data.data[0].url;
            
            // 创建图像元素
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = '生成的图像';
            
            // 设置图像加载超时
            const imgLoadTimeout = setTimeout(() => {
                img.onerror = null;
                throw new Error('图像加载超时，请检查网络连接');
            }, 30000); // 30秒图像加载超时
            
            img.onload = () => {
                clearTimeout(imgLoadTimeout);
                generatedImageDisplay.innerHTML = '';
                generatedImageDisplay.appendChild(img);
                
                // 显示生成的图像容器
                const generatedImageContainer = document.getElementById('generated-image-container');
                if (generatedImageContainer) {
                    generatedImageContainer.style.display = 'block';
                }
                
                // 显示操作按钮
                if (downloadImageBtn) downloadImageBtn.style.display = 'flex';
                if (regenerateImageBtn) regenerateImageBtn.style.display = 'flex';
                
                // 显示生成信息
                imageGenerationInfo.innerHTML = `
                    <p>正向提示词：${positivePrompt}</p>
                    ${processedNegativePrompt ? `<p>反向提示词：${processedNegativePrompt}</p>` : ''}
                    <p>尺寸：${imageResolution}</p>
                    <p style="color: #1a73e8; font-size: 12px; margin-top: 8px;">💡 提示：点击图像可以放大查看</p>
                `;
                
                // 存储生成的图像数据
                generatedImageData = imageUrl;
                lastPositivePrompt = positivePrompt;
                lastNegativePrompt = processedNegativePrompt;
                lastImageResolution = imageResolution;
                
                showNotification('图像生成成功', 'success');
            };
            
            img.onerror = () => {
                clearTimeout(imgLoadTimeout);
                throw new Error('图像加载失败，请检查网络连接或稍后重试');
            };
        } else {
            throw new Error('图像生成失败，服务器未返回有效数据，请重试');
        }
    } catch (error) {
        console.error('生成图像时出错:', error);
        
        // 提供更具体的错误信息
        let errorMessage = '生成图像失败: ';
        if (error.name === 'AbortError') {
            errorMessage += '请求超时，请检查网络连接或稍后重试';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            errorMessage += '网络连接错误，请检查您的网络连接并重试';
        } else {
            errorMessage += error.message;
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        // 恢复按钮状态
        generateImageBtn.disabled = false;
        generateImageBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            生成图像
        `;
    }
}

// 下载图像
function downloadImage() {
    if (!generatedImageData) {
        showNotification('没有可下载的图像', 'error');
        return;
    }

    // 创建一个临时链接元素
    const link = document.createElement('a');
    link.href = generatedImageData;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('图像下载成功', 'success');
}

// 重新生成图像
function regenerateImage() {
    if (!lastPositivePrompt) {
        showNotification('没有可重新生成的图像', 'error');
        return;
    }
    
    // 使用之前的提示词重新生成
    if (positivePromptTextarea) positivePromptTextarea.value = lastPositivePrompt;
    if (negativePromptTextarea) negativePromptTextarea.value = lastNegativePrompt;
    if (imageResolutionSelect) imageResolutionSelect.value = lastImageResolution;
    
    // 触发生成图像
    generateImage();
}

// 添加事件监听器
if (positivePromptTextarea) positivePromptTextarea.addEventListener('input', updatePositivePromptCharCount);
if (negativePromptTextarea) negativePromptTextarea.addEventListener('input', updateNegativePromptCharCount);
if (generateImageBtn) generateImageBtn.addEventListener('click', generateImage);
if (downloadImageBtn) downloadImageBtn.addEventListener('click', downloadImage);
if (regenerateImageBtn) regenerateImageBtn.addEventListener('click', regenerateImage);

// 图像点击放大查看事件
if (generatedImageDisplay) {
    generatedImageDisplay.addEventListener('click', () => {
        if (generatedImageData) {
            modalImage.src = generatedImageData;
            imageModal.style.display = 'block';
        }
    });
}

// 关闭模态框事件
if (closeImageModalBtn) {
    closeImageModalBtn.addEventListener('click', () => {
        imageModal.style.display = 'none';
    });
}

// 点击模态框外部关闭模态框
if (imageModal) {
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.style.display = 'none';
        }
    });
}

// 清除正向提示词按钮事件
if (clearPositivePromptBtnTti) {
    clearPositivePromptBtnTti.addEventListener('click', () => {
        if (positivePromptTextarea) {
            positivePromptTextarea.value = '';
            updatePositivePromptCharCount();
            showNotification('已清除正向提示词', 'success');
        }
    });
}

// 清除反向提示词按钮事件
if (clearNegativePromptBtnTti) {
    clearNegativePromptBtnTti.addEventListener('click', () => {
        if (negativePromptTextarea) {
            negativePromptTextarea.value = '';
            updateNegativePromptCharCount();
            showNotification('已清除反向提示词', 'success');
        }
    });
}

// 初始化字数统计
updatePositivePromptCharCount();
updateNegativePromptCharCount();

// 翻译历史记录功能
// 获取DOM元素
const historyContainer = document.getElementById('history-container');
const historySearch = document.getElementById('history-search');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const historyList = document.getElementById('history-list');

// 初始化翻译历史
let translationHistory = [];

// 从本地存储加载翻译历史
function loadTranslationHistory() {
    const savedHistory = localStorage.getItem('translation-history');
    if (savedHistory) {
        try {
            translationHistory = JSON.parse(savedHistory);
            updateTranslationHistory();
        } catch (error) {
            console.error('加载翻译历史失败:', error);
            translationHistory = [];
        }
    }
}

// 保存翻译历史到本地存储
function saveTranslationHistory() {
    try {
        localStorage.setItem('translation-history', JSON.stringify(translationHistory));
    } catch (error) {
        console.error('保存翻译历史失败:', error);
        showNotification('保存翻译历史失败', 'error');
    }
}

// 添加到翻译历史
function addToHistory(sourceText, translatedText, sourceLang, targetLang) {
    // 检查是否与上一条记录相同
    if (translationHistory.length > 0) {
        const lastItem = translationHistory[0];
        if (lastItem.sourceText === sourceText && 
            lastItem.translatedText === translatedText && 
            lastItem.sourceLang === sourceLang && 
            lastItem.targetLang === targetLang) {
            return; // 如果相同，不添加
        }
    }

    const historyItem = {
        id: Date.now(),
        sourceText,
        translatedText,
        sourceLang,
        targetLang,
        timestamp: new Date().toISOString()
    };

    // 添加到历史记录开头
    translationHistory.unshift(historyItem);

    // 限制历史记录数量，最多保存100条
    if (translationHistory.length > 100) {
        translationHistory = translationHistory.slice(0, 100);
    }

    // 保存到本地存储
    saveTranslationHistory();

    // 更新显示
    updateTranslationHistory();
}

// 更新翻译历史显示
function updateTranslationHistory() {
    if (!historyList) return;

    // 清空列表
    historyList.innerHTML = '';

    if (translationHistory.length === 0) {
        historyList.innerHTML = '<div class="history-empty">暂无翻译历史</div>';
        return;
    }

    // 初始只显示前两条记录
    const initialDisplayCount = 2;
    const itemsToShow = Math.min(initialDisplayCount, translationHistory.length);
    
    // 添加历史记录项
    for (let i = 0; i < itemsToShow; i++) {
        const item = translationHistory[i];
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.id = item.id;

        // 获取语言名称
        const sourceLangName = getLanguageName(item.sourceLang);
        const targetLangName = getLanguageName(item.targetLang);

        historyItem.innerHTML = `
            <div class="history-item-header">
                <span class="history-item-languages">${sourceLangName} → ${targetLangName}</span>
                <span class="history-item-time">${formatTime(new Date(item.timestamp))}</span>
            </div>
            <div class="history-item-content">
                <div class="history-item-source">${escapeHtml(item.sourceText)}</div>
                <div class="history-item-translated">${escapeHtml(item.translatedText)}</div>
            </div>
            <div class="history-item-actions">
                <button class="history-item-use-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    使用
                </button>
                <button class="history-item-delete-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                    删除
                </button>
            </div>
        `;

        // 添加到列表
        historyList.appendChild(historyItem);

        // 添加使用按钮事件
        const useBtn = historyItem.querySelector('.history-item-use-btn');
        useBtn.addEventListener('click', () => {
            // 填充源文本和目标文本
            if (sourceTextInput) sourceTextInput.value = item.sourceText;
            if (translationOutputTextarea) translationOutputTextarea.value = item.translatedText;
            
            // 设置语言选择器
            if (sourceLangSelect) sourceLangSelect.value = item.sourceLang;
            if (targetLangSelect) targetLangSelect.value = item.targetLang;
            
            // 更新字符计数
            updateCharCount();
            
            // 显示通知
            showNotification('已使用历史记录', 'success');
        });

        // 添加删除按钮事件
        const deleteBtn = historyItem.querySelector('.history-item-delete-btn');
        deleteBtn.addEventListener('click', () => {
            // 从数组中移除
            translationHistory = translationHistory.filter(h => h.id !== item.id);
            
            // 保存到本地存储
            saveTranslationHistory();
            
            // 更新显示
            updateTranslationHistory();
            
            // 显示通知
            showNotification('已删除历史记录', 'success');
        });
    }
    
    // 如果有更多记录，添加加载更多提示
    if (translationHistory.length > initialDisplayCount) {
        const loadMoreItem = document.createElement('div');
        loadMoreItem.className = 'history-load-more';
        loadMoreItem.innerHTML = `
            <div class="history-load-more-text">
                滚动查看更多 (${translationHistory.length - initialDisplayCount} 条)
            </div>
        `;
        historyList.appendChild(loadMoreItem);
    }
}

// 搜索翻译历史
function searchHistory(query) {
    if (!historyList) return;

    // 清空列表
    historyList.innerHTML = '';

    // 如果查询为空，显示所有历史记录
    if (!query.trim()) {
        updateTranslationHistory();
        return;
    }

    // 过滤历史记录
    const filteredHistory = translationHistory.filter(item => {
        const searchText = query.toLowerCase();
        return (
            item.sourceText.toLowerCase().includes(searchText) ||
            item.translatedText.toLowerCase().includes(searchText) ||
            getLanguageName(item.sourceLang).toLowerCase().includes(searchText) ||
            getLanguageName(item.targetLang).toLowerCase().includes(searchText)
        );
    });

    if (filteredHistory.length === 0) {
        historyList.innerHTML = '<div class="history-empty">没有找到匹配的翻译历史</div>';
        return;
    }

    // 临时替换历史记录数组
    const originalHistory = translationHistory;
    translationHistory = filteredHistory;

    // 更新显示
    updateTranslationHistory();

    // 恢复原始历史记录数组
    translationHistory = originalHistory;
}

// 清空翻译历史
function clearHistory() {
    if (translationHistory.length === 0) {
        showNotification('翻译历史已经为空', 'info');
        return;
    }

    if (confirm('确定要清空所有翻译历史吗？此操作不可恢复。')) {
        translationHistory = [];
        saveTranslationHistory();
        updateTranslationHistory();
        showNotification('已清空翻译历史', 'success');
    }
}

// 初始化翻译历史功能
function initTranslationHistory() {
    // 加载翻译历史
    loadTranslationHistory();

    // 添加搜索框事件
    if (historySearch) {
        historySearch.addEventListener('input', (e) => {
            searchHistory(e.target.value);
        });
    }

    // 添加搜索按钮事件
    const historySearchBtn = document.getElementById('history-search-btn');
    if (historySearchBtn) {
        historySearchBtn.addEventListener('click', () => {
            if (historySearch) {
                searchHistory(historySearch.value);
            }
        });
    }

    // 添加清空按钮事件
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }
    
    // 尝试找到performTranslation函数并修改它以保存中英文对照关系
    // 注意：这里我们不直接修改performTranslation函数，而是添加一个补丁到addToHistory函数中
    // 这样当翻译完成并添加到历史记录时，也会保存对照关系
    
    // 添加滚动事件，实现加载更多历史记录
    if (historyList) {
        let isLoadingMore = false;
        let currentlyDisplayed = 2; // 初始显示数量
        
        historyList.addEventListener('scroll', () => {
            // 检查是否滚动到底部
            const isAtBottom = historyList.scrollTop + historyList.clientHeight >= historyList.scrollHeight - 5;
            
            if (isAtBottom && !isLoadingMore && currentlyDisplayed < translationHistory.length) {
                isLoadingMore = true;
                
                // 使用 requestAnimationFrame 优化性能
                requestAnimationFrame(() => {
                    // 移除加载更多提示
                    const loadMoreItem = historyList.querySelector('.history-load-more');
                    if (loadMoreItem) {
                        loadMoreItem.remove();
                    }
                    
                    // 加载更多记录，每次加载5条
                    const itemsToLoad = 5;
                    const endIndex = Math.min(currentlyDisplayed + itemsToLoad, translationHistory.length);
                    
                    for (let i = currentlyDisplayed; i < endIndex; i++) {
                        const item = translationHistory[i];
                        const historyItem = document.createElement('div');
                        historyItem.className = 'history-item';
                        historyItem.dataset.id = item.id;

                        // 获取语言名称
                        const sourceLangName = getLanguageName(item.sourceLang);
                        const targetLangName = getLanguageName(item.targetLang);

                        historyItem.innerHTML = `
                            <div class="history-item-header">
                                <span class="history-item-languages">${sourceLangName} → ${targetLangName}</span>
                                <span class="history-item-time">${formatTime(new Date(item.timestamp))}</span>
                            </div>
                            <div class="history-item-content">
                                <div class="history-item-source">${escapeHtml(item.sourceText)}</div>
                                <div class="history-item-translated">${escapeHtml(item.translatedText)}</div>
                            </div>
                            <div class="history-item-actions">
                                <button class="history-item-use-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    使用
                                </button>
                                <button class="history-item-delete-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                    </svg>
                                    删除
                                </button>
                            </div>
                        `;

                        // 添加到列表
                        historyList.appendChild(historyItem);

                        // 添加使用按钮事件
                        const useBtn = historyItem.querySelector('.history-item-use-btn');
                        useBtn.addEventListener('click', () => {
                            // 填充源文本和目标文本
                            if (sourceTextInput) sourceTextInput.value = item.sourceText;
                            if (translationOutputTextarea) translationOutputTextarea.value = item.translatedText;
                            
                            // 设置语言选择器
                            if (sourceLangSelect) sourceLangSelect.value = item.sourceLang;
                            if (targetLangSelect) targetLangSelect.value = item.targetLang;
                            
                            // 更新字符计数
                            updateCharCount();
                            
                            // 显示通知
                            showNotification('已使用历史记录', 'success');
                        });

                        // 添加删除按钮事件
                        const deleteBtn = historyItem.querySelector('.history-item-delete-btn');
                        deleteBtn.addEventListener('click', () => {
                            // 从数组中移除
                            translationHistory = translationHistory.filter(h => h.id !== item.id);
                            
                            // 保存到本地存储
                            saveTranslationHistory();
                            
                            // 更新显示
                            updateTranslationHistory();
                            
                            // 显示通知
                            showNotification('已删除历史记录', 'success');
                        });
                    }
                    
                    currentlyDisplayed = endIndex;
                    
                    // 如果还有更多记录，添加加载更多提示
                    if (currentlyDisplayed < translationHistory.length) {
                        const newLoadMoreItem = document.createElement('div');
                        newLoadMoreItem.className = 'history-load-more';
                        newLoadMoreItem.innerHTML = `
                            <div class="history-load-more-text">
                                滚动查看更多 (${translationHistory.length - currentlyDisplayed} 条)
                            </div>
                        `;
                        historyList.appendChild(newLoadMoreItem);
                    }
                    
                    isLoadingMore = false;
                });
            }
        });
    }
}

// 更新对照文本框显示选中的英文对应的中文原文
function updateComparisonOutput(selectedText) {
    console.log('----- updateComparisonOutput调用 -----');
    
    // 先检查DOM元素是否存在
    const comparisonOutput = document.getElementById('comparison-output');
    if (!comparisonOutput) {
        console.error('未找到对照文本框元素！');
        return;
    }
    
    console.log('选中的文本:', selectedText ? selectedText.substring(0, 50) + '...' : '无');
    
    // 确保使用window全局变量
    if (!window.englishChineseMapping || !Array.isArray(window.englishChineseMapping)) {
        console.log('创建window.englishChineseMapping数组');
        window.englishChineseMapping = [];
    }
    
    console.log('当前对照关系数组长度:', window.englishChineseMapping.length);
    
    // 强制在控制台显示所有对照关系，用于调试
    console.log('所有对照关系:');
    window.englishChineseMapping.forEach((mapping, index) => {
        console.log(`  映射${index + 1}:`, {
            english: mapping ? (mapping.english ? mapping.english.substring(0, 20) + '...' : '空英文') : '空映射',
            chinese: mapping ? (mapping.chinese ? mapping.chinese.substring(0, 20) + '...' : '空中文') : '空映射',
            type: mapping ? mapping.type : '未知类型'
        });
    });
    
    // 过滤有效的对照关系
    // 避免重复声明变量，确保只声明一次
    const validMappings = window.englishChineseMapping.filter(mapping =>
        mapping && typeof mapping === 'object' && mapping.english && mapping.chinese
    );
    
    console.log('有效对照关系数量:', validMappings.length);
    
    // 无论是否有选中文本，只要有有效对照关系就显示第一个
    if (validMappings.length > 0) {
        console.log('存在有效对照关系，显示第一个对照关系的中文');
        comparisonOutput.value = validMappings[0].chinese;
        
        // 如果有选中文本，可以尝试匹配更准确的对照关系
    }
    
    // 如果真的没有对照关系，才显示提示信息
    if (validMappings.length === 0) {
        comparisonOutput.value = '请先输入中文并点击翻译按钮，建立中英文对照关系';
        console.log('无有效对照关系，显示提示信息');
        console.log('----- updateComparisonOutput调用结束 -----');
        return;
    }
    
    // 查找对应的中文文本
    let correspondingChinese = '';
    let bestMatchScore = 0;
    let bestMatchMapping = null;
    
    // 转换为小写进行匹配（忽略大小写）
    let normalizedSelectedText = '';
    
    // 如果有选中文本，继续进行匹配逻辑
    if (selectedText && selectedText.trim()) {
        const trimmedText = selectedText.trim();
        console.log('开始匹配选中的文本:', trimmedText.substring(0, 100) + '...');
        
        // 转换为小写进行匹配（忽略大小写）
        normalizedSelectedText = selectedText.toLowerCase().trim();
    }
    
    console.log('开始遍历有效对照关系进行匹配');
    console.log('有效对照关系总数:', validMappings.length);
    
    // 遍历有效映射，而不是整个数组
    for (let i = 0; i < validMappings.length; i++) {
        try {
            const mapping = validMappings[i];
            
            // 确保mapping.english存在且为字符串
            if (!mapping.english || typeof mapping.english !== 'string') {
                console.warn(`跳过无效的映射项${i + 1}:`, mapping);
                continue;
            }
            
            const normalizedEnglish = mapping.english.toLowerCase().trim();
            console.log(`检查映射项${i + 1}:`, normalizedEnglish.substring(0, 50) + '...');
            
            // 计算匹配得分
            let matchScore = 0;
            
            // 完全匹配得最高分
            if (normalizedEnglish === normalizedSelectedText) {
                matchScore = 100;
                console.log(`找到完全匹配（映射${i + 1}）:`, {type: mapping.type, score: matchScore});
            }
            // 英文包含选中的文本（更宽松的匹配）
            else if (normalizedEnglish.includes(normalizedSelectedText)) {
                matchScore = (normalizedSelectedText.length / normalizedEnglish.length) * 80;
                // 根据匹配文本长度调整分数
                if (normalizedSelectedText.length > 5) matchScore += 10;
                console.log(`找到包含匹配（映射${i + 1}）:`, {type: mapping.type, score: matchScore});
            }
            // 选中的文本包含英文
            else if (normalizedSelectedText.includes(normalizedEnglish)) {
                matchScore = (normalizedEnglish.length / normalizedSelectedText.length) * 70;
                // 长文本匹配加分
                if (normalizedEnglish.length > 10) matchScore += 15;
                console.log(`找到被包含匹配（映射${i + 1}）:`, {type: mapping.type, score: matchScore});
            }
            // 关键词匹配（更宽松的关键词匹配）
            else {
                const englishWords = normalizedEnglish.split(/\s+/).filter(w => w.length > 1);
                const selectedWords = normalizedSelectedText.split(/\s+/).filter(w => w.length > 1);
                
                if (englishWords.length > 0 && selectedWords.length > 0) {
                    let commonWords = 0;
                    let totalWordMatches = 0;
                    
                    // 检查每个选中的词是否在英文文本中
                    for (const word of selectedWords) {
                        if (englishWords.includes(word)) {
                            commonWords++;
                            totalWordMatches++;
                        } else {
                            // 部分匹配（单词前缀匹配）
                            for (const engWord of englishWords) {
                                if (word.startsWith(engWord.substring(0, Math.min(3, engWord.length))) || 
                                    engWord.startsWith(word.substring(0, Math.min(3, word.length)))) {
                                    totalWordMatches += 0.5;
                                }
                            }
                        }
                    }
                    
                    // 计算匹配比率
                    const wordMatchRatio = totalWordMatches / selectedWords.length;
                    matchScore = wordMatchRatio * 60;
                    
                    // 提高匹配阈值
                    if (commonWords >= Math.min(2, selectedWords.length)) {
                        matchScore += 20;
                    }
                    
                    console.log(`关键词匹配（映射${i + 1}）:`, {commonWords, score: matchScore});
                }
            }
            
            // 根据映射类型增加权重
            if (mapping.type === 'full') {
                matchScore += 30; // 完整文本匹配优先级最高
                console.log(`映射${i + 1}类型为full，加分30，调整后得分:`, matchScore);
            } else if (mapping.type === 'sentence') {
                matchScore += 15;
                console.log(`映射${i + 1}类型为sentence，加分15，调整后得分:`, matchScore);
            }
            
            // 更新最佳匹配
            if (matchScore > bestMatchScore) {
                bestMatchScore = matchScore;
                correspondingChinese = mapping.chinese;
                bestMatchMapping = mapping;
                console.log(`更新最佳匹配（映射${i + 1}）:`, {score: matchScore, type: mapping.type});
            }
        } catch (e) {
            console.error(`匹配过程出错（映射${i + 1}）:`, e, '映射项:', validMappings[i]);
        }
    }
    
    console.log('匹配完成 - 最佳得分:', bestMatchScore, '找到的映射:', bestMatchMapping ? {type: bestMatchMapping.type} : '无');
    
    // 极低匹配阈值，只要有得分就显示结果
    if (correspondingChinese && bestMatchScore >= 0) { // 阈值降至0分，确保有匹配就显示
        comparisonOutput.value = correspondingChinese;
        console.log('显示中文原文:', correspondingChinese.substring(0, 50) + '...');
    } else if (validMappings.length > 0) {
        // 如果有对照关系但没有找到匹配，显示第一个对照关系的中文作为默认值
        console.log('未找到精确匹配，但存在对照关系，尝试显示第一个对照关系');
        if (validMappings[0] && validMappings[0].chinese) {
            comparisonOutput.value = validMappings[0].chinese;
            console.log('显示第一个对照关系的中文:', validMappings[0].chinese.substring(0, 50) + '...');
        } else {
            comparisonOutput.value = '已建立对照关系，但无法显示对应的中文原文，请尝试重新选择文本';
            console.log('第一个对照关系存在但中文内容无效');
        }
    } else {
        comparisonOutput.value = '请先进行翻译操作，建立中英文对照关系';
        console.log('对照关系数组为空，需要先进行翻译操作。');
    }
    
    console.log('----- updateComparisonOutput调用结束 -----');
}

// 创建并显示中英文对照提示框
function showChineseTranslation(event) {
    console.log('showChineseTranslation函数被调用');
    
    // 获取选中的文本
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    console.log('选中的文本:', selectedText, '长度:', selectedText.length);
    
    // 立即更新对照输出
    updateComparisonOutput(selectedText);
    
    // 为了确保选择完成后再次更新（解决选择延迟问题）
    setTimeout(() => {
        const newSelection = window.getSelection();
        const newSelectedText = newSelection.toString().trim();
        if (newSelectedText) {
            console.log('延迟100ms后更新选中的文本:', newSelectedText);
            updateComparisonOutput(newSelectedText);
        }
    }, 100);
    
    if (!selectedText) {
        // 移除已显示的提示框
        const existingTooltip = document.getElementById('chinese-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        return;
    }
    
    // 查找对应的中文文本
    let correspondingChinese = '';
    let bestMatchScore = 0;
    
    // 确保使用window全局变量
    if (!window.englishChineseMapping || !Array.isArray(window.englishChineseMapping)) {
        console.log('创建window.englishChineseMapping数组');
        window.englishChineseMapping = [];
    }
    
    if (DEBUG_MODE) console.log('尝试匹配的对照关系数量:', window.englishChineseMapping.length);
    
    for (const mapping of window.englishChineseMapping) {
        // 计算匹配得分
        let matchScore = 0;
        
        // 完全匹配得最高分
        if (mapping.english === selectedText) {
            matchScore = 100;
        }
        // 英文包含选中的文本
        else if (mapping.english.includes(selectedText)) {
            matchScore = selectedText.length / mapping.english.length * 80;
        }
        // 选中的文本包含英文
        else if (selectedText.includes(mapping.english)) {
            matchScore = mapping.english.length / selectedText.length * 70;
        }
        // 关键词匹配（检查是否有共同的重要单词）
        else {
            const englishWords = mapping.english.toLowerCase().split(/\s+/);
            const selectedWords = selectedText.toLowerCase().split(/\s+/);
            let commonWords = 0;
            
            for (const word of selectedWords) {
                if (word.length > 2 && englishWords.includes(word)) {
                    commonWords++;
                }
            }
            
            matchScore = (commonWords / selectedWords.length) * 50;
        }
        
        // 更新最佳匹配
        if (matchScore > bestMatchScore && matchScore > 30) { // 设置最低匹配阈值
            bestMatchScore = matchScore;
            correspondingChinese = mapping.chinese;
        }
    }
    
    if (DEBUG_MODE) console.log('找到的中文翻译:', correspondingChinese, '匹配得分:', bestMatchScore);
    
    if (!correspondingChinese) {
        // 如果找不到对应中文，显示一个提示（可选）
        if (DEBUG_MODE) console.log('未找到对应的中文翻译');
        return;
    }
    
    // 移除已存在的提示框
    const existingTooltip = document.getElementById('chinese-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    // 创建新的提示框
    const tooltip = document.createElement('div');
    tooltip.id = 'chinese-tooltip';
    tooltip.className = 'chinese-tooltip';
    tooltip.textContent = correspondingChinese;
    
    // 设置提示框样式
    tooltip.style.cssText = `
        position: absolute;
        left: ${event.clientX - 10}px;
        top: ${event.clientY - 40}px;
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 999999;
        pointer-events: none;
        max-width: 350px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: fadeIn 0.2s ease-in-out;
    `;
    
    // 添加动画样式
    if (!document.getElementById('tooltip-animation-style')) {
        const style = document.createElement('style');
        style.id = 'tooltip-animation-style';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 添加到页面
    document.body.appendChild(tooltip);
    
    // 添加鼠标移动时更新提示框位置的事件
    const updateTooltipPosition = (e) => {
        tooltip.style.left = (e.clientX - 10) + 'px';
        tooltip.style.top = (e.clientY - 40) + 'px';
    };
    
    document.addEventListener('mousemove', updateTooltipPosition);
    
    // 添加延迟移除提示框的函数
    const removeTooltip = () => {
        setTimeout(() => {
            const tooltipToRemove = document.getElementById('chinese-tooltip');
            if (tooltipToRemove) {
                tooltipToRemove.style.opacity = '0';
                tooltipToRemove.style.transition = 'opacity 0.3s ease-out';
                setTimeout(() => {
                    if (tooltipToRemove.parentNode) {
                        tooltipToRemove.parentNode.removeChild(tooltipToRemove);
                    }
                }, 300);
            }
            document.removeEventListener('mousemove', updateTooltipPosition);
            document.removeEventListener('mouseup', removeTooltip);
        }, 3000); // 3秒后自动移除
    };
    
    document.addEventListener('mouseup', removeTooltip);
}

// 保存翻译功能的中英文对照关系
function saveTranslationMapping(sourceText, translatedText, sourceLang, targetLang) {
    console.log('===== saveTranslationMapping 调用开始 =====');
    
    // 参数检查
    if (!sourceText || !translatedText || !sourceLang || !targetLang) {
        console.error('参数不完整，无法保存对照关系');
        return;
    }
    
    // 只处理中英文对照关系
    if ((sourceLang === 'zh' && targetLang === 'en') || 
        (sourceLang === 'en' && targetLang === 'zh')) {
        
        const chineseText = sourceLang === 'zh' ? sourceText : translatedText;
        const englishText = sourceLang === 'zh' ? translatedText : sourceText;
        
        // 强制使用window对象确保全局访问
        window.englishChineseMapping = window.englishChineseMapping || [];
        if (!Array.isArray(window.englishChineseMapping)) {
            window.englishChineseMapping = [];
        }
        
        console.log('保存前对照关系数组长度:', window.englishChineseMapping.length);
        
        // 核心改进：只保存一种关键映射，确保正确使用window对象
        const primaryMapping = {
            english: englishText.trim(),
            chinese: chineseText.trim(),
            type: 'primary',
            timestamp: Date.now()
        };
        
        // 添加到数组开头
        window.englishChineseMapping.unshift(primaryMapping);
        console.log('添加核心映射后数组长度:', window.englishChineseMapping.length);
        
        // 可选：添加句子级映射（确保使用window对象）
        try {
            const chineseSentences = chineseText.split(/[。！？；\n]+/).filter(s => s.trim());
            const englishSentences = englishText.split(/[.!?;\n]+/).filter(s => s.trim());
            const minLength = Math.min(chineseSentences.length, englishSentences.length);
            
            for (let i = 0; i < minLength; i++) {
                const sentenceMapping = {
                    english: englishSentences[i].trim(),
                    chinese: chineseSentences[i].trim(),
                    type: 'sentence',
                    timestamp: Date.now()
                };
                // 确保使用window对象
                window.englishChineseMapping.push(sentenceMapping);
            }
        } catch (e) {
            console.error('句子分割出错:', e);
        }
        
        // 限制映射数量
        if (window.englishChineseMapping.length > 50) {
            console.log(`对照关系数量超过50（当前${window.englishChineseMapping.length}），保留前50项`);
            window.englishChineseMapping = window.englishChineseMapping.slice(0, 50);
        }
        
        console.log('最终对照关系数量:', window.englishChineseMapping.length);
        
        // 核心改进：强制验证第一个对照关系并立即显示
        if (window.englishChineseMapping.length > 0) {
            const firstMapping = window.englishChineseMapping[0];
            console.log('第一个对照关系详情:', {
                english: firstMapping.english ? firstMapping.english.substring(0, 20) + '...' : '空',
                chinese: firstMapping.chinese ? firstMapping.chinese.substring(0, 20) + '...' : '空',
                type: firstMapping.type
            });
            
            // 强制更新对照显示
            console.log('立即强制更新对照显示...');
            updateComparisonOutput('');
            
            // 为了确保显示正确，再延迟100ms调用一次
            setTimeout(() => {
                console.log('延迟更新对照显示以确保DOM已更新');
                updateComparisonOutput('');
            }, 100);
        }
        
    } else {
        console.log('跳过非中英文对照关系的保存');
    }
    
    console.log('===== saveTranslationMapping 调用结束 =====');
}

// 初始化选中文本显示中文功能
function initTextSelectionFeature() {
    console.log('初始化选中文本显示中文功能 - 增强版');
    
    // 为整个文档添加选择事件监听（最高优先级）
    document.addEventListener('mouseup', function(event) {
        console.log('文档级选择事件触发');
        
        // 检查事件目标是否在翻译结果区域内
        const translationOutput = document.getElementById('translation-output');
        const isInTranslationArea = translationOutput && translationOutput.contains(event.target);
        
        console.log('是否在翻译区域内:', isInTranslationArea);
        
        // 直接调用showChineseTranslation来处理选中
        showChineseTranslation(event);
    });
    
    // 为翻译结果文本框添加多种事件监听
    const translationOutput = document.getElementById('translation-output');
    if (translationOutput) {
        console.log('找到翻译结果文本框，添加多种事件监听');
        
        // 添加多种事件来捕获选择
        translationOutput.addEventListener('mouseup', showChineseTranslation);
        translationOutput.addEventListener('keyup', showChineseTranslation);
        translationOutput.addEventListener('mouseleave', showChineseTranslation);
        
        // 注意：selectionchange事件应该添加到document上，而不是元素上
        document.addEventListener('selectionchange', function() {
            // 检查当前选中的文本是否在翻译结果文本框内
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const commonAncestor = range.commonAncestorContainer;
                if (translationOutput.contains(commonAncestor)) {
                    console.log('selectionchange事件触发，选中在翻译区域内');
                    showChineseTranslation();
                }
            }
        });
    }
    
    // 为整个文档添加事件监听作为后备
    if (DEBUG_MODE) console.log('为整个文档添加后备事件监听');
    document.addEventListener('mouseup', showChineseTranslation);
    document.addEventListener('keyup', showChineseTranslation); // 添加keyup事件作为后备
}

// 在页面加载完成后初始化翻译历史和文本选择功能
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，初始化应用...');
    
    // 确保englishChineseMapping全局变量正确初始化并在window对象上可见
    if (!window.englishChineseMapping || !Array.isArray(window.englishChineseMapping)) {
        console.log('初始化全局对照关系数组');
        window.englishChineseMapping = [];
    }
    
    // 直接使用window.englishChineseMapping，避免创建额外的全局变量
    console.log('对照关系数组初始化完成，当前长度:', window.englishChineseMapping.length);
    
    initTranslationHistory();
    initTextSelectionFeature();
    
    // 立即更新对照显示，确保页面加载时就正确显示
    console.log('页面加载完成，立即更新对照显示');
    setTimeout(() => {
        updateComparisonOutput('');
    }, 100); // 延迟100ms确保DOM完全渲染
const translationOutputTextarea = document.getElementById('translation-output'); // 翻译结果输出框
const comparisonOutputTextarea = document.getElementById('comparison-output'); // 对照原文输出框

// 监听翻译结果输出框的选中文本
function updateComparisonText() {
    const selectedText = window.getSelection().toString().trim(); // 获取选中的文本
    
    if (selectedText) {
        const sourceText = document.getElementById('source-text').value.trim(); // 获取源中文文本
        const translationText = translationOutputTextarea.value.trim(); // 获取翻译后的英文文本
        
        // 通过简单的匹配来查找源文本中的对应部分
        let matchingChineseText = findMatchingChineseText(selectedText, sourceText, translationText);
        
        // 更新对照文本框的内容
        comparisonOutputTextarea.value = matchingChineseText;
    }
}

// 一个简单的匹配函数，根据英文文本返回对应的中文部分
function findMatchingChineseText(englishText, sourceText, translationText) {
    // 这里可以根据需要进一步实现更复杂的匹配逻辑
    // 例如，你可以通过正则表达式或者其他方法来匹配具体的翻译内容
    // 目前，假设直接返回源文本作为示例
    return sourceText; // 作为占位符，返回所有中文文本
}

// 事件监听：当用户选择翻译结果中的英文文本时，更新对照文本框
translationOutputTextarea.addEventListener('mouseup', updateComparisonText); 
translationOutputTextarea.addEventListener('keyup', updateComparisonText); // 支持键盘选择
    
    console.log('应用初始化完成');
});

// 获取语言名称
function getLanguageName(langCode) {
    const languages = {
        'auto': '自动检测',
        'zh': '中文',
        'en': '英文',
        'ja': '日文',
        'ko': '韩文',
        'fr': '法文',
        'de': '德文',
        'es': '西班牙文',
        'ru': '俄文',
        'pt': '葡萄牙文',
        'it': '意大利文',
        'ar': '阿拉伯文',
        'hi': '印地文',
        'th': '泰文',
        'vi': '越南文'
    };
    
    return languages[langCode] || langCode;
}
