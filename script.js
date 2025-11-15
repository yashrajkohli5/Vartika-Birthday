document.addEventListener('DOMContentLoaded', () => {

    console.log("Website is ready!");

    // Get elements
    const giftBox = document.getElementById('gift-box');
    const clickPrompt = document.getElementById('click-prompt');
    const cheerSound = document.getElementById('cheer-sound');
    const balloonContainer = document.querySelector('.balloon-container');
    const birthdayMessage = document.getElementById('birthday-message');
    const mainTitle = document.getElementById('main-title'); // Get the main title

    // --- Get Music and Video elements ---
    const backgroundMusic = document.getElementById('background-music');
    const birthdayVideo = document.querySelector('.birthday-video');

    // Canvas setup for confetti
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let isFlowing = false; // Switch for continuous flow
    const colors = ['#d90368', '#ff69b4', '#fbe7b2', '#00bfff', '#39ff14', '#ffd700'];

    // --- Gift Box Click Event ---
    giftBox.addEventListener('click', () => {
        
        console.log("Gift box clicked!");

        if (giftBox.classList.contains('open')) {
            return;
        }
        
        giftBox.classList.add('open');
        
        // --- THIS IS THE COLLAPSE FIX ---
        clickPrompt.style.opacity = '0';
        clickPrompt.style.height = '0'; // Collapse its height
        clickPrompt.style.margin = '0'; // Remove its margin
        
        // --- Play background music ---
        backgroundMusic.volume = 0.3; 
        backgroundMusic.play().catch(e => console.warn("Music play failed."));
        
        // cheerSound.play().catch(e => console.warn("Audio play failed.")); // Keep this commented
        
        isFlowing = true; // Start the confetti

        // This block runs after 500ms (0.5 seconds)
        setTimeout(() => {
            
            // Start fading out the gift box
            giftBox.classList.add('fade-out');
            
            // --- THIS LINE WAS REMOVED ---
            // mainTitle.classList.add('fade-out'); 
            // --- The title will no longer fade out ---

            // Make the message visible and start its fade-in animation
            birthdayMessage.classList.remove('hidden'); 
            
            setTimeout(() => {
                birthdayMessage.classList.add('fade-in'); 
                console.log("Birthday message is now visible and fading in!");
            }, 10); // Small delay
            
        }, 500); // This delay syncs with the gift lid opening animation
    });

    // --- Sync Music with Video ---
    if (birthdayVideo) {
        // When video starts playing, pause the music
        birthdayVideo.addEventListener('play', () => {
            backgroundMusic.pause();
        });

        // When video is paused by the user, resume music
        birthdayVideo.addEventListener('pause', () => {
            backgroundMusic.play();
        });

        // When video finishes, resume music
        birthdayVideo.addEventListener('ended', () => {
            backgroundMusic.play();
        });
    }


    // --- Balloon Creation ---
    function createBalloons(count) {
        for (let i = 0; i < count; i++) {
            const balloon = document.createElement('div');
            balloon.classList.add('balloon');
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const randomLeft = Math.random() * 90 + 5;
            const randomDelay = Math.random() * 8;
            const randomDuration = Math.random() * 5 + 8;
            balloon.style.background = randomColor + 'aa';
            balloon.style.left = randomLeft + '%';
            balloon.style.animationDelay = randomDelay + 's';
            balloon.style.animationDuration = randomDuration + 's';
            balloonContainer.appendChild(balloon);
        }
    }
    createBalloons(5);

    // --- Confetti Logic (Continuous Flow) ---
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.radius = Math.random() * 7 + 3;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.vx = Math.random() * 6 - 3;
            this.vy = Math.random() * -15 - 10;
            this.gravity = 0.4;
            this.opacity = 1;
            this.fade = 0.01;
        }
    
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.closePath();
        }
    
        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= this.fade;
            this.draw();
        }
    }

    // --- Animate Function ---
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (isFlowing) {
            if (particles.length < 500) { 
                particles.push(new Particle());
                particles.push(new Particle());
            }
        }

        particles.forEach((particle, index) => {
            if (particle.opacity <= 0 || particle.y > canvas.height + 20) {
                particles.splice(index, 1);
            } else {
                particle.update();
            }
        });
        
        requestAnimationFrame(animate);
    }
    animate();

    // Resize canvas if window is resized
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});