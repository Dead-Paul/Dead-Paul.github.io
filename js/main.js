//@ts-check

/**@param {String} text */
const displayError = text => {
    const h1 = document.getElementsByTagName('h1')[0];
    h1.textContent = text;
    h1.style.color = 'red';
};

const displayJarInfo = async function () {
    try {
        let info = await fetch('https://api.monobank.ua/personal/client-info',
            {
                method: 'GET',
                headers: {'X-Token': 'uCmgOU8-m487ZsYzS9IRyiF1oi0AVgojEt_QTpSDyTiI'}
            }
        );
        const jarsInfo = await info.json(), 
            jarInfo = jarsInfo.jars[0];
        if (jarInfo) {
            animeChan.setActive('mouth', 'smile');
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
    animeChan.setActive('mouth', 'sad');
};

document.addEventListener('DOMContentLoaded', () => {
    displayJarInfo();
});