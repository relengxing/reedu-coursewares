// 导航栏功能脚本
(function() {
    'use strict';

    // ============================================
    // 功能开关配置 - 修改这里控制各功能的显示/隐藏
    // ============================================
    const NAVIGATION_ENABLED = true;    // 导航栏开关
    const TIMER_ENABLED = true;          // 倒计时工具开关
    const SECTION_NAV_ENABLED = true;    // Section左右导航按键开关
    // ============================================

    // 如果所有功能都被禁用，直接返回
    if (!NAVIGATION_ENABLED && !TIMER_ENABLED && !SECTION_NAV_ENABLED) {
        return;
    }

    // 页面配置
    const pages = [
        {
            url: '0.封面页.html',
            title: '封面页',
            icon: '📄',
            desc: '课件封面与课程信息'
        },
        { 
            url: '1.目录页.html',
            title: '目录页', 
            icon: '📚',
            desc: '返回课件目录'
        },
        {
            url: '2.火车过隧道.html', 
            title: '火车过隧道', 
            icon: '🚂',
            desc: '通过动画演示理解火车过隧道问题'
        },
        { 
            url: '3.环形道路相遇问题.html', 
            title: '环形道路相遇问题', 
            icon: '🏃',
            desc: '学习环形跑道中的相遇与追及问题'
        },
        { 
            url: '4.上下坡问题.html', 
            title: '上下坡问题', 
            icon: '⛰️',
            desc: '分析上下坡过程中的速度变化'
        },
        { 
            url: '5.随堂练习-选择题.html', 
            title: '随堂练习 - 选择题', 
            icon: '✅',
            desc: '通过选择题巩固所学知识'
        },
        { 
            url: '6.随堂练习-填空题.html', 
            title: '随堂练习 - 填空题', 
            icon: '✏️',
            desc: '填空题练习，检验理解程度'
        },
        { 
            url: '7.随堂练习-应用题.html', 
            title: '随堂练习 - 应用题', 
            icon: '📝',
            desc: '综合应用题，提升解题能力'
        }
    ];

    // 获取当前页面文件名
    function getCurrentPage() {
        // 优先使用 pathname
        let path = window.location.pathname;
        let filename = path.split('/').pop() || path.split('\\').pop();
        
        // 如果 pathname 为空（可能是 file:// 协议），尝试使用 href
        if (!filename || filename === '') {
            const href = window.location.href;
            // 处理 file:// 协议
            if (href.startsWith('file://')) {
                filename = href.split('/').pop() || href.split('\\').pop();
                // 移除可能的查询参数和锚点
                filename = filename.split('?')[0].split('#')[0];
            } else {
                // 处理 http:// 或 https:// 协议
                filename = href.split('/').pop();
                filename = filename.split('?')[0].split('#')[0];
            }
        }
        
        return filename || '1.目录页.html';
    }

    // 创建导航栏HTML
    function createNavigationHTML() {
        const currentPage = getCurrentPage();
        
        let menuHTML = '<div class="nav-menu">';
        
        pages.forEach(page => {
            const isActive = page.url === currentPage ? 'active' : '';
            menuHTML += `
                <a href="${page.url}" class="nav-menu-item ${isActive}">
                    <span class="nav-menu-item-icon">${page.icon}</span>
                    <span class="nav-menu-item-text">${page.title}</span>
                    <div class="nav-menu-item-desc">${page.desc}</div>
                </a>
            `;
        });
        
        menuHTML += '</div>';
        
        return `
            <div class="nav-overlay" id="navOverlay"></div>
            <div class="nav-container" id="navContainer">
                <button class="nav-close-btn" id="navCloseBtn">×</button>
                <div class="nav-header">
                    <h2>📚 课件导航</h2>
                    <p>快速跳转到任意页面</p>
                </div>
                ${menuHTML}
                <div class="nav-footer">
                    <p>按 ESC 键关闭导航</p>
                    <p style="margin-top: 5px; font-size: 0.85rem;">海旺学校 数学教研组</p>
                </div>
            </div>
            <button class="nav-toggle-btn" id="navToggleBtn" title="显示/隐藏导航 (ESC)">☰</button>
        `;
    }

    // 初始化导航栏
    function initNavigation() {
        // 检查是否已存在导航栏
        if (document.getElementById('navContainer')) {
            return;
        }

        // 创建导航栏
        const navHTML = createNavigationHTML();
        document.body.insertAdjacentHTML('beforeend', navHTML);

        // 获取元素
        const navOverlay = document.getElementById('navOverlay');
        const navContainer = document.getElementById('navContainer');
        const navToggleBtn = document.getElementById('navToggleBtn');
        const navCloseBtn = document.getElementById('navCloseBtn');

        // 切换导航栏显示/隐藏
        function toggleNav() {
            const isShowing = navContainer.classList.contains('show');
            if (isShowing) {
                hideNav();
            } else {
                showNav();
            }
        }

        // 显示导航栏
        function showNav() {
            navOverlay.classList.add('show');
            navContainer.classList.add('show');
            navToggleBtn.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        }

        // 隐藏导航栏
        function hideNav() {
            navOverlay.classList.remove('show');
            navContainer.classList.remove('show');
            navToggleBtn.classList.remove('active');
            document.body.style.overflow = ''; // 恢复滚动
        }

        // 绑定事件
        navToggleBtn.addEventListener('click', toggleNav);
        navCloseBtn.addEventListener('click', hideNav);
        navOverlay.addEventListener('click', hideNav);

        // ESC键关闭导航栏
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                hideNav();
            }
        });

        // 点击导航菜单项后关闭导航栏（移动端体验优化）
        const navMenuItems = document.querySelectorAll('.nav-menu-item');
        navMenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // 如果是当前页面，不跳转，只关闭导航栏
                if (this.classList.contains('active')) {
                    e.preventDefault();
                    hideNav();
                } else {
                    // 延迟关闭，让跳转动画更流畅
                    setTimeout(hideNav, 200);
                }
            });
        });
    }

    // ============================================
    // 倒计时工具（通过meta标签控制显示）
    // ============================================
    function initTimer() {
        if (!TIMER_ENABLED) return;

        // 检查页面是否有启用计时器的meta标签
        // 格式：<meta name="enable-timer" content="true">
        const timerMeta = document.querySelector('meta[name="enable-timer"]');
        const isTimerEnabled = timerMeta && 
                              (timerMeta.getAttribute('content') === 'true' || 
                               timerMeta.getAttribute('content') === '1');
        
        if (!isTimerEnabled) {
            return;
        }

        // 检查是否已存在计时器
        if (document.getElementById('globalTimer')) {
            return;
        }

        // 创建计时器HTML
        const timerHTML = `
            <div class="global-timer" id="globalTimer" title="点击开始计时，再次点击重置">
                <span class="timer-icon">⏱️</span>
                <span class="timer-text" id="timerText">00:00</span>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', timerHTML);

        const timerElement = document.getElementById('globalTimer');
        const timerText = document.getElementById('timerText');
        
        let startTime = null;
        let timerInterval = null;
        let isRunning = false;

        function updateTimer() {
            if (!startTime) return;
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function startTimer() {
            startTime = Date.now();
            isRunning = true;
            timerElement.classList.add('running');
            timerElement.classList.remove('not-started');
            timerInterval = setInterval(updateTimer, 1000);
            updateTimer();
        }

        function resetTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            startTime = null;
            isRunning = false;
            timerElement.classList.remove('running');
            timerElement.classList.add('not-started');
            timerText.textContent = '00:00';
        }

        // 点击切换：未开始→开始，运行中→重置
        timerElement.addEventListener('click', function() {
            if (!isRunning) {
                startTimer();
            } else {
                resetTimer();
            }
        });

        // 初始状态
        timerElement.classList.add('not-started');
    }

    // ============================================
    // Section导航按键
    // ============================================
    function initSectionNavigation() {
        if (!SECTION_NAV_ENABLED) return;

        // 检查是否已存在导航按键
        if (document.getElementById('sectionNavLeft')) {
            return;
        }

        // 创建导航按键HTML
        const navButtonsHTML = `
            <button class="section-nav-btn section-nav-left" id="sectionNavLeft" title="上一页/上一部分 (←)">
                ‹
            </button>
            <button class="section-nav-btn section-nav-right" id="sectionNavRight" title="下一页/下一部分 (→)">
                ›
            </button>
        `;
        document.body.insertAdjacentHTML('beforeend', navButtonsHTML);

        const leftBtn = document.getElementById('sectionNavLeft');
        const rightBtn = document.getElementById('sectionNavRight');

        // 获取所有section
        const sections = Array.from(document.querySelectorAll('section[data-section]'));
        
        // 获取当前可见的section
        function getCurrentSection() {
            const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + scrollPos;
                
                if (scrollPos >= sectionTop - windowHeight / 3) {
                    return i;
                }
            }
            return 0;
        }

        // 平滑滚动到指定section
        function scrollToSection(index) {
            if (index >= 0 && index < sections.length) {
                sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // 获取当前页面的索引
        function getCurrentPageIndex() {
            const currentPage = getCurrentPage();
            return pages.findIndex(page => page.url === currentPage);
        }

        // 导航到下一个section或下一页
        function navigateNext() {
            const currentSectionIndex = getCurrentSection();
            
            if (currentSectionIndex < sections.length - 1) {
                // 如果不是最后一个section，滚动到下一个section
                scrollToSection(currentSectionIndex + 1);
            } else {
                // 如果是最后一个section，跳转到下一个课件
                const currentPageIndex = getCurrentPageIndex();
                if (currentPageIndex >= 0 && currentPageIndex < pages.length - 1) {
                    window.location.href = pages[currentPageIndex + 1].url;
                }
            }
        }

        // 导航到上一个section或上一页
        function navigatePrev() {
            const currentSectionIndex = getCurrentSection();
            
            if (currentSectionIndex > 0) {
                // 如果不是第一个section，滚动到上一个section
                scrollToSection(currentSectionIndex - 1);
            } else {
                // 如果是第一个section，跳转到上一个课件的最后
                const currentPageIndex = getCurrentPageIndex();
                if (currentPageIndex > 0) {
                    window.location.href = pages[currentPageIndex - 1].url;
                }
            }
        }

        // 更新按钮状态
        function updateButtonStates() {
            const currentSectionIndex = getCurrentSection();
            const currentPageIndex = getCurrentPageIndex();

            // 左按钮：第一页的第一个section时禁用
            if (currentPageIndex === 0 && currentSectionIndex === 0) {
                leftBtn.classList.add('disabled');
            } else {
                leftBtn.classList.remove('disabled');
            }

            // 右按钮：最后一页的最后一个section时禁用
            if (currentPageIndex === pages.length - 1 && currentSectionIndex === sections.length - 1) {
                rightBtn.classList.add('disabled');
            } else {
                rightBtn.classList.remove('disabled');
            }
        }

        // 绑定点击事件
        leftBtn.addEventListener('click', navigatePrev);
        rightBtn.addEventListener('click', navigateNext);

        // 键盘导航
        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return; // 在输入框中不响应键盘导航
            }

            if (e.key === 'ArrowLeft' || e.keyCode === 37) {
                e.preventDefault();
                navigatePrev();
            } else if (e.key === 'ArrowRight' || e.keyCode === 39) {
                e.preventDefault();
                navigateNext();
            }
        });

        // 监听滚动，更新按钮状态
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateButtonStates, 100);
        });

        // 初始更新按钮状态
        updateButtonStates();
    }

    // ============================================
    // 页面加载完成后初始化所有功能
    // ============================================
    function initAll() {
        if (NAVIGATION_ENABLED) {
            initNavigation();
        }
        if (TIMER_ENABLED) {
            initTimer();
        }
        if (SECTION_NAV_ENABLED) {
            initSectionNavigation();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

