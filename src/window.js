window.initSpace = function() { 
    window.space = renderSpace(-2.5, -2.5, 5, 0.01, function (space) { 
        fractalDraw(canvas, ctx, space);
    });
}

// Setters
window.setCanvasFullscreen = function (canvas) {
    if (!canvas) return console.warn("no canvas");

    canvas.height = document.body.clientHeight - 35;
    canvas.width = canvas.height; // Square instead of streached: document.body.clientWidth;
}

window.setPanelDisplay = function (panel) {
    if (!panel) return console.warn("no panel");
    panel.width = document.body.clientWidth;
    panel.height = 35;
}


// Events
window.zoom = function (event) {
    // event.preventDefault();

    scale += event.deltaY * -(1 /*scale*/ * 0.001);

    // Restrict scale
    scale = Math.min(Math.max(.000001, scale), 50);

    // TODO: Space not scale dependant for now
    const space = r = 00000;//enderSpace(-3, -3, 6, 0.0001);


    fractalDraw(canvas, ctx, space);
    document.getElementById("scale").textContent = "scale: " + scale;
}

window.onresize = function windowResize() {
    setCanvasFullscreen(canvas);
    setPanelDisplay(panel)
    fractalDraw(canvas, ctx, space);
};

window.dbClickDelegate = function (event) {

    const spaceCoord = getSpaceCoord(event.clientX, event.clientY);
    alert("x: " + spaceCoord.x + ", y: " + spaceCoord.y);
}

function getSpaceCoord(x,y) {
    return getSpacePosition(canvas, space, getCanvasCoord(x,y));
}

function getCanvasCoord(clientX,clientY) {
    const elemLeft = canvas.offsetLeft + canvas.clientLeft,
        elemTop = canvas.offsetTop + canvas.clientTop,
        x = clientX - elemLeft,
        y = clientY - elemTop;
    return { x: x, y: y }
}


// Selection

window.downPos = undefined;
window.upPos = undefined;
let isSelecting = false;

window.addEventListener("mousedown", function (event) {
    upPos = undefined;
    downPos = getCanvasCoord(event.clientX, event.clientY);
    isSelecting = true;
});

window.addEventListener("mouseup", function (e) {

    if (!isSelecting) return;

    upPos = getCanvasCoord(event.clientX, event.clientY);

    fractalDraw(canvas, ctx, space);
    drawSelection(window.downPos.x, window.downPos.y, e.offsetX, e.offsetY);

    isSelecting = false;
});

window.addEventListener('mousemove', e => {
    if (!isSelecting) return;

    drawSelection(window.downPos.x, window.downPos.y, e.offsetX, e.offsetY);
});

window.addEventListener('keypress', function(e) { 
    if (e.keyCode == 13) {
        
        const spacePos = getSpaceCoord(window.downPos.x, window.downPos.y);
        const spaceLimitPos = getSpaceCoord(window.upPos.x, window.upPos.y);
        const len = Math.abs(spacePos.x - spaceLimitPos.x);

        window.space = renderSpace(spacePos.x, spacePos.y, len, len / 300, function (space) { 
            fractalDraw(canvas, ctx, space);
        });
    }
});

function logKey(e) {
  log.textContent += ` ${e.code}`;
}

function drawSelection(x1, y1, x2, y2) {
    
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const rectSize = Math.max(deltaX, deltaY);
    const xVector = rectSize * deltaX / Math.abs(deltaX);
    const yVector = rectSize * deltaY / Math.abs(deltaY);

    ctx.fillStyle = "#00FF00"; //Green
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + xVector, y1);
    ctx.lineTo(x1 + xVector, y1 + yVector);
    ctx.lineTo(x1, y1 + yVector);
    ctx.closePath();
    ctx.stroke();

}