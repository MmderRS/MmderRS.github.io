const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 粒子类
class Particle {
    constructor(x, y, color, angle, speed, gravity = 0.08) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.speed = speed;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.012 + 0.01;
        this.gravity = gravity;
        this.radius = Math.random() * 2.5 + 1;
        this.trail = [];
    }

    update() {
        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > 6) this.trail.shift();
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw() {
        // 拖尾
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            const ratio = i / this.trail.length;
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.radius * ratio * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace('1)', `${t.alpha * ratio * 0.4})`);
            ctx.fill();
        }
        // 主粒子
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('1)', `${this.alpha})`);
        ctx.fill();
        // 发光
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        glow.addColorStop(0, this.color.replace('1)', `${this.alpha * 0.4})`));
        glow.addColorStop(1, this.color.replace('1)', '0)'));
        ctx.fillStyle = glow;
        ctx.fill();
    }

    isDead() { return this.alpha <= 0; }
}

// 爱心形状粒子
class HeartParticle extends Particle {
    constructor(x, y, color, angle, speed) {
        super(x, y, color, angle, speed, 0.05);
        this.size = Math.random() * 8 + 4;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color.replace('1)', `${this.alpha})`);
        ctx.font = `${this.size * 2}px serif`;
        ctx.fillText('❤', this.x, this.y);
        ctx.restore();
    }
}

// 星星粒子
class StarParticle extends Particle {
    constructor(x, y, color, angle, speed) {
        super(x, y, color, angle, speed, 0.04);
        this.size = Math.random() * 6 + 3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.2;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color.replace('1)', `${this.alpha})`);
        ctx.font = `${this.size * 2}px serif`;
        ctx.fillText('⭐', -this.size, this.size);
        ctx.restore();
        this.rotation += this.rotSpeed;
    }
}

// 烟花火箭
class Rocket {
    constructor(x, targetY, color) {
        this.x = x;
        this.y = canvas.height;
        this.targetY = targetY;
        this.color = color;
        this.speed = Math.random() * 4 + 8;
        this.trail = [];
        this.exploded = false;
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 12) this.trail.shift();
        this.y -= this.speed;
        this.speed *= 0.99;
        if (this.y <= this.targetY) this.exploded = true;
    }

    draw() {
        for (let i = 0; i < this.trail.length; i++) {
            const ratio = i / this.trail.length;
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, 2 * ratio, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace('1)', `${ratio * 0.8})`);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
}

// 颜色库
const COLORS = [
    'rgba(255, 100, 200, 1)',
    'rgba(255, 215, 0, 1)',
    'rgba(100, 200, 255, 1)',
    'rgba(200, 100, 255, 1)',
    'rgba(100, 255, 180, 1)',
    'rgba(255, 150, 50, 1)',
    'rgba(255, 80, 80, 1)',
    'rgba(180, 255, 100, 1)',
];

function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

// 爆炸效果
function explode(x, y, type = 'normal') {
    const color = randomColor();
    const count = type === 'heart' ? 40 : type === 'star' ? 50 : 80;

    if (type === 'heart') {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = Math.random() * 3 + 1.5;
            particles.push(new HeartParticle(x, y, color, angle, speed));
        }
        // 外圈普通粒子
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            particles.push(new Particle(x, y, color, angle, speed));
        }
    } else if (type === 'star') {
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 / 20) * i;
            const speed = Math.random() * 4 + 2;
            particles.push(new StarParticle(x, y, color, angle, speed));
        }
        for (let i = 0; i < 60; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 1;
            particles.push(new Particle(x, y, randomColor(), angle, speed));
        }
    } else {
        // 普通球形爆炸
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.2;
            const speed = Math.random() * 5 + 2;
            particles.push(new Particle(x, y, color, angle, speed));
        }
        // 内圈慢速粒子
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 0.5;
            particles.push(new Particle(x, y, randomColor(), angle, speed, 0.05));
        }
    }
}

const particles = [];
const rockets = [];

// 点击发射烟花
canvas.addEventListener('click', (e) => {
    const x = e.clientX;
    const targetY = e.clientY;
    const color = randomColor();
    for (let i = 0; i < 3; i++) {
        const rx = x + (Math.random() - 0.5) * 60;
        rockets.push(new Rocket(rx, targetY + (Math.random() - 0.5) * 40, color));
    }
});

// 自动发射
function autoLaunch() {
    const types = ['normal', 'normal', 'heart', 'star'];
    const type = types[Math.floor(Math.random() * types.length)];
    const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
    const targetY = Math.random() * canvas.height * 0.5 + 50;
    const color = randomColor();
    const count = type === 'normal' ? 2 : 1;
    for (let i = 0; i < count; i++) {
        const rx = x + (Math.random() - 0.5) * 80;
        const r = new Rocket(rx, targetY + (Math.random() - 0.5) * 60, color);
        r._type = type;
        rockets.push(r);
    }
}

setInterval(autoLaunch, 1200);

// 主循环
function animate() {
    requestAnimationFrame(animate);

    // 半透明遮罩，形成拖尾消散效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新火箭
    for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        r.draw();
        if (r.exploded) {
            const type = r._type || (Math.random() < 0.3 ? 'heart' : Math.random() < 0.5 ? 'star' : 'normal');
            explode(r.x, r.y, type);
            rockets.splice(i, 1);
        }
    }

    // 更新粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].isDead()) particles.splice(i, 1);
    }
}

animate();

