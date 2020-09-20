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

}

window.fractalDraw = function (canvas, ctx, space) {

    reset(canvas, ctx);

    const currentStaticResolution = space.currentResolution;

    const touch = function (coord) {

        const pixelsPerSpaceWidthUnit = canvas.width / space.width; // For example: 300 / 6 = 50px per 1 unit in space 
        const pixelsPerSpaceHeightUnit = canvas.height / space.height;

        const xUnitOffset = space.minx * (-1);
        const yUnitOffset = space.miny * (-1);

        ctx.fillRect(
            math.floor((coord.x + xUnitOffset) * pixelsPerSpaceWidthUnit),
            math.floor((coord.y + yUnitOffset) * pixelsPerSpaceHeightUnit),
            math.ceil(currentStaticResolution * pixelsPerSpaceWidthUnit) + 2,
            math.ceil(currentStaticResolution * pixelsPerSpaceHeightUnit) + 2); // @#$?
    }

    for (let coord of space.coords) {

        // const debugPoint = {
        //     x: -0.42084726867335576,
        //     y: 0.24804905239687836
        // };

        // if (math.abs(debugPoint.x - coord.x) < currentStaticResolution &&
        //     math.abs(debugPoint.y - coord.y) < currentStaticResolution) {
        //     console.log("Bazinga!");
        // }

        const isAxis = math.abs(coord.x) < currentStaticResolution || math.abs(coord.y) < currentStaticResolution;

        if (isAxis) {
            ctx.fillStyle = "#000000"; // black
            touch(coord);
        } else if (coord.conv) {

            let iterationDepth = 0;

            if (coord.conv.constructor.name === "Function") { 
                iterationDepth = coord.conv();
            } else {
                iterationDepth = coord.conv;
            }

            if (typeof (iterationDepth) == 'boolean') {
                if (iterationDepth) 
                    ctx.fillStyle = "#8A8A8A";
                else 
                    ctx.fillStyle = "#FFFFFF";
            } else if (typeof (iterationDepth) == 'number') {
                // Convert stabillity to array index
                const index = Math.round(iterationDepth / coord.zetaProcess.limit * (rainbowColors.length - 1));
                ctx.fillStyle = rainbowColors[index];
            }

            touch(coord);
        }
    }
}


/**
 * Original palet:
 * [
    '#9400D3', // Violet	148, 0, 211	
    '#4B0082',	 // Indigo	75, 0, 130
    '#0000FF', // Blue	0, 0, 255	
    '#00FF00', // Green	0, 255, 0	
    '#FFFF00', // Yellow	255, 255, 0	
    '#FF7F00',// Orange	255, 127, 0
    '#FF0000' // Red	255, 0 , 0	
]
 * 
 */
const rainbowColors = ['#9400D3', '#8200BF', '#7000AB', '#5E0097', '#4B0082', '#3900A2', '#2600C1', '#1300E0', '#0000FF', '#0040C0', '#008080', '#00C040', '#00FF00', '#40FF00', '#80FF00', '#C0FF00', '#FFFF00', '#FFDF00', '#FFBF00', '#FF9F00', '#FF7F00', '#FF6000', '#FF4000', '#FF2000', '#FF0000'];

function reset(canvas, ctx) {
    ctx.fillStyle = "#FFFFFF"; // WHITE
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}