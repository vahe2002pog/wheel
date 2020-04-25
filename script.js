let canvas = document.getElementById("wheel");
let ctx = canvas.getContext("2d");
const W = 600, H = 600;
const wheelRadius = 280;
let textSize = 20;
let cW = W / 2, cH = H / 2
ctx.canvas.width = W;
ctx.canvas.height = H;
let spin = document.getElementById("spin");
let sctx = spin.getContext("2d");
sctx.canvas.width = W;
sctx.canvas.height = H;
let winnerField = document.getElementById("winnerField");
let interval, randNumber = 0;
let playerCount, rowCount;
let players = [];
let colors = [];
ended = true;

drawSpin();

function drawSpin() {

    sctx.beginPath();
    sctx.strokeStyle = "#3a3a3a";
    sctx.arc(cW, cH, wheelRadius - 3, 0, 2 * Math.PI);
    sctx.lineWidth = 8;
    sctx.stroke();

    sctx.fillStyle = "orange"
    sctx.font = "bold 20px Courier New";

    sctx.beginPath();
    sctx.strokeStyle = "#3a3a3a";
    sctx.arc(cW, cH, wheelRadius / 6, 0, 2 * Math.PI);
    sctx.lineWidth = 3;
    sctx.moveTo(cW + wheelRadius - 40, cH);
    sctx.lineTo(cW + wheelRadius + 20, cH + 15);
    sctx.lineTo(cW + wheelRadius + 20, cH - 15);
    sctx.lineTo(cW + wheelRadius - 40, cH);
    sctx.stroke();
    sctx.fill();
    sctx.lineWidth = 2;
    sctx.fillStyle = "black";
    sctx.strokeStyle = "white";
    sctx.textAlign = "center";
    sctx.strokeText("Spin", cW, cH + 5);
    sctx.fillText("Spin", cW, cH + 5);
}

function drawWheel(players) {
    playerCount = players.length;
    let angle = (2 / playerCount) * Math.PI;
    ctx.clearRect(0, 0, W, H);
    ctx.font = "bold " + textSize + "px Courier New";
    ctx.strokeStyle = "black";

    for (let i = 0; i < playerCount; i++) {
        ctx.fillStyle = players[i].color;
        ctx.beginPath();
        ctx.lineTo(cW, cH);
        ctx.lineTo(Math.cos(i * angle) * wheelRadius + cW, Math.sin(i * angle) * wheelRadius + cH);
        ctx.arc(cW, cH, wheelRadius, i * angle, (i + 1) * angle);
        ctx.lineTo(cW, cH);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fill();
        if (players[i].text != undefined) {
            ctx.save();
            ctx.translate(cW, cH);
            let ra = angle * (i + 0.5);
            ctx.rotate(ra);
            ctx.lineWidth = 8;
            ctx.fillStyle = "black";
            ctx.strokeStyle = "white";
            ctx.textAlign = "center";
            ctx.strokeText(players[i].text, wheelRadius / 1.8, textSize / 2 - 6);
            ctx.fillText(players[i].text, wheelRadius / 1.8, textSize / 2 - 6);
            ctx.restore();
        }
    }
}

let a = 0;
function rotate() {
    let delta = randNumber / 500;
    canvas.style.transform = `rotate(${a}deg)`;
    a += randNumber;
    randNumber -= delta;
    if (delta < 0.00005) {
        clearInterval(interval);
        randNumber = 0;
        ended = true;
        $("#lefColumn input").prop('disabled', false);
    }
    getWinner(a);
}
function spinButton() {
    if (ended && players.length > 1) {
        interval = setInterval(rotate, 1);
        randNumber = Math.random() * 20 + 5;
        ended = false;
        $("#lefColumn input").prop('disabled', true);
    }
}

function getWinner(value) {
    let angle = value - (Math.floor(value / 360) * 360);
    let id = playerCount - Math.floor(angle / (360 / playerCount)) - 1;
    let winnder = players[id].text;
    winnerField.value = winnder;
    if(ended){
        if($("#checkbox1").prop('checked')){
            setTimeout(function (){
                $("#destroyedList").append($(`#text${players[id].id}`));
                players.splice(id, 1);
                drawWheel(players)
                if(players.length == 1){
                    config = {
                        MBOK: true,
                        theme: 'dark'
                    };
                    showConfirm("Победил ", players[0].text, config);
                }
            }, 800);
        }
        else{
            setTimeout(function (){
                config = {
                    MBOK: true,
                    theme: 'dark'
                };
                showConfirm("Победил ", winnder, config);
            }, 800);
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function textChanged(id, event) {
    let table = $("#playerList");
    let rows = $("#playerList input");
    rowCount = rows.length;

    if ($(rows[rowCount - 1]).attr('id') == `text${id}`) {
        table.append(`
            <input id="text${id + 1}" class="nicksInput"  onchange="textChanged(${id + 1}, event)" onkeydown="textChanged(${id + 1}, event)" onsearch="onClear(${id + 1})" type="search">
        `)
    }
    if (event.type == "change") {
        if (rowCount > 0) {
            let text = $(`#text${id}`).val();
            if (text != "") {
                let r = 0;
                players.forEach(element => {
                    if (element.id == id) {
                        element.text = text;
                    }
                    else
                        r++;
                });
                if (r == players.length) {
                    players.push({
                        id: id,
                        text: text,
                        color: getRandomColor()
                    })
                }
                drawWheel(players)
            }
            else {
                removeByIndex(id);
            }
        }
    }
}

function onClear(id,event) {
    event.cancel();
    // if ($(`#text${id}`).val() != "") {
    //     $(`#text${id + 1}`).focus();
    // }
    // else {
    //     removeByIndex(id);
    // }
}

function removeByIndex(id) {
    $(`#text${id}`).remove();
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            players.splice(i, 1);
            drawWheel(players)
        }
    }
}