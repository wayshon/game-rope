
var data = {
    level: 1,
    animation: '',
    cutAnimation: '',
    state: 'ready', // ready run success fail
}, Els = {};

function ready() {
    renderEls();
    renderPage();
    initEvent();
    renderCanvas();
}

function renderEls() {
    Els.mask = $('.mask');
    Els.tip = $('#j_tip');
    Els.play = $('#j_play');
    Els.maskplay = $('#j_maskplay');
    Els.level = $('#j_level');
}

function renderPage() {
    Els.level.html(data.level);

    switch (data.state) {
        case 'ready':
            Els.play.html('开始');
            break;
        case 'run':
            Els.play.html('剪断');
            break;
        case 'success':
            Els.maskplay.html('下一关');
            break;
        case 'fail':
            Els.maskplay.html('重来');
            break;
        default:
    }

}

function initEvent() {
    $(document).on('click', '#j_play', function (e) {
        if (data.state == 'ready') {
            Els.play.html('剪断')
            data.state = 'run';
            draw();
        } else if (data.state == 'run') {
            stop();
        }
    })

    $(document).on('click', '#j_maskplay', function (e) {
        if (data.state == 'success') {
            nextLevel();
        } else if (data.state == 'fail') {
            restart();
        }
        Els.mask.hide()
    })

    // $(document).on('click', '.mask', function (e) {
    //     Els.mask.hide();
    // })
}

var width = screen.width, height = (screen.height - 40) * 0.8,
    lineHeight = height * (3 / 5),
    scX = 0, scY = height / 2, scWidth = 30,
    cutAnimationLength = 0,
    direction = 'to', step = 3, stepRange = 1,
    canvas = document.getElementById('j_canvas'),
    ctx = canvas.getContext("2d");

canvas.height = height;
canvas.width = width;

function renderCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2, 10);
    ctx.lineTo(width / 2, lineHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, lineHeight, 20, 0, 2 * Math.PI, true);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(scX, scY);
    ctx.lineTo(scX + scWidth, scY);
    ctx.stroke();
}

function draw() {
    if (scX <= 0) {
        direction = 'to'
    } else if (scX >= width - 20) {
        direction = 'back'
    }

    if (direction === 'to') {
        scX += step;
    } else if (direction === 'back') {
        scX -= step;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2, 10);
    ctx.lineTo(width / 2, lineHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, lineHeight, 20, 0, 2 * Math.PI, true);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(scX, scY);
    ctx.lineTo(scX + scWidth, scY);
    ctx.stroke();

    data.animation = window.requestAnimationFrame(draw);
}

function cut() {
    if (cutAnimationLength + scY >= height) return;

    cutAnimationLength += 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(scX, scY);
    ctx.lineTo(scX + scWidth, scY);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2, 10);
    ctx.lineTo(width / 2, scY);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2, cutAnimationLength + scY);
    ctx.lineTo(width / 2, lineHeight + cutAnimationLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, lineHeight + cutAnimationLength, 20, 0, 2 * Math.PI, true);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();

    cutAnimationLength + scY <= height && (data.cutAnimation = window.requestAnimationFrame(cut));

}

function stop() {
    if (!data.animation || data.state !== 'run') return;

    window.cancelAnimationFrame(data.animation)

    if ((width / 2) > scX && (width / 2) < scX + scWidth) {
        cut();
        data.state = 'success';
        Els.maskplay.html('下一关');
        Els.tip.html('恭喜过关!')
    } else {
        data.state = 'fail';
        Els.maskplay.html('重来');
        Els.tip.html('失败了，共完成' + (data.level - 1) + '关')
    }
    Els.mask.show();
}

function restart() {
    data.level = 1;
    Els.level.html(data.level)

    data.state = 'ready';
    Els.play.html('开始');
    scX = 0, direction = 'to', step = 3, scWidth = 30, cutAnimationLength = 0;
    window.cancelAnimationFrame(data.cutAnimation)
    renderCanvas();
}

function nextLevel() {
    Els.level.html(++data.level)
    data.state = 'run';
    Els.play.html('剪断');
    scX = 0, direction = 'to', cutAnimationLength = 0;

    stepRange > 0.4 && (stepRange -= 0.2);

    if (step < 8) {
        step += stepRange;
    } else {
        scWidth -= 2;
    }
    window.cancelAnimationFrame(data.cutAnimation)
    draw();
}


$(document).ready(ready);