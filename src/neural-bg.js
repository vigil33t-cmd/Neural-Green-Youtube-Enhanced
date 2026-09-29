/* ============================================================
   NEURAL BACKGROUND — JS-часть
   Плоская нейросетка на canvas. Реагирует на курсор.
   Зелёная, плотная, с длинными связями.
   ============================================================ */
(function () {
    'use strict';

    /* ---------- НАСТРОЙКИ ---------- */
    const CFG = {
        color: '51, 255, 51',
        density: 1 / 12000,
        maxParticles: 200,
        minParticles: 80,
        speed: 0.20,
        linkDist: 220,
        mouseRadius: 240,
        mousePull: 0.018,
        dotAlpha: 0.55,
        lineAlpha: 0.14,
        mouseBoost: 2.4
    };
    /* ------------------------------- */

    let __neuralInited = false;

    function init() {
        if (__neuralInited) return;
        __neuralInited = true;

        const old = document.getElementById('neural-bg-canvas');
        if (old) old.remove();

        const canvas = document.createElement('canvas');
        canvas.id = 'neural-bg-canvas';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d', { alpha: true });
        const DPR = Math.min(window.devicePixelRatio || 1, 2);

        let W = 0, H = 0;
        let particles = [];
        const mouse = { x: -9999, y: -9999, active: false };

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = Math.floor(W * DPR);
            canvas.height = Math.floor(H * DPR);
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            spawn();
        }

        function spawn() {
            const area = W * H;
            let count = Math.floor(area * CFG.density);
            count = Math.max(CFG.minParticles, Math.min(CFG.maxParticles, count));

            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * CFG.speed,
                    vy: (Math.random() - 0.5) * CFG.speed,
                    r: 0.9 + Math.random() * 1.2
                });
            }
        }

        function frame() {
            ctx.clearRect(0, 0, W, H);

            /* --- обновление --- */
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (mouse.active) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const d2 = dx * dx + dy * dy;
                    const r2 = CFG.mouseRadius * CFG.mouseRadius;
                    if (d2 < r2 && d2 > 0.0001) {
                        const d = Math.sqrt(d2);
                        const force = (1 - d / CFG.mouseRadius) * CFG.mousePull;
                        p.vx += (dx / d) * force;
                        p.vy += (dy / d) * force;
                    }
                }

                p.vx *= 0.985;
                p.vy *= 0.985;

                if (Math.hypot(p.vx, p.vy) < 0.05) {
                    p.vx += (Math.random() - 0.5) * 0.05;
                    p.vy += (Math.random() - 0.5) * 0.05;
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -10) p.x = W + 10;
                if (p.x > W + 10) p.x = -10;
                if (p.y < -10) p.y = H + 10;
                if (p.y > H + 10) p.y = -10;
            }

            /* --- линии --- */
            const link2 = CFG.linkDist * CFG.linkDist;
            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 > link2) continue;

                    const d = Math.sqrt(d2);
                    let alpha = (1 - d / CFG.linkDist) * CFG.lineAlpha;

                    if (mouse.active) {
                        const mx = (a.x + b.x) * 0.5 - mouse.x;
                        const my = (a.y + b.y) * 0.5 - mouse.y;
                        const md = Math.sqrt(mx * mx + my * my);
                        if (md < CFG.mouseRadius) {
                            alpha += (1 - md / CFG.mouseRadius)
                                   * CFG.lineAlpha
                                   * CFG.mouseBoost;
                        }
                    }

                    if (alpha < 0.004) continue;

                    ctx.strokeStyle = 'rgba(' + CFG.color + ',' + alpha.toFixed(3) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            /* --- точки --- */
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                let alpha = CFG.dotAlpha;

                if (mouse.active) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < CFG.mouseRadius) {
                        alpha += (1 - d / CFG.mouseRadius)
                               * CFG.dotAlpha
                               * CFG.mouseBoost;
                    }
                }
                if (alpha > 1) alpha = 1;

                ctx.fillStyle = 'rgba(' + CFG.color + ',' + alpha.toFixed(3) + ')';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(frame);
        }

        window.addEventListener('resize', resize);

        window.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        });

        window.addEventListener('mouseleave', function () {
            mouse.active = false;
        });

        window.addEventListener('touchmove', function (e) {
            const t = e.touches[0];
            if (!t) return;
            mouse.x = t.clientX;
            mouse.y = t.clientY;
            mouse.active = true;
        }, { passive: true });

        window.addEventListener('touchend', function () {
            mouse.active = false;
        });

        resize();
        frame();
    }

    if (document.body) init();
    else document.addEventListener('DOMContentLoaded', init);
})();
