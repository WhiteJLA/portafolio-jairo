document.addEventListener('DOMContentLoaded', () => {
    // GRID MATEMÁTICO DINÁMICO (Estilo peo.html de alta resolución)
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    
    let mouse = { x: canvas.width / 2, y: canvas.height / 2, targetX: canvas.width / 2, targetY: canvas.height / 2 };
    
    const spacing = 22; // Alta resolución (menor espaciado = más puntos)
    const points = [];
    
    function initGrid() {
        points.length = 0;
        // Se expande un poco más allá de los bordes para que la onda no se corte
        for (let x = -50; x < canvas.width + 50; x += spacing) {
            for (let y = -50; y < canvas.height + 50; y += spacing) {
                points.push({ originX: x, originY: y, x: x, y: y });
            }
        }
    }
    initGrid();

    // Eventos del ratón para el grid
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    function animateGrid(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Suavizado del movimiento del mouse (LERP)
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;

        ctx.fillStyle = '#39ff14';

        points.forEach(p => {
            // Cálculo de distancia al mouse
            const dx = mouse.x - p.originX;
            const dy = mouse.y - p.originY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Alteración matemática usando ondas
            const force = Math.sin(distance * 0.05 - time * 0.004) * 20;
            
            // Desplazamiento
            const angle = Math.atan2(dy, dx);
            p.x = p.originX + Math.cos(angle) * force;
            p.y = p.originY + Math.sin(angle) * force;

            // Renderizar los nodos matemáticos
            // Opacidad base muy alta (0.6) para que NUNCA se vea el fondo negro, 
            // con un pequeño brillo extra (hasta 1.0) cerca del ratón.
            const opacity = Math.max(0.6, 1 - distance / 600);
            ctx.fillStyle = `rgba(57, 255, 20, ${opacity})`;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animateGrid);
    }
    
    // Iniciar el renderizado
    requestAnimationFrame(animateGrid);
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initGrid();
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
