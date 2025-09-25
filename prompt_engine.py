AI 提示助手 Web 应用程序的核心提示工程逻辑。
从__future__导入注释

从数据类导入数据类
从输入导入Any 、Dict 、Iterable、List 、Sequence 
进口再


@数据类
类PromptAnalysis ：
 
    “已处理提示的结构化表示。”

    检测到的语言：str
    检测到的语言代码：str
    优化提示：str
    关键字：列表[ str ]
    expanded_prompt：str
    翻译：Dict [ str ，Dict [ str ，Any ]]
    建议：Dict [ str ，List [ str ]]


PromptEngine类：
 
    “包含启发式提示优化管道的实用程序类。”

    停用词 = {
        “这” ，
        “一个” ，
        “一个” ，
        “和” ，
        “和” ，
        “在” ，
        “的” ，
        “为了” ，
        “在” ，
        “到” ，
        “经过” ，
        “从” ，
        “使用” ，
        “是” ，
        “是” ，
        “这” ，
        “那” ，
    }

    语言标签 = {
        "en" : "英语" ,
        "zh" : "中文(Chinese)" ,
        "es" : "西班牙语（西班牙语）" ,
        "fr" : "法语（法语）" ,
        "ja" : "日语" ,
    }

    # 针对常见 AI 艺术词汇进行调整的最小双语词典。
    TRANSLATION_MEMORY:字典[字符串,字典[字符串,字典[字符串,字符串]]] = {
        “在” ： {
            "肖像" : { "zh" : "肖像" , "es" : "retrato" , "fr" : "肖像" , "ja" : "肖像" },
            "landscape" : { "zh" : "风景" , "es" : "paisaje" , "fr" : "paysage" , "ja" : "风景" },
            "character" : { "zh" : "角色颜色" , "es" : "角色" , "fr" : "角色" , "ja" : "角色" },
            "architecture" : { "zh" : "建筑" , "es" : "arquitectura" , "fr" : "architecture" , "ja" : "建筑" },
            "产品" : { "zh" : "产品" , "es" : "产品" , "fr" : "产品" , "ja" : "メーカー" },
            “生物” ：{ “zh” ：“生物” ，“es” ：“criatura” ，“fr” ：“生物” ，“ja” ：“生物” }，
            "cyberpunk" : { "zh" : "赛博朋克" , "es" : "赛博朋克" , "fr" : "赛博朋克" , "ja" : "赛博朋克" },
            "sunset" : { "zh" : "日落" , "es" : "日落" , "fr" : "日落" , "ja" : "夕日" },
            "sunrise" : { "zh" : "sunrise" , "es" : "amanecer" , "fr" : "lever de soleil" , "ja" : "sunrise" },
            "mountain" : { "zh" : "山脉" , "es" : "montaña" , "fr" : "montagne" , "ja" : "山" },
            "forest" : { "zh" : "森林" , "es" : "bosque" , "fr" : "forêt" , "ja" : "森" },
            "desert" : { "zh" : "沙漠" , "es" : "desierto" , "fr" : "désert" , "ja" : "砂漠" },
            "ocean" : { "zh" : "海洋" , "es" : "océano" , "fr" : "océan" , "ja" : "海" },
            "city" : { "zh" : "城市" , "es" : "ciudad" , "fr" : "ville" , "ja" : "都市" },
            "neon" : { "zh" : "霓虹" , "es" : "neon" , "fr" : "neon" , "ja" : "ネオン" },
            "dramatic" : { "zh" : "戏剧性的" , "es" : "dramático" , "fr" : "dramatique" , "ja" : "ドラマチック" },
            "cinematic" : { "zh" : "电影感" , "es" : "cinematográfico" , "fr" : "cinematographique" , ​​"ja" : "シネマティック" },
            "realistic" : { "zh" : "写实" , "es" : "realista" , "fr" : "réaliste" , "ja" : "riaru" },
            "watercolor" : { "zh" : "水彩" , "es" : "acuarela" , "fr" : "aquarelle" , "ja" : "水彩" },
            "动漫" : { "zh" : "2D" , "es" : "动漫" , "fr" : "动漫" , "ja" : "动漫" },
            "macro" : { "zh" : "精细距离" , "es" : "宏" , "fr" : "宏" , "ja" : "宏" },
            "等距" : { "zh" : "等距" , "es" : "isométrico" , "fr" : "isométrique" , ​​"ja" : "aiソメ" },
            "aerial" : { "zh" : "航拍" , "es" : "aéreo" , "fr" : "aérien" , "ja" : "空撮" },
            "vibrant" : { "zh" : "鲜艳" , "es" : "vibrante" , "fr" : "vibrant" , "ja" : "鲜やか" },
            “粉彩” ：{ “zh” ：“粉彩” ，“es” ：“粉彩” ，“fr” ：“粉彩” ，“ja” ：“粉彩” }，
            "monochrome" : { "zh" : "monochrome" , "es" : "monocromo" , "fr" : "monochrome" , "ja" : "monochrome" },
            "volumetric" : { "zh" : "体积光" , "es" : "volumétrico" , "fr" : "volumétrique" , ​​"ja" : "volumetric" },
            "studio" : { "zh" : "Tanabaku" , "es" : "estudio" , "fr" : "工作室" , "ja" : "工作室" },
            "texture" : { "zh" : "质感" , "es" : "textura" , "fr" : "texture" , "ja" : "质感" },
        }，

        "zh" : {
            "肖像" : { "en" : "肖像" , "es" : "retrato" , "fr" : "肖像" , "ja" : "肖像" },
            "风景" : { "en" : "landscape" , "es " : "paisaje" , "fr" : "paysage" , "ja" : "风景" },
            "character" : { "en" : "character" , "es" : "personaje" , "fr" : "personnage" , "ja" : "character" },
            "建筑" : { "en" : "architecture " , "es" : "arquitectura" , "fr" : "architecture" , "ja" : "建筑" },
            "产品" : { "en" : "产品" , "es" : "产品" , "fr" : "产品" , "ja" : "プロダクト" },
            "生物" : { "en" : "生物" , "es" : "criatura" , "fr" : "生物" , "ja" : "生物" },
            "赛博朋克" : { "en" : "赛博朋克" , "es" : "赛博朋克" , "fr" : "赛博朋克" , "ja" : "赛博朋克" },
            "日落" : { "en" : "日落" , "es" : "日落" , "en" : "日落" , "ja" : "夕日" },
            "日出" : { "en" : "日出" , "es" : "amanecer" , "fr" : "太阳杆" , "ja" : "日出" },
            "山脉" : { "en" : "mountain " , "es" : "montaña" , "fr" : "montagne" , "ja" : "山" },
            "森林" : { "en" : "森林" , "es" : "bosque" , ​​"fr" : "forêt" , "ja" : "森" },
            "沙漠" : { "en" : "沙漠" , "es" : "沙漠" , "fr" : "沙漠" , "ja" : "砂漠" },
            "海洋" : { "en" : "海洋" , "is" : "海洋" , "fr" : "海洋" , "ja" : "海" },
            "城市" : { "en" : "city" , "es" : "ciudad" , "fr" : "ville" , "ja" : "都市" },
            "虹霓" : { "en" : " neon " , "es" : "neón " , "fr" : " néon " , "ja" : "ネオン" },
            "戏剧性的" : { "en" : "dramatic" , "es" : "dramático" , "fr" : " dramatique " , "ja" : "ドラマチック" },
            "电影感" : { "en" : "cinematic" , "es" : "cinematográfico" , "fr" : "cinématographique" , "ja" : "シネマティック" },
            "写实" : { "en" : " realist" , "es" : " realista" , "fr" : "réaliste" , "ja" : "riaru" },
            "水彩" : { "en" : "水彩" , "es" : "aquarela" , "fr" : "水彩画" , "ja" : "水彩" },
            "2D" : { "en" : "动漫" , "es" : "动漫" , "fr" : "动漫" , "ja" : "动漫" },
            “微距离” ：{ “en” ：“宏” ，“es” ：“宏” ，“fr” ：“宏” ，“ja” ：“宏” }，
            "等距" : { "en" : "等距" , "es" : " isométrico" , "fr" : "isométrique" , ​​"ja" : "aiソメ" },
            "航拍" : { "en" : " Aero" , "es" : "aéreo" , "fr" : "aérien" , "ja" : "空撮" },
            "鲜艳" : { "en" : "充满活力" , "es" : "充满活力" , " fr " : "充满活力" , "ja" : "鲜やか" },
            "粉彩" : { "en" : "粉彩" , "es" : "粉彩" , "fr" : "粉彩" , "ja" : "粉彩" },
            "单色" : { "en" : "单色" , "es" : "monocromo" , "fr" : "单色" , "ja" : "单色" },
            "体姯光" : { "en" : "体积" , "es" : "体积" , "fr" : "体积" , ​​"ja" : "体积" },
            "Tanabaku" : { "en" : "工作室" , "es" : "工作室" , "fr" : "工作室" , "ja" : "工作室" },
            "质感" : { "en" : "texture" , "es" : "textura" , "fr" : "texture" , "ja" : "质感" },
        }，

        “是” ： {
            "retrato" : { "en" : "肖像" , "zh" : "肖像" , "fr" : "肖像" , "ja" : "肖像" },
            "paisaje" : { "en" : "landscape" , "zh" : "风景" , "fr" : "paysage" , "ja" : "风景" },
            "personaje" : { "en" : "角色" , "zh" : "角色颜色" , "fr" : "角色" , "ja" : "角色" },
            "arquitectura" : { "en" : "architecture " , "zh" : "建筑" , "fr" : "architecture" , "ja" : "建筑" },
            "producto" : { "en" : "产品" , "zh" : "产品" , "fr" : "产品" , "ja" : "メーカー" },
            "criatura" : { "en" : "生物" , "zh" : "生物" , "fr" : "生物" , "ja" : "生物" },
            "cyberpunk" : { "en" : "cyberpunk" , "zh" : "赛博朋克" , "fr" : "cyberpunk" , "ja" : "cyberpunk" },
            "sunset" : { "en" : "日落" , "zh" : "日落" , "fr" : "日落" , "ja" : "日落日" },
            "amanecer" : { "en" : "日出" , "zh" : "日出" , "fr" : "太阳杆" , "ja" : "日出" },
            "montaña" : { "en" : " mountain" , "zh" : "山脉" , "fr" : "montagne" , "ja" : "山" },
            "bosque" : { "en" : "forest " , "zh" : "森林" , "fr" : "forêt" , "ja" : "森" },
            "desert" : { "en" : "沙漠" , "zh" : "沙漠" , "fr" : "désert" , "ja" : "砂漠" },
            "océano" : { "en" : "ocean " , "zh" : "海洋" , "fr" : "océan" , "ja" : "海" },
            "ciudad" : { "en" : "city " , "zh" : "城市" , "fr" : "ville" , "ja" : "都市" },
            "neon" : { "en" : "neon" , "zh" : "霓虹" , "fr" : " neon " , "ja" : "ネオン" },
            "dramático" : { "en" : "dramatic " , "zh" : "戏剧性的" , "fr" : "dramatique" , "ja" : "ドラマチック" },
            "cinematográfico" : { "en" : "cinematic " , "zh" : "电影感" , "fr" : "cinématographique" , "ja" : "シネマティック" },
            "realista" : { "en" : " realist" , " zh" : "写实" , "fr" : "réaliste" , "ja" : "riaru" },
            "watercolor" : { "en" : "水彩" , "zh" : "水彩" , "fr" : "水彩画" , "ja" : "水彩" },
            "动漫" : { "en" : "动漫" , "zh" : "2D" , "fr" : "动漫" , "ja" : "动漫" },
            "macro" : { "en" : "macro" , "zh" : "fine distance" , "fr" : "macro" , "ja" : "macro" },
            "isométrico" : { "en" : "isometric " , "zh" : "等距" , "fr" : "isométrique" , "ja" : "アイソメ" },
            "aéreo" : { "en" : "aerial" , "zh" : "航拍" , "fr" : "aérien" , "ja" : "空撮" },
            "vibrant" : { "en" : "有活力" , "zh" : "鲜艳" , "fr" : "充满活力" , "ja" : "鲜やか" },
            "蛋糕" : { "en" : "蛋糕" , "zh" : "基本" , "fr " : "蛋糕" , "是" : "pasuテル" },
            "monocromo" : { "en" : "单色" , "zh" : "单色" , "fr" : "单色" , "ja" : "单色" },
            "volumétrico" : { "en" : "体积" , "zh" : "体积光" , "fr" : "体积光" , ​​"ja" : "体积" },
            "estudio" : { "en" : "工作室" , "zh" : "七夕" , "fr" : "工作室" , "ja" : "工作室" },
            "textura" : { "en" : "texture " , "zh" : "质感" , "fr" : "texture" , "ja" : "质感" },
        }，

        “fr” ：{
            "肖像" : { "en" : "肖像" , "zh" : "肖像" , "es" : "retrato" , "ja" : "肖像" },
            " paysage" : { "en" : "landscape " , "zh" : "风景" , "es" : "paisaje" , "ja" : "风景" },
            "personnage" : { "en" : "角色" , "zh" : "角色颜色" , "es" : "角色" , "ja" : "角色" },
            " architecture " : { "en" : "architecture" , " zh" : "建筑" , "es" : "arquitectura" , "ja" : "建筑" },
            "produit" : { "en" : "产品" , "zh" : "产品" , "es" : "产品" , "ja" : "メーカー" },
            "créature" : { "en" : "creature" , "zh" : "creature" , "es" : "criatura" , "ja" : "creature" },
            "cyberpunk" : { "en" : " cyberpunk " , "zh" : "赛博朋克" , "es" : "cyberpunk" , "ja" : "cyberpunk" },
            "coucher " : { "en" : "sunset" , "zh" : "日落" , "es" : "atardecer" , "ja" : "夕日" },
            "lever" : { "en" : "日出" , "zh" : "日出" , "es" : "amanecer" , "ja" : "日出" },
            "montagne" : { "en" : " mountain" , "zh" : "山脉" , "es" : "montaña" , "ja" : "山" },
            "forêt" : { "en" : "forest " , "zh" : "森林" , "es" : "bosque" , "ja" : "森" },
            "désert" : { "en" : "沙漠" , "zh" : "沙漠" , "es" : "desierto" , "ja" : "砂漠" },
            "océan" : { "en" : "ocean " , "zh" : "海洋" , "es" : "océano" , "ja" : "海" },
            "ville" : { "en" : "city " , "zh" : "城市" , "es" : "ciudad" , "ja" : "都市" },
            "neon" : { "en" : "neon" , "zh" : "霓虹" , "es" : "neón" , "ja" : "ネオン" },
            "dramatique" : { "en" : "dramatic " , "zh" : "戏剧性的" , "es" : "dramático" , "ja" : "ドラマチック" },
            "cinématographique" : { "en" : "cinematic " , "zh" : "电影感" , "es" : "cinematográfico" , "ja" : "シネマティック" },
            "réaliste" : { "en" : "realistic" , "zh" : "写实" , "es" : "realista" , "ja" : "Real" },
            "watercolor" : { "en" : "水彩" , "zh" : "水彩" , "es" : "aquarela" , "ja" : "水彩" },
            "动漫" : { "en" : "动漫" , "zh" : "2D" , "es" : "动漫" , "ja" : "动漫" },
            "macro" : { "en" : "宏" , "zh" : "精细距离" , "es" : "宏" , "ja" : "宏" },
            "isométrique" : { "en" : "isometric " , "zh" : "等距" , "es" : "isométrico" , "ja" : "アイソメ" },
            "aérien" : { "en" : "aerial " , "zh" : "航拍" , "es" : "aéreo" , "ja" : "空撮" },
            "vibrant" : { "en" : "充满活力" , "zh" : "鲜艳" , "es" : " vibrante " , "ja" : "鲜やか" },
            "粉彩" : { "en" : "粉彩" , "zh" : "粉彩" , "es" : "粉彩" , "ja" : "粉彩" },
            "monochrome" : { "en" : "monochrome" , "zh" : "monochrome" , "es" : "monocromo" , "ja" : "monochrome" },
            "volumétrique" : { "en" : "体积" , "zh" : "体积光" , " es" : "体积光" , "ja" : "体积光" },
            "studio" : { "en" : "工作室" , "zh" : "Tanabaku" , "es" : "estudio" , "ja" : "工作室" },
            "texture" : { "en" : "texture " , "zh" : "质感" , "es" : "textura" , "ja" : "质感" },
        }，

        “和” ： {
            "肖像" : { "en" : "肖像" , "zh" : "肖像" , "es" : "retrato" , "fr" : "肖像" },
            "风景" : { "en" : "landscape" , "zh" : "风景" , "es" : "paisaje" , "fr" : "paysage" },
            "character" : { "en" : "character" , "zh" : "角色颜色" , "es" : "personaje" , "fr" : "personnage" },
            "建筑" : { "en" : "architecture" , "zh" : "建筑" , "es" : "arquitectura" , "fr" : "architecture" },
            “产品” ：{ “en”：“产品” ， “ zh” ： “产品” ，“es” ：“产品” ，“fr” ：“产品” }，
            “生物” ：{ “en” ：“生物” ， “ zh” ：“生物” ，“es” ：“criatura” ，“fr” ：“生物” }，
            "cyberpunk" : { "en" : "cyberpunk" , " zh" : "赛博朋克" , "es" : "cyberpunk" , "fr" : "cyberpunk" },
            "夕日" : { "en" : "日落" , "zh" : "日落" , "es" : "日落" , "en" : "日落" },
            "日出" : { "en" : "日出" , "zh" : "日出" , "es" : "amanecer" , "fr" : "太阳杆" },
            "山" : { "en" : "mountain " , "zh" : "山脉" , "es" : "montaña" , "fr" : "montagne" },
            "森" : { "en" : "forest" , "zh" : "森林" , "es" : "bosque" , "fr" : "forêt" },
            "砂漠" : { "en" : "沙漠" , "zh" : "沙漠" , "es" : "沙漠" , "fr" : "沙漠" },
            "海" : { "en" : "ocean " , "zh" : "海洋" , "es" : "océano" , "fr" : "océan" },
            "都市" : { "en" : "city" , "zh" : "城市" , "es" : "ciudad" , "fr" : "ville" },
            "ネオン" : { "en" : " neon " , "zh" : "霓虹" , "es" : "neón" , "fr" : "néon" },
            "ドラマチック" : { "en" : " dramatic" , "zh" : "戏剧性的" , "es" : "dramático" , "fr" : "dramatique" },
            "シネマティック" : { "en" : "cinematic" , " zh" : "电影感" , "es" : "cinematográfico" , "fr" : "cinématographique" },
            " riaru " : { "en" : "realist " , "zh" : "写实" , "es" : "realista" , "fr" : "réaliste" },
            "水彩" : { "en" : "水彩" , "zh" : "水彩" , "es" : "水彩画" , "fr" : "水彩画" },
            "动漫" : { "en" : "动漫" , "zh" : "2D" , "es" : "动漫" , "fr" : "动漫" },
            "macro" : { "en" : "macro" , "zh" : "fine distance" , "es" : "macro" , "fr" : "macro" },
            " aiソメ" : { "en" : "等距" , " zh" : "等距" , "es" : "isométrico" , "fr" : "isométrique" },
            "空撮" : { "en" : "aerial" , "zh" : "航拍" , "es" : "aéreo" , "fr" : "aérien" },
            "鲜やか" : { "en" : "充满活力" , "zh" : "鲜艳" , "es" : "充满活力" , "fr" : "充满活力" },
            "粉彩" : { "en" : "粉彩" , "zh" : "粉彩" , "es" : "粉彩" , "fr" : "粉彩" },
            "monochrome" : { "en" : "monochrome" , "zh" : "monochrome" , "es" : "monocromo" , "fr" : "monochrome" },
            "Volumetric" : { "en" : " volumetric " , "zh" : "体积光" , "es" : " volumétrico" , "fr" : "volumétrique" },
            "Studio" : { "en" : "studio" , "zh" : "Tanabaku" , "es" : "estudio" , "fr" : "studio" },
            "质感" : { "en" : "texture" , "zh" : "质感" , "es" : "textura" , "fr" : "texture" },
        }，
    }
    同义词映射 = {
        "肖像" : [ "人物研究" , "特写头像" ],
        "landscape" : [ "全景" , "一览无余的景色" ],
        "character" : [ "figure" , "subject" ],
        "建筑" : [ "结构设计" , "城市天际线" ],
        "product" : [ "商品照片" , "产品目录渲染" ],
        "creature" : [ "幻想野兽" , "神话实体" ],
        "cyberpunk" : [ "未来主义" , "科技黑色霓虹" ],
        "sunset" : [ "黄金时段" , "暮色天空" ],
        "日出" : [ "黎明的光芒" , "晨曦" ],
        "mountain" : [ "alpine" , "summit" ],
        "forest" : [ "woodland" , "lush greenery" ],
        "沙漠" : [ "沙丘海" , "干旱广阔" ],
        "ocean" : [ "海景" , "海岸地平线" ],
        "city" : [ "urban" , "metropolitan" ],
        "neon" : [ "glowing" , "luminous" ],
        "dramatic" : [ "intense" , "theatrical" ],
        "cinematic" : [ "电影级" , "电影灯光" ],
        "realistic" : [ "photoreal" , "lifelike" ],
        "水彩画" : [ "绘画风格" , "柔和的笔触" ],
        "动漫" : [ "卡通渲染" , "风格化" ],
        "macro" : [ "近距离对焦" , "极致细节" ],
        "等距" : [ "轴测图" , "3D 网格" ],
        "aerial" : [ "鸟瞰" , "自上而下" ],
        "鲜艳" : [ "饱和" , "大胆的色彩" ],
        "pastel" : [ "柔和的调色板" , "柔和的色调" ],
        "monochrome" : [ "单色调" , "黑白" ],
        "volumetric" : [ "god rays" , "light shafts" ],
        "studio" : [ "可控照明" , "无缝背景" ],
        "texture" : [ "表面细节" , "材质触感" ],
        "lighting" : [ "照明" , "灯光设置" ],
        "夜景" : [ "夜色" , "夜幕" ],
        "肖像" : [ "人物写生" , "面部特写" ],
        "风景" : [ "自然景观" , "户外视野" ],
        "建筑" : [ "建筑线条" , "城市结构" ],
        "产品" : [ "商品展示" , "陈列照" ],
        "生物" : [ "奇幻生物" , "异兽" ],
        "赛博朋克" : [ "未来城市" , "霓虹未来" ],
        "日落" : [ "黄昏" , "余晖" ],
        "日出" : [ "黎明" , "晨光" ],
        "山脉" : [ "群山" , "高山" ],
        "森林" : [ "林海" , "密林" ],
        "沙漠" : [ "荒漠" , "沙海" ],
        "海洋" : [ "大海" , "海岸" ],
        "城市" : [ "都市" , "都会" ],
        "霓虹" : [ "灯带" , "光影" ],
        "写实" : [ "真实质感" , "逼真" ],
        "二次元" : [ "动漫风" , "卡通感" ],
        "微距" : [ "细节特写" , "超近距离" ],
    }

    场景关键字扩展 = {
        “赛博朋克” ：{
            “根据” ： [
                “霓虹大都市” 、“全息标牌” 、“镀铬小巷”
            ]，
            “上下文映射” ：{
                "rain" : [ "湿漉漉的街道倒影" , "雨雾" ],
                "night" : [ "午夜调色板" , "光迹" ],
                “肖像” ：[ “增强植入物” ，“数字化妆” ]
            }，
        }，
        “景观” ： {
            “根据” ： [
                “连绵起伏的山丘” 、“层次丰富的深度” 、“开阔的视野”
            ]，
            “上下文映射” ：{
                "sunset" : [ "晚霞" , "暖色边缘光" ],
                "日出" : [ "薄雾弥漫的黎明" , "柔和的晨雾" ],
                "森林" : [ "树线轮廓" , "山谷雾" ]
            }，
        }，
        “建筑学” ： {
            “根据” ： [
                “几何立面” 、“玻璃反射” 、“结构韵律”
            ]，
            “上下文映射” ：{
                "night" : [ "点亮的窗户" , "城市光芒" ],
                "sunrise" : [ "暖色立面光" ],
                "等距" : [ "轴测网格" , "清晰的线条" ]
            }，
        }，
        “产品” ： {
            “根据” ： [
                “摄影棚扫描” 、“浮动英雄镜头” 、“细节突出”
            ]，
            “上下文映射” ：{
                "macro" : [ "纹理特写" , "材质毛孔" ],
                "鲜艳" : [ "大胆的强调色" ],
                "pastel" : [ "柔和渐变背景" ]
            }，
        }，
        “生物” ：{
            “根据” ： [
                “幻想解剖学” 、“鳞片和毛皮混合” 、“富有表现力的姿势”
            ]，
            “上下文映射” ：{
                "森林" : [ "长满苔藓的地面" , "生物发光孢子" ],
                "沙漠" : [ "沙尘暴" , "风化的骨头" ],
                "ocean" : [ "珊瑚光辉" , "滴水" ]
            }，
        }，
        “肖像” ： {
            “根据” ： [
                “富有表现力的眼睛” 、“可控的焦点” 、“平衡的构图”
            ]，
            “上下文映射” ：{
                "studio" : [ "三点照明" , "无缝背景" ],
                "cyberpunk" : [ "故障音效" , "霓虹边缘" ],
                "水彩画" : [ "柔和边缘" , "渗色颜料" ]
            }，
        }，
        “宏” ：{
            “根据” ： [
                “浅深度” 、“微纹理” 、“散景球”
            ]，
            “上下文映射” ：{
                "flora" : [ "花粉粒" , "露珠" ],
                "产品" : [ "织物编织" , "机加工边缘" ],
            }，
        }，
        “日本动画片” ： {
            “根据” ： [
                “大胆的线条艺术” 、“卡通渲染高光” 、“富有表现力的姿势”
            ]，
            “上下文映射” ：{
                "肖像" : [ "闪亮的眼睛" , "风格化的头发" ],
                "city" : [ "动漫天际线" , "速度线" ],
                "fantasy" : [ "魔法光环" , "漂浮粒子" ],
            }，
        }，
        “日落” ：{
            “根据” ： [
                “温暖的渐变天空” 、“长长的阴影” 、“发光的地平线”
            ]，
            “上下文映射” ：{
                "ocean" : [ "水面倒影" , "闪光路径" ],
                "city" : [ "轮廓天际线" , "窗户辉光" ],
                "mountain" : [ "朝霞" , "山谷薄雾" ]
            }，
        }，
        “日出” ：{
            “根据” ： [
                “冷暖转变” 、“柔和的光线绽放” 、“清新的氛围”
            ]，
            “上下文映射” ：{
                "森林" : [ "雾带" , "阳光" ],
                "desert" : [ "沙丘亮点" , "清晨的寒意" ],
            }，
        }，
        “山” ： {
            “根据” ： [
                “山脊层” 、“雪盖” 、“空中透视”
            ]，
            “上下文映射” ：{
                "sunset" : [ "琥珀色高光" , "紫色阴影" ],
                "aerial" : [ "无人机优势" , "山谷地图" ],
                "森林" : [ "常绿带" ]
            }，
        }，
        “森林” ： {
            “根据” ： [
                “斑驳的光线” 、“茂密的树冠” 、“地面上的树叶”
            ]，
            “上下文映射” ：{
                "fog" : [ "浮雾" , "神光" ],
                "river" : [ "闪闪发光的溪流" , "湿漉漉的石头" ],
                "日出" : [ "光芒四射" ]
            }，
        }，
        “沙漠” ： {
            “根据” ： [
                “风蚀沙丘” 、“热浪闪烁” 、“阳光漂白的调色板”
            ]，
            “上下文映射” ：{
                "sunset" : [ "燃烧的地平线" , "凉爽的阴影" ],
                "traveler" : [ "足迹踪迹" , "翻滚斗篷" ],
            }，
        }，
        “海洋” ： {
            “根据” ： [
                “翻滚的海浪” 、“浪花” 、“海风”
            ]，
            “上下文映射” ：{
                "sunset" : [ "火热的倒影" ],
                "storm" : [ "白色风暴" , "乌云密布" ],
                "产品" : [ "湿润亮点" ]
            }，
        }，
        “城市” ： {
            “根据” ： [
                “分层的天际线” 、“繁忙的街道” 、“建筑网格”
            ]，
            “上下文映射” ：{
                "night" : [ "window constellations" , "traffic streaks" ],
                "rain" : [ "镜面沥青" , "雨伞人群" ],
                "isometric" : [ "倾斜移位微缩模型" ]
            }，
        }，
        “工作室” ： {
            “根据” ： [
                “柔光箱照明” 、“控制阴影” 、“干净的背景”
            ]，
            “上下文映射” ：{
                "product" : [ "桌面设置" , "反光卡" ],
                "portrait" : [ "beauty dish" , "catchlights" ],
            }，
        }，
        “体积” ：{
            “根据” ： [
                “神光” 、“光雾” 、“深度分层”
            ]，
            “上下文映射” ：{
                "forest" : [ "阳光穿过树枝" ],
                "cyberpunk" : [ "激光雾霾" ],
                "城市" : [ "大气视角" ]
            }，
        }，
        "赛博朋克" : {
            "base" : [ "霓虹街区" , "全息广告" , "高层天际" ],
            “上下文映射” ：{
                "夜景" : [ "灯光流线" , "夜色氛围" ],
                "雨" : [ "雨夜倒影" , "潮湿路面" ],
                "肖像" : [ "机械义体" , "发光纹路" ],
            }，
        }，
        "风景" : {
            "base" : [ "远山层叠" , "天空延展" , "前景引导线" ],
            “上下文映射” ：{
                "日落" : [ "金色余晖" , "剪影树线" ],
                "湖泊" : [ "镜面倒影" , "薄雾水汽" ],
            }，
        }，
        "建筑" : {
            "base" : [ "立面线条" , "节奏窗格" , "结构重复" ],
            “上下文映射” ：{
                "夜景" : [ "窗口灯光" , "街灯点缀" ],
                "日出" : [ "暖色光洗" , "长阴影" ]
            }，
        }，
        "产品" : {
            "base" : [ "无缝背景" , "高光描边" , "展示角度" ],
            “上下文映射” ：{
                "微距" : [ "材质纹理" , "细节刻线" ],
                "粉彩" : [ "柔和背景" ],
                "鲜艳" : [ "撞色配搭" ]
            }，
        }，
        "沙漠" : {
            "base" : [ "沙丘曲线" , "热浪扭曲" , "孤立植被" ],
            “上下文映射” ：{
                "旅人" : [ "足迹延伸" , "飘动长巾" ],
                "日落" : [ "橙红色调" ]
            }，
        }，
        "海洋" : {
            "base" : [ "浪花细节" , "蓝绿渐层" , "海风飞沫" ],
            “上下文映射” ：{
                "日出" : [ "金色海面" ],
                "风暴" : [ "碎浪" , "乌云压顶" ],
            }，
        }，
    }
    类别建议 = {
        “灯光” ： {
            "keywords" : { "电影" , "戏剧" , "工作室" , "霓虹灯" , "体积" , "日落" , "日出" },
            “选项” ： [
                “体积照明” ，
                “边缘光” ，
                “柔光箱设置” ，
                “彩色凝胶点缀” ，
                “全局照明”
            ]，
        }，
        “相机” ： {
            "关键词" : { "肖像" , "微距" , "空中" , "等距" , "风景" },
            “选项” ： [
                “85mm镜头” ，
                “移轴透视”
                “景深” ，
                “散景” ，
                “高分辨率”
            ]，
        }，
        “情绪” ： {
            "关键词" : { "戏剧性" , "充满活力" , "柔和" , "单色" , "日落" , "日出" },
            “选项” ： [
                “大气雾” ，
                “电影调色”
                “高对比度” ，
                “柔和梦幻的光芒” ，
                “喜怒无常的阴影”
            ]，
        }，
        “风格” ： {
            "keywords" : { "水彩" , "动漫" , "赛博朋克" , "现实" , "生物" , "建筑" },
            “选项” ： [
                “artstation 流行趋势” ，
                “虚幻引擎渲染” ，
                “辛烷渲染” ，
                “绘画笔触” ，
                “手绘线条艺术”
            ]，
        }，
        “颜色” ： {
            "关键词" : { "鲜艳" , "柔和" , "单色" , "日落" , "海洋" , "森林" },
            “选项” ： [
                “互补调色板” ，
                “类似颜色” ，
                “双色调处理” ，
                “分裂互补” ，
                “冷暖对比”
            ]，
        }，
        “作品” ： {
            "关键词" : { "肖像" , "产品" , "建筑" , "景观" , "城市" },
            “选项” ： [
                “三分法则”
                “引导线” ，
                “框架元素” ，
                “对称平衡” ，
                “负空间”
            ]，
        }，
        “材料” ： {
            “关键词” ：{ “纹理” ，“产品” ，“生物” ，“建筑” ，“现实” }，
            “选项” ： [
                “次表面散射” ，
                “粗糙度变化” ，
                “金属光泽” ，
                “织物褶皱” ，
                “风化表面”
            ]，
        }，
        “邮政” ： {
            “关键词” ：{ “赛博朋克” 、“电影” 、“活力” 、“单色” 、“工作室” }，
            “选项” ： [
                “降噪”
                “锐化通行证” ，
                “镜头光晕” ，
                “胶片颗粒” ，
                “光彩绽放”
            ]，
        }，
    }

    def available_languages ( self ) -> List [ Dict [ str , str ]]:
 
        返回[
            { “code” ：code，“label” ：label}表示代码，标签在self.LANGUAGE_LABELS.items ()
中 
        ]

    def detect_language ( self, text: str ) -> str :
 
        如果不是文本：
 
            返回“一” 
        如果re.search( r"[\u4e00-\u9fff]" , 文本):
            返回“zh” 
        如果重新搜索（r“[a-n-a-n]” ，文本）：
            返回“是” 
        如果re.search( r"[áéíóúñ]" , text.lower()):
            返回“es” 
        如果re.search( r"[lower" ，text.lower()):
            返回“fr” 
        返回“一” 

    def _normalize ( self, text: str ) -> str :
 
        cleaned = re.sub( r"\s+" ，" " ，text.strip().lower())
        返回清洁

    def _tokenize ( self, text: str ) -> List [ str ]:
 
        文本 =自身._normalize（文本）
        tokens = re.findall( r"[\w\-\u4e00-\u9fff]+" , 文本)
        返回令牌

    def _keywords ( self, tokens:序列[ str ] ) ->列表[ str ]:
 
        关键字：列表[ str ] = []
        已见 =设置()
        对于令牌中的令牌：
            如果标记在self.STOPWORDS中：
 
                继续
            如果看到令牌：
                继续
            seen.add（令牌）
            关键字.附加（标记）
        返回关键字

    def optimize_prompt ( self, text: str ) -> Dict [ str , Iterable[ str ]]:
 
        标记=自身._tokenize（文本）
        关键字 = self._keywords （标记）

        优先排序 =排序(
            关键词，
            键= lambda词：（-tokens.count（词），keywords.index（词）），
        ）

        部分：Dict [ str ，List [ str ]] = { “主题” ：[]，“样式” ：[]，“详细信息” ：[]}
        主题词 = {
            “肖像” ，
            “景观” ，
            “特点” ，
            “山” ，
            “森林” ，
            “建筑学” ，
            “产品” ，
            “生物”
            “海洋” ，
            “城市” ，
            “沙漠” ，
            "肖像" ,
            "风景" ,
            "山脉" ,
            "森林" ,
            "建筑" ,
            "产品" ,
            "生物" ,
            "海洋" ,
            "城市" ,
            "沙漠" ,
        }
        风格词 = {
            “赛博朋克” ，
            “水彩画” ，
            “数字的” ，
            “油” ，
            “像素” ，
            “日本动画片” ，
            “实际的” ，
            “电影式”
            "二次元" ,
            "写实" ,
        }

        对于优先考虑的单词：
            如果subject_words中有单词：
                部分[ “主题” ].附加（单词）
            style_words中的elif单词：
                部分[ “样式” ].附加（单词）
            别的：
                部分[ “详细信息” ].附加（单词）

        有序 = []
        如果部分[ “主题” ]：
            有序.附加（”，.join（部分[ “主题” ]））
        如果部分[ “样式” ]：
            有序.附加（”，.join（部分[ “样式” ]））
        如果部分[ “详细信息” ]：
            有序.附加（”，.join（部分[ “详细信息” ]））

        优化 = “;”。加入（有序）

        建议 = self._generate_suggestions （关键字）

        返回{
            "keywords" ：关键词，
            “优化” ：优化，
            "建议" : 建议，
        }

    def _generate_suggestions ( self, keywords: Sequence [ str ] ) -> Dict [ str , List [ str ]]:
 
        建议：Dict [ str ，List [ str ]] = {}
        keyword_set =设置（关键字）
        对于类别， self.CATEGORY_SUGGESTIONS.items ()
中的数据： 
            如果关键字集和数据[ “关键字” ]：
                建议[类别] = 数据[ “选项” ]
        退货建议

    def _scene_expansions （ 
        自我，关键字：str ，keyword_set：序列[ str ]，创造力：float
    ) ->列表[ str ]:
        如果关键字不在self.SCENE_KEYWORD_EXPANSIONS中：
  
            返回[]

        数据 = self.SCENE_KEYWORD_EXPANSIONS [关键字]
        选项：列表[ str ] =列表(data.get( "base" ，[]))
        context_map = 数据.get( “context_map” ，{})

        # 规范查找结构以便快速进行成员资格检查。
        设置关键词 =设置（关键词集）
        对于context_keyword，context_map.items()
中的短语：
            如果context_keyword在set_keywords 中：
                选项.扩展（短语）

        如果没有选项：
 
            返回[]

        # 根据创造力确定要出现的场景短语的数量。
        unique_options：列表[ str ] = []
        seen_options =设置（）
        对于选项中的选项：
            如果选项不在seen_options
中： 
                unique_options.append（选项）
                seen_options.add（选项）

        count = max ( 1 , int ( round (creativity * len (unique_options))))
        返回unique_options[:count]

    def expand_prompt ( self, keywords: Sequence [ str ], creativity: float = 0.5 ) -> str :
 
        创造力 =最大值（0.0 ，最小值（1.0 ，创造力））
        扩展部分：列表[ str ] = []
        对于关键词中的单词：
            片段：列表[ str ] = [word]

            同义词 = self.SYNONYM_MAP.get (word，[])
            if同义词：
                count = max ( 1 , int ( round ( 创造力 * len ( 同义词 ) ) )
                segments.append( f"同义修饰: { ', ' .join(synonyms[:count])} " )

            scene_phrases = self._scene_expansions （单词，关键词，创造力）
            如果场景短语：
                segments.append( f"场景关键词: { ', ' .join(scene_phrases)} " )

            expanded_pa​​rts.append( “|” .join(段))

        返回“；” 。加入（expanded_pa​​rts）
 

    def translate_prompt （ 
        自我，文本：str ，源语言：str ，目标语言：str
    ) -> str :
        如果源语言 == 目标语言：
            返回文本

        标记=自身._tokenize（文本）
        翻译的标记：列表[ str ] = []
        内存 =自身.TRANSLATION_MEMORY.获取（source_lang，{}）

        对于令牌中的令牌：
            翻译 =无
            如果token在内存中并且target_lang在内存[token]中：
                翻译 = 记忆[token][target_lang]
            别的：
                对于origin_lang，在self.TRANSLATION_MEMORY.items () 中对：
 
                    如果token成对出现且source_lang成对出现[token]：
                        中间体 = 对[token][source_lang]
                        翻译 = (
                            self.TRANSLATION_MEMORY.get (source_lang，{})
                            .get（中间，{}）
                            .获取（目标语言）
                        ）
                        如果翻译的话：
                            休息
            translated_tokens.append（翻译或标记）

        返回“ ” 。加入（翻译的标记）
 

    def process_prompt （ 
        自我，文本：str ，目标语言：序列[ str ]，创造力：浮点数
    ) -> 提示分析：
        source_lang = self.detect_language （文本）
        优化 = self.optimize_prompt （文本）
        expanded = self.expand_prompt （优化[ “关键词” ]，创造力）

        languages_order:列表[ str ] = []
        如果source_lang在self.LANGUAGE_LABELS中：
 
            languages_order.append（源语言）

        对于目标语言中的语言：
            如果lang在self.LANGUAGE_LABELS中且lang不在languages_order中：
  
                languages_order.append（语言）

        如果不是languages_order:
 
            languages_order.append（源语言）

        本地化文本：字典[ str ，str ] = {}
        对于languages_order中的lang ：
            如果lang == source_lang:
                localized_texts[lang] = 优化[ “优化” ]
            别的：
                localized_texts[lang] = self.translate_prompt (
                    优化[ “优化” ]，source_lang，lang
                ）

        翻译：Dict [ str ，Dict [ str ，str ]] = {}
        对于languages_order中的lang ：
            base_text = localized_texts.get(lang, 优化[ “优化” ])
            相互：Dict [ str ，str ] = {}
            对于其他语言的顺序：
                如果其他==语言：
                    继续
                mutual[other] = self.translate_prompt (base_text，lang，other)

            翻译[语言] = {
                “标签” ：self.LANGUAGE_LABELS.get （lang，lang），
                "base_text" ：基础文本，
                "mutual" : 相互的，
            }

        返回PromptAnalysis(
            检测到的语言= self.LANGUAGE_LABELS.get （source_lang，source_lang），
            检测到的语言代码=源语言，
            optimized_prompt=优化[ “优化” ]，
            关键词=优化[ “关键词” ]，
            expanded_prompt=扩展，
            翻译=翻译，
            建议=优化[ “建议” ]，
        ）


引擎 = PromptEngine()
