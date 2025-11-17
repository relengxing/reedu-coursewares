// 导航栏功能脚本
(function() {
    'use strict';

    // ============================================
    // 导航栏开关配置 - 修改这里控制导航栏显示/隐藏
    // true = 显示导航栏，false = 隐藏导航栏
    // ============================================
    const NAVIGATION_ENABLED = true;
    // ============================================

    // 如果导航栏被禁用，直接返回
    if (!NAVIGATION_ENABLED) {
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
        const path = window.location.pathname;
        const filename = path.split('/').pop() || path.split('\\').pop();
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

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }
})();

