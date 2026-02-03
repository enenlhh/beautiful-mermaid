import { renderMermaid, THEMES } from './dist/index.js';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'my_diagrams';

// ============================================
// 1. 定义三种不同风格的主题
// ============================================

const STYLES = {
    // 风格 A: 极简苹果风 (Apple/Clean)
    apple: {
        theme: {
            bg: '#ffffff',
            fg: '#1d1d1f',
            line: '#d2d2d7',     // 浅灰色连接线
            accent: '#0071e3',   // Apple Blue
            surface: '#f5f5f7',  // 浅灰背景填充
            border: '#d2d2d7',   // 边框色
            muted: '#86868b',    // 次要文字颜色
        },
        name: 'Apple_Style'
    },

    // 风格 B: 霓虹赛博朋克 (Cyberpunk)
    cyber: {
        theme: {
            bg: '#09090b',       // 近乎纯黑
            fg: '#e4e4e7',
            line: '#3f3f46',
            accent: '#22d3ee',   // 青色霓虹
            surface: '#18181b',  // 深色填充
            border: '#27272a',
            font: 'JetBrains Mono', // 代码字体
        },
        name: 'Cyberpunk_Style'
    },

    // 风格 C: 官方推荐 (Tokyo Night) - 之前用的
    tokyo: {
        theme: THEMES['tokyo-night'],
        name: 'Tokyo_Night'
    }
};

// ============================================
// 2. 复杂的图表内容
// ============================================
const diagram = `
graph LR
    %% 样式类定义
    classDef plain fill:var(--bg),stroke:var(--line),color:var(--fg)
    classDef accent fill:var(--accent),stroke:var(--accent),color:#fff,stroke-width:2px
    classDef surface fill:var(--surface),stroke:var(--border),color:var(--fg)

    Start((开始)):::accent --> Init[初始化系统]:::surface
    
    subgraph Core [ 核心处理 ]
        direction TB
        Init --> Check{检查状态}:::plain
        Check -->|正常| Process[数据处理]:::surface
        Check -->|异常| Error[记录日志]:::plain
        Process --> Save[(持久化存储)]:::surface
    end
    
    Save --> API{{调用外部接口}}:::plain
    API --> End(((流程结束))):::accent

    %% 虚线连接
    Error -.-> End
`;

// ============================================
// 3. 批量生成
// ============================================
(async () => {
    const fullOutputDir = path.resolve(process.cwd(), OUTPUT_DIR);
    if (!fs.existsSync(fullOutputDir)) {
        fs.mkdirSync(fullOutputDir, { recursive: true });
    }

    console.log('🎨 正在生成 3 种不同风格的图表，请稍候...');

    for (const [key, style] of Object.entries(STYLES)) {
        try {
            // 渲染
            const svg = await renderMermaid(diagram, style.theme);

            // 保存
            const filePath = path.join(fullOutputDir, `Diagram_${style.name}.svg`);
            fs.writeFileSync(filePath, svg);
            console.log(`✅ 已生成: ${filePath}`);
        } catch (e) {
            console.error(`❌ 生成 ${style.name} 失败:`, e);
        }
    }

    console.log('\n✨ 全部完成！请打开文件夹查看对比。');
})();
