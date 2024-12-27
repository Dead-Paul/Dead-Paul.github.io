//@ts-check

let 
    /**@type {Number}*/ wind = 1, 
    /**@type {Number}*/ impulse = 1;

setInterval(function() {
    wind = Math.floor(Math.random() * 2) * 2 - 1;
    console.log(wind);
}, (40 * 1000));


document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const img = document.createElement('img');
            img.src = `./img/leaves/leaf-${Math.floor(Math.random() * 5)}.png`;
            img.className = 'leaf';
            img.setAttribute('restart', 'true');

            // Next line for editor. causing error if left, therefore after editing comment next string: 
            // /**@param {HTMLElement} img */
            function mouseOverLeaf(img) {
                console.log(img);
                img.setAttribute('isBusy', 'true');
                /**@type {Number} */
                let top = parseInt(img.style.top);
                /**@type {Number} */
                let left = parseInt(img.style.left);
                let i = 1;
                let intervalId = setInterval(function () {
                    if (i > 10) {
                        clearInterval(intervalId);
                        img.setAttribute('isBusy', 'false');
                    }
                    else {
                        img.style.left = (left + i * wind * 2) + 'px';
                        img.style.top = (top + -impulse * 2) + 'px';
                        i++;
                    }
                }, 30);
            };
            img.addEventListener('mouseover', (ev) => mouseOverLeaf(ev.currentTarget));

            document.getElementById('animation-div')?.appendChild(img);
            setInterval(fallAnimation, 15, img);
            setInterval(leafAnimation, 10, img);
        }, Math.floor(Math.random() * (20 * 1000)));
    };
    /**@param {HTMLElement} img */
    function fallAnimation (img) {
        if (img.getAttribute('isBusy') === 'true')
            return;
        const 
            /**@type {Number} */ top = img.style.top && img.getAttribute('restart') !== 'true'
                ? parseInt(img.style.top, 10) 
                : -img.getBoundingClientRect().height,
            /**@type {Number} */ left = img.style.left && img.getAttribute('restart') !== 'true'
                ? parseInt(img.style.left, 10) 
                : (img.setAttribute('restart', 'false'),
                    Math.floor(Math.random() * (screen.width - img.getBoundingClientRect().width)));

        if ((top <= screen.height)
            && 
            (left <= screen.width - img.getBoundingClientRect().width 
                &&
                left >= 0 - img.getBoundingClientRect().width)) {
            img.style.top = (top + impulse) + 'px';
            img.style.left = (left + wind) + 'px';
        }
        else
            img.setAttribute('restart', 'true');
    };

    /**@param {HTMLElement} img */
    function leafAnimation (img) {
        let /**@type {Number} */
            rotate = img.style.rotate? parseInt(img.style.rotate, 10) : Math.floor(Math.random() * 90);
        img.style.rotate = (rotate + wind) + 'deg';
    };
});