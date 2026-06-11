document.addEventListener('DOMContentLoaded', () => {
    // MATRIX RAIN EFFECT - Bulletproof Setup
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    // Make canvas exact size of the viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const letters = '01';
    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = [];
    
    // Initialize drops at random Y positions so the screen is full immediately
    for (let x = 0; x < columns; x++) {
        drops[x] = (Math.random() * canvas.height) / fontSize;
    }
    
    function draw() {
        // Semi-transparent black to create the fading tail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Neon green text
        ctx.fillStyle = '#39ff14';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // If drop reaches the bottom, randomly reset it to the top
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 33); // 30fps smooth
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        let newDrops = [];
        for (let x = 0; x < columns; x++) {
            newDrops[x] = drops[x] !== undefined ? drops[x] : (Math.random() * canvas.height) / fontSize;
        }
        drops = newDrops;
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
