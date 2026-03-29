// 等待页面DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // ========== 1. 回到顶部功能 ==========
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== 2. 明暗主题切换功能 ==========
    const themeToggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      html.classList.add('dark');
      themeToggleBtn.textContent = '☀️';
      themeToggleBtn.setAttribute('aria-label', '切换亮色模式');
    } else {
      themeToggleBtn.textContent = '🌙';
      themeToggleBtn.setAttribute('aria-label', '切换暗色模式');
    }

    themeToggleBtn.addEventListener('click', function() {
      const isDark = html.classList.toggle('dark');
      if (isDark) {
        this.textContent = '☀️';
        this.setAttribute('aria-label', '切换亮色模式');
        localStorage.setItem('theme', 'dark');
      } else {
        this.textContent = '🌙';
        this.setAttribute('aria-label', '切换暗色模式');
        localStorage.setItem('theme', 'light');
      }
    });

    // ========== 3. 汉堡菜单功能 ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function() {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.textContent = isOpen ? '✕' : '☰';
      hamburger.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
    });

    // 点击菜单项后自动关闭
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('open');
        hamburger.textContent = '☰';
        hamburger.setAttribute('aria-label', '打开菜单');
      });
    });
  });