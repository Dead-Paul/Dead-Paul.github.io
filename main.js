const container = document.getElementById("heart-container");

const WORD = "Лиза";
const COUNT = 40;

const items = [];

for (let i = 0; i < COUNT; i++) {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = WORD;
    container.appendChild(span);
    items.push(span);
}

function heart(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y: -(13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t))
    };
}


let offset = 0;

function animate() {

    offset += 0.01;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scale = Math.min(width, height) / 35;


    items.forEach((item, i) => {

        const t = offset + (i / COUNT) * Math.PI * 2;

        const p = heart(t);
        const p2 = heart(t + 0.01);


        const x = width / 2 + p.x * scale;
        const y = height / 2 + p.y * scale;


        const angle = Math.atan2(
            p2.y - p.y,
            p2.x - p.x
        ) * 180 / Math.PI;


        item.style.left = `${x}px`;
        item.style.top = `${y}px`;

        item.style.transform =
            `translate(-50%, -50%) rotate(${angle}deg)`;

    });


    requestAnimationFrame(animate);
}


animate();