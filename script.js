let canvas = document.getElementById("wheel");
let ctx = canvas.getContext("2d");
const W = document.getElementById("canvases").offsetHeight, H = W;
const wheelRadius = (W - 40) / 2;
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
let desPlayers = [];
let autoIncriment = 1;
let ended = true;
let params = getParameterByName("list", window.location.href);

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

if(params != null){
    params = params.split('$_$');
    params.forEach((element,index) => {
        $(`#text${index}`).val(element);
        keyPressed(index,{code:"null"});
        textChanged(index);
    });
}

params = getParameterByName("title", window.location.href);
if(params != "null"){
    $("#title").text(params);
}

params = getParameterByName("checked", window.location.href);

$("#checkbox1").prop("checked", params === null ? true : params === 'true');

$("#text0").val("");
drawSpin();

function drawSpin() {

    sctx.beginPath();
    sctx.strokeStyle = "#3a3a3a";
    sctx.arc(cW, cH, wheelRadius - 3, 0, 2 * Math.PI);
    sctx.lineWidth = 8;
    sctx.stroke();

    sctx.fillStyle = "orange"
    sctx.font = "bold 20px Comic Sans MS";

    sctx.beginPath();
    sctx.strokeStyle = "#3a3a3a";
    sctx.arc(cW, cH, wheelRadius / 6, 0, 2 * Math.PI);
    sctx.lineWidth = 5;
    sctx.moveTo(cW + wheelRadius - 40, cH);
    sctx.lineTo(cW + wheelRadius + 20, cH + 15);
    sctx.lineTo(cW + wheelRadius + 20, cH - 15);
    sctx.lineTo(cW + wheelRadius - 40, cH);
    sctx.stroke();
    sctx.fill();
    sctx.lineWidth = 5;
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
    ctx.font = "bold " + textSize + "px Comic Sans MS";
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
            ctx.lineWidth = 5;
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
    let delta = randNumber / 800;
    canvas.style.transform = `rotate(${a}deg)`;
    a += randNumber;
    if(randNumber > 0.001)
        randNumber -= delta;
    if (delta < 0.00001) {
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
        randNumber = Math.random() * 40 + 10;
        ended = false;
        $("#lefColumn input").prop('disabled', true);
    }
}

function getWinner(value) {
    let angle = value - (Math.floor(value / 360) * 360);
    let id = playerCount - Math.floor(angle / (360 / playerCount)) - 1;
    let winnder = players[id].text;
    winnerField.innerHTML = winnder;
    if (ended) {
        if ($("#checkbox1").prop('checked')) {
            setTimeout(function () {
                removeByIndex(players[id].id, 1);
                $("#destroyedList").append(getNewItem(desPlayers[desPlayers.length-1].id, 1, winnder));
                drawWheel(players)
                if (players.length == 1) {
                    // config = {
                    //     MBOK: true,
                    //     theme: 'dark'
                    // };
                    // showConfirm("Победил ", players[0].text, config);
                }
            }, 800);
        }
        else {
            setTimeout(function () {
                // config = {
                //     MBOK: true,
                //     theme: 'dark'
                // };
                // showConfirm("Победил ", winnder, config);
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

function getNewItem(id, param = 0, text = ""){
    let className = ["cross", "arrow"];
    let methodName = ["removeByIndex", "returnItem"]
    let div = `
        <div class="playerItem" id="playerItem${id}">
            <input id="text${id}" class="nicksInput" onchange="textChanged(${id})" value="${text}" onkeydown="keyPressed(${id}, event)" type="text">
            <span class="inputButton ${className[param]}" onclick="${methodName[param]}(${id})"></span>
        </div>`;
    return div;
}

function textChanged(id){
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

function keyPressed(id, event) {
    let rows = $("#playerList input");
    let index = 0;
    newItem(id);
    if(event.code == "Enter"){
        for (let i = 0; i < rows.length; i++) {
            if($(rows[i]).attr('id') == `text${id}`){
                index = i+1;
                break;
            }
        }
        $(rows[index]).focus();
    }
}

function newItem(id){
    let table = $("#playerList");
    let rows = $("#playerList input");
    rowCount = rows.length;

    if ($(rows[rowCount - 1]).attr('id') == `text${id}`) {
        table.append(getNewItem(autoIncriment));
        autoIncriment++;
    }
}

function removeByIndex(id, param = 0) {
    if($(`#playerList input`).length > 1){
        $(`#playerItem${id}`).remove();
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == id) {
                if(param != 0){
                    desPlayers.push(players[i]);
                }
                players.splice(i, 1);
                drawWheel(players)
                break;
            }
        }
    }
}

function returnItem(id){
    $(`#playerItem${id}`).remove();
    for (let i = 0; i < desPlayers.length; i++) {
        if (desPlayers[i].id == id) {
            desPlayers[i].id = autoIncriment-1;
            $(`#text${autoIncriment-1}`).val(desPlayers[i].text);
            newItem(autoIncriment-1);
            players.push(desPlayers[i]);
            desPlayers.splice(i, 1);
            drawWheel(players)
            break;
        }
    }
}