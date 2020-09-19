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
    const space = r=00000;//enderSpace(-3, -3, 6, 0.0001);


    fractalDraw(canvas, ctx, space);
    document.getElementById("scale").textContent = "scale: " + scale;
}

window.onresize = function windowResize() {
    setCanvasFullscreen(canvas);
    setPanelDisplay(panel)
    fractalDraw(canvas, ctx, space);
    document.getElementById("scale").textContent = "scale: " + scale;
};

window.dbClickDelegate = function (event) {

    const elemLeft = canvas.offsetLeft + canvas.clientLeft,
        elemTop = canvas.offsetTop + canvas.clientTop;

    const x = event.pageX - elemLeft,
        y = event.pageY - elemTop;

    const spaceCoord = getSpacePosition(canvas, space, { x: x, y: y })
    alert("x: " + spaceCoord.x + ", y: " + spaceCoord.y);
}