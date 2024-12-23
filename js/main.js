const addImg = function () {
    const qrImg = document.createElement('img');
    qrImg.src = './img/test.png';
    document.body.appendChild(qrImg);
}

document.addEventListener('DOMContentLoaded', addImg);