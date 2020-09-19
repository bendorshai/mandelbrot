const math = require('mathjs');

window.getSpacePosition = function (canvas, space, canvasCoord) { 
    const pixelsPerSpaceWidthUnit = canvas.width / space.width; // For example: 300 / 6 = 50px per 1 unit in space 
    const pixelsPerSpaceHeightUnit = canvas.height / space.height;

    const xUnitOffset = space.minx * (-1);
    const yUnitOffset = space.miny * (-1);

    return { 
        x: (canvasCoord.x / pixelsPerSpaceWidthUnit) - xUnitOffset,
        y: (canvasCoord.y / pixelsPerSpaceHeightUnit) - yUnitOffset
    };

    // @#$ Scale is not into acount : (
}


window.fractalDraw = function (canvas, ctx, space) {
    const pixelsPerSpaceWidthUnit = canvas.width / space.width; // For example: 300 / 6 = 50px per 1 unit in space 
    const pixelsPerSpaceHeightUnit = canvas.height / space.height;

    const xUnitOffset = space.minx * (-1);
    const yUnitOffset = space.miny * (-1);

    // @#$ center point out of center of space... 

    reset(canvas, ctx);

    for (let coord of space.coords) {

        const touch = function() { 
            ctx.fillRect(
                math.floor((coord.x + xUnitOffset) * pixelsPerSpaceWidthUnit),
                math.floor((coord.y + yUnitOffset) * pixelsPerSpaceHeightUnit), 
                math.round(space.currentResolution * pixelsPerSpaceWidthUnit), 
                math.round(space.currentResolution * pixelsPerSpaceHeightUnit));
        }

        const isAxis = math.abs(coord.x) < space.currentResolution || math.abs(coord.y) < space.currentResolution;

        if (isAxis) {
            ctx.fillStyle = "#000000"; // black
            touch();
        } else if (coord.conv){
            ctx.fillStyle = "#8A8A8A"; // not converge colour
            touch();
        }
    }
}

function reset(canvas, ctx) {
    ctx.fillStyle = "#FFFFFF"; // WHITE
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}