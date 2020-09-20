

function exapandColors(colors) {

    const rgbs = colors.map(hexaColorToRgbDecimal);
    const expandedRgbs = [];

    for (let i = 0; i < rgbs.length - 1; i++) {
        const newBorn = meanColors([rgbs[i], rgbs[i + 1]]);
        expandedRgbs.push(rgbs[i]);
        expandedRgbs.push(newBorn);
    }
    // Add last
    expandedRgbs.push(rgbs[rgbs.length - 1]);

    const expanededHexa = expandedRgbs.map(rgbDecimalToHexaColor);
    return expanededHexa;
}

function hexaColorToRgbDecimal(hexa) {
    let idx = 1;
    const rgb = [];
    while (idx <= 5) {
        const subHexa = hexa.slice(idx, idx + 2);// 1-3, 3-5, 5-7
        const number = parseInt("0x" + subHexa);
        rgb.push(number)
        idx += 2;
    }

    return rgb;
}

function rgbDecimalToHexaColor(rgb) {
    let hexa = "#";
    for (let number of rgb) {
        hexa += number.toString(16).toUpperCase().padStart(2, '0')
    }
    return hexa;
}

function meanColors(colors) {
    const rgb = [0, 0, 0];

    for (let color of colors) {
        for (let i = 0; i < 3; i++) {
            rgb[i] += color[i];
        }
    }

    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.round(rgb[i] / colors.length);
    }

    return rgb;
}


console.log (exapandColors([
    '#9400D3',
    '#7000AB',
    '#4B0082',
    '#2600C1',
    '#0000FF',
    '#008080',
    '#00FF00',
    '#80FF00',
    '#FFFF00',
    '#FFBF00',
    '#FF7F00',
    '#FF4000',
    '#FF0000']));