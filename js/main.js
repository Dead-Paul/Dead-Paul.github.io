const displayError = (text) => {
    h1 = document.getElementsByTagName('h1')[0];
    h1.textContent = text;
    h1.style.color = 'red';
};

const displayJarInfo = async function () {
    try {
        let info = await fetch('https://api.monobank.ua/personal/client-info',
            {
                method: 'GET',
                headers: {
                    'X-Token': 'uCmgOU8-m487ZsYzS9IRyiF1oi0AVgojEt_QTpSDyTiI'
                }
            }
        );
        info = await info.json();
        jarInfo = info.jars[0];
        if (jarInfo) {
            document.getElementById('collected-money').textContent = `Собрано: ${jarInfo.balance / 100}`;
            document.getElementById('target-money').textContent = `Цель: ${jarInfo.goal / 100}`;
            document.getElementById('link-to-send').href = 'https://send.monobank.ua/' + jarInfo.sendId;    
        }
        else {
            displayError('Не удалось найти накопления')
        }
    } catch (error) {
        displayError('Не удалось получить накопления')
    }
};

document.addEventListener('DOMContentLoaded', displayJarInfo);