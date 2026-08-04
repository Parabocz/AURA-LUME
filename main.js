// Lenis Smooth Scroll Setup
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// GSAP ScrollTrigger setup with Lenis
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)


// 1. Mouse Tracker Aura
const cursorAura = document.querySelector('.cursor-aura');

if (cursorAura && typeof gsap !== 'undefined') {
    // Center via GSAP to avoid overriding CSS transform
    gsap.set(cursorAura, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursorAura, "x", {duration: 0.6, ease: "power3"});
    const yTo = gsap.quickTo(cursorAura, "y", {duration: 0.6, ease: "power3"});

    window.addEventListener("mousemove", (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });
}

// 3. Before/After Interactive (Clip-Path)
const compareContainer = document.querySelector('.compare-container');
const imgAfterWrapper = document.querySelector('.img-after-wrapper');
const compareHandle = document.querySelector('.compare-handle');
const labelLeft = document.querySelector('.label-left');
const labelRight = document.querySelector('.label-right');

if (compareContainer) {
    // Reset to center when mouse leaves
    compareContainer.addEventListener('mouseleave', () => {
        gsap.to(imgAfterWrapper, {
            clipPath: `polygon(50% 0, 100% 0, 100% 100%, 50% 100%)`,
            duration: 0.8,
            ease: "power3.out"
        });
        gsap.to(compareHandle, {
            left: `50%`,
            duration: 0.8,
            ease: "power3.out"
        });
        gsap.to([labelLeft, labelRight], {
            opacity: 0.8,
            duration: 0.5
        });
    });

    const handleMove = (e) => {
        const rect = compareContainer.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const x = clientX - rect.left; // x position within the element
        const centerX = rect.width / 2;
        
        let targetPercent = 50;
        let leftOpacity = 0.8;
        let rightOpacity = 0.8;

        if (x > centerX) {
            // Mouse on the right -> handle goes left (0%)
            targetPercent = 0;
            leftOpacity = 0;    // Texto da esquerda some
            rightOpacity = 0.8; // Texto da direita fica
        } else {
            // Mouse on the left -> handle goes right (100%)
            targetPercent = 100;
            rightOpacity = 0;   // Texto da direita some
            leftOpacity = 0.8;  // Texto da esquerda fica
        }
        
        // Update clip-path and handle position
        gsap.to(imgAfterWrapper, {
            clipPath: `polygon(${targetPercent}% 0, 100% 0, 100% 100%, ${targetPercent}% 100%)`,
            duration: 0.8,
            ease: "power3.out"
        });
        
        gsap.to(compareHandle, {
            left: `${targetPercent}%`,
            duration: 0.8,
            ease: "power3.out"
        });

        gsap.to(labelLeft, {
            opacity: leftOpacity,
            duration: 0.4
        });
        
        gsap.to(labelRight, {
            opacity: rightOpacity,
            duration: 0.4
        });
    };

    compareContainer.addEventListener('mousemove', handleMove);
    compareContainer.addEventListener('touchmove', handleMove, {passive: true});
}

// 4. Horizontal Gallery Scroll
const gallerySection = document.querySelector('.gallery-section');
const galleryContent = document.querySelector('.gallery-content');

if (gallerySection && galleryContent) {
    // Calculate the total scrollable width
    let getScrollAmount = () => {
        let galleryWidth = galleryContent.scrollWidth;
        return -(galleryWidth - window.innerWidth);
    }

    const tween = gsap.to(galleryContent, {
        x: getScrollAmount,
        ease: "none"
    });

    ScrollTrigger.create({
        trigger: gallerySection,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true
    });
}

// 5. Entrance Animations (Reveal Up)
gsap.utils.toArray('.reveal-up').forEach((element) => {
    gsap.to(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 85%", // Dispara quando elemento cruza 85% da viewport
            once: true // Anima apenas uma vez (comportamento de luxo)
        },
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
    });
});
