//@ts-check

let 
    /**@type {Number}*/ wind = 1, 
    /**@type {Number}*/ impulse = 1;

const /**@type {HTMLElement} */ div = document.getElementById('animation-div') || document.documentElement;


setInterval(function() {
    wind = Math.floor(Math.random() * 2) * 2 - 1;
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
                        img.style.left = Math.floor(left + i * wind * 2) + 'px';
                        img.style.top = Math.floor(top + -impulse * 2) + 'px';
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
        let 
            /**@type {Number} */ top = img.style.top && img.getAttribute('restart') !== 'true'
                ? parseInt(img.style.top, 10) 
                : Math.floor(Math.random() * 2) === 1
                    ? Math.floor(Math.random() * div.clientHeight) - img.getBoundingClientRect().height
                    : 0,
            /**@type {Number} */ left = img.style.left && img.getAttribute('restart') !== 'true'
                ? parseInt(img.style.left, 10) 
                : (img.setAttribute('restart', 'false'), top > 0
                    ? wind > 0
                        ? 0
                        : div.clientWidth - img.getBoundingClientRect().width
                    : Math.floor(Math.random() * (div.clientWidth - img.getBoundingClientRect().width))
                    );
        top += impulse;
        left += wind;

        if ((top <= div.clientHeight - img.getBoundingClientRect().height)
            && 
            (left <= div.clientWidth - img.getBoundingClientRect().width
                &&
                left >= 0)) {
            img.style.top = Math.floor(top) + 'px';
            img.style.left = Math.floor(left) + 'px';
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