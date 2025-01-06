//@ts-check

import AnimeChan from '../custom-anime-chan/AnimeChan.js'

/** Path for all img sources @type {String}*/
const path = './img/anime-chan/';

/** Anime character @type {AnimeChan}*/
const animeChan = new AnimeChan('anime-chan-container', {
    sclera: { main: { src: path + 'sclera.png', position: { x: 0, y: 0 } } },
    eyes: {
        main: { src: path + 'eyes.png', position: { x: 595, y: 368 } },
        //@ts-ignore : There is no requirement to write this objects in the constructor, but it will not throw error
        love: { src: path + 'eyes-love.png', position: { x: 595, y: 368 }},
        think: { src: path + 'eyes-think.png', position: { x: 595, y: 368 }}
    },
    body: { main: { src: path + 'body.png', position: { x: 0, y: 0 } } },
    mouth: {
        main: { src: path + 'mouth-open.png', position: { x: 695, y: 528 } },
        //@ts-ignore : There is no requirement to write this objects in the constructor, but it will not throw error
        smile: { src: path + 'mouth-smile.png', position: { x: 653, y: 506 } },
        sad: { src: path + 'mouth-sad.png', position: { x: 698, y: 531 } },
    },
});

animeChan.setEvents();


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
            //@ts-expect-error
            document.getElementById('collected-money').textContent = `Собрано: ${jarInfo.balance / 100}`;
            //@ts-expect-error
            document.getElementById('target-money').textContent = `Цель: ${jarInfo.goal / 100}`;
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