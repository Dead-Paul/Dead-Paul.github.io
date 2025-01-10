//@ts-check
import AnimeChan from '../custom-anime-chan/AnimeChan.js';
import FallingLeaves from '../falling-leaves/FallingLeaves.js'

/** Path for all img sources @type {String}*/
const pathToAnimeChan = './img/anime-chan/', 
    /** Path for all img sources @type {String}*/
    pathToFallingLeaves = './img/falling-leaves/';

/** Anime character @type {AnimeChan}*/
const animeChan = new AnimeChan('anime-chan-container', {
    sclera: { main: { src: pathToAnimeChan + 'sclera.png', position: { x: 0, y: 0 } } },
    eyes: {
        main: { src: pathToAnimeChan + 'eyes.png', position: { x: 595, y: 368 } },
        //@ts-ignore : There is no requirement to write this objects in the constructor, but it will not throw error
        love: { src: pathToAnimeChan + 'eyes-love.png', position: { x: 595, y: 368 }},
        think: { src: pathToAnimeChan + 'eyes-think.png', position: { x: 595, y: 368 }}
    },
    body: { main: { src: pathToAnimeChan + 'body.png', position: { x: 0, y: 0 } } },
    mouth: {
        main: { src: pathToAnimeChan + 'mouth-open.png', position: { x: 695, y: 528 } },
        //@ts-ignore : There is no requirement to write this objects in the constructor, but it will not throw error
        smile: { src: pathToAnimeChan + 'mouth-smile.png', position: { x: 653, y: 506 } },
        sad: { src: pathToAnimeChan + 'mouth-sad.png', position: { x: 698, y: 531 } },
    },
    money: {
        main : {src: pathToAnimeChan + 'money.png', position: { x: 570, y: 790 }}
    }
});
(async () => {
    /**@type {HTMLImageElement} */
    const moneyMainImg = await animeChan.part.money.main;
    moneyMainImg.style.display = 'none';
    moneyMainImg.style.cursor = 'url("../img/cursor-grab.png"), grab';
})();

animeChan.setEvents();

const fallingLeaves = new FallingLeaves('falling-leaves-container', 1, 1, 25, 
    {height : '3vh', filter : 'opacity(80%)'}, 
    20, 
    Array(5).fill('').map((_, index) => `${pathToFallingLeaves}leaf-${index}.png`)
);

setInterval(() => {
    fallingLeaves.wind = Math.floor(Math.random() * 2) * 2 - 1;
}, 50 * 1000);

/**@param {String} text */
const displayError = text => {
    const h1 = document.getElementsByTagName('h1')[0];
    h1.textContent = text;
    h1.style.color = 'red';
};

const displayJarInfo = async function () {
    try {
        const info = await fetch('https://api.monobank.ua/personal/client-info',
            {
                method: 'GET',
                headers: {'X-Token': 'uCmgOU8-m487ZsYzS9IRyiF1oi0AVgojEt_QTpSDyTiI'}
            }
        );
        const jarsInfo = await info.json(), 
            jarInfo = jarsInfo.jars[0];
        if (jarInfo) {
            animeChan.setActive('mouth', 'smile');
            animeChan.setActive('eyes', 'love');
            //@ts-ignore
            document.getElementById('collected-money').textContent = `Собрано: ${jarInfo.balance / 100}`;
            //@ts-ignore
            document.getElementById('target-money').textContent = `Цель: ${jarInfo.goal / 100}`;
            /**@type {HTMLImageElement} */
            const moneyMainImg = await animeChan.part.money.main;
            moneyMainImg.onclick = () => window.location.href = `https://send.monobank.ua/${jarInfo.sendId}`;
            moneyMainImg.style.display = 'block';
            return
        }
        else {
            displayError('Не удалось найти накопления');
        }
    } catch (error) {
        displayError('Не удалось получить накопления');
    }
    animeChan.setActive('eyes', 'think');
    animeChan.setActive('mouth', 'sad');
};

document.addEventListener('DOMContentLoaded', displayJarInfo);
document.addEventListener('DOMContentLoaded', () => (
    fetch('https://niraijisu.pythonanywhere.com/')
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(error => console.error(error))
));