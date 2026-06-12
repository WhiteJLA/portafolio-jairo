document.addEventListener('DOMContentLoaded', () => {
    // VECTOR NETWORK BACKGROUND (Dynamic Programming / Spatial Vectors)
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    }
    resizeCanvas();
    
    // Generación dinámica de partículas basada en el tamaño de la pantalla
    let particles = [];
    function initParticles() {
        particles = [];
        const numParticles = Math.floor((canvas.width * canvas.height) / 12000);
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
                radius: Math.random() * 2 + 1
            });
        }
    }
    initParticles();

    // Interacción con el ratón
    let mouse = { x: null, y: null, radius: 180 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y + window.scrollY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function drawVectors() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            // Actualizar posición
            p.x += p.vx;
            p.y += p.vy;
            
            // Rebote en los bordes
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            // Interacción dinámica con el cursor (Física de repulsión)
            if (mouse.x != null) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    p.x -= (dx / distance) * force * 3;
                    p.y -= (dy / distance) * force * 3;
                }
            }
            
            // Dibujar el nodo (vector)
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#39ff14';
            ctx.fill();
            
            // Algoritmo de conexiones (Cálculo de distancias optimizado O(n^2 / 2))
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 120) {
                    ctx.beginPath();
                    // La opacidad de la línea depende dinámicamente de la distancia
                    ctx.strokeStyle = `rgba(57, 255, 20, ${1 - dist/120})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawVectors);
    }
    
    // Iniciar el renderizado
    drawVectors();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles(); // Regenerar malla vectorial al cambiar tamaño
    });

    // SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // NAVBAR SCROLL EFFECT
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

});
