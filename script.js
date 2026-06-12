document.addEventListener('DOMContentLoaded', () => {
    // NEON SWARM INTERACTIVE BACKGROUND (High Visual Impact & Physics)
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    }
    resizeCanvas();
    
    let particles = [];
    let mouse = { x: canvas.width/2, y: canvas.height/2, active: false };
    
    function initSwarm() {
        particles = [];
        const numParticles = Math.floor((canvas.width * canvas.height) / 9000); // Alta densidad
        for (let i = 0; i < numParticles; i++) {
            particles.push(new SwarmParticle());
        }
    }

    class SwarmParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 2 + 1;
            this.color = '#39ff14'; // Verde Neón
        }
        
        update() {
            if (mouse.active) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                // Efecto de Vórtice / Gravedad hacia el ratón
                if (distance < 350) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    
                    // Rotación (swirl)
                    let swirlForceX = forceDirectionY;
                    let swirlForceY = -forceDirectionX;
                    
                    let force = (350 - distance) / 350;
                    
                    this.vx += forceDirectionX * force * 0.8 + swirlForceX * force * 0.5;
                    this.vy += forceDirectionY * force * 0.8 + swirlForceY * force * 0.5;
                }
            } else {
                // Si el ratón no está activo, las partículas regresan suavemente a sus bases
                let dx = this.baseX - this.x;
                let dy = this.baseY - this.y;
                this.vx += dx * 0.002;
                this.vy += dy * 0.002;
            }
            
            // Fricción para evitar velocidad infinita
            this.vx *= 0.92;
            this.vy *= 0.92;
            
            // Movimiento errático base
            this.vx += (Math.random() - 0.5) * 0.6;
            this.vy += (Math.random() - 0.5) * 0.6;
            
            this.x += this.vx;
            this.y += this.vy;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }
    }

    initSwarm();

    // Eventos del ratón
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y + window.scrollY;
        mouse.active = true;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.active = false;
    });

    // Explosión al hacer click
    window.addEventListener('click', (e) => {
        let clickX = e.x;
        let clickY = e.y + window.scrollY;
        for (let i = 0; i < particles.length; i++) {
            let dx = particles[i].x - clickX;
            let dy = particles[i].y - clickY;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < 400) {
                let force = (400 - distance) / 400;
                // Empuje explosivo masivo
                particles[i].vx += (dx / distance) * force * 30;
                particles[i].vy += (dy / distance) * force * 30;
            }
        }
    });

    function animateSwarm() {
        // Efecto de rastro de luz (Light Trail) en vez de borrar todo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Rayos láser hacia el ratón si están súper cerca
            if (mouse.active) {
                let dx = mouse.x - particles[i].x;
                let dy = mouse.y - particles[i].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(57, 255, 20, ${1 - dist/150})`;
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateSwarm);
    }
    
    animateSwarm();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initSwarm();
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
