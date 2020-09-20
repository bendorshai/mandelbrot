const brot = require('./brot.js');
const math = require('mathjs');

// need perspective of space.
// center point. (x,y), depth (z).

let ints = []; // all intervals that hit next() to zeta processes

const renderSpace = function (minx, miny, len, resolution, onRendered) {
    if (resolution > 1) throw 'bad resolution request';
    currentResolution = 1;

    // Clear all intervals from last process
    for (let int of ints) {
        clearInterval(int);
    }
    ints = [];

    function render(minx, miny, len, resolution) {

        const coords = [];
        for (let x = minx; x <= minx + len; x += resolution) {
            for (let y = miny; y <= miny + len; y += resolution) {

                const cmplx = new math.complex(x, y);
                const zetaProcess = brot.createZetaProcess(cmplx);

                let int = setInterval(function () {
                    zetaProcess.next();
                    if (!zetaProcess.next) { // Prevent next iteration for nothing
                        clearInterval(int);
                    }
                }, 1);

                ints.push(int);

                coords.push({
                    x: x,
                    y: y,
                    // conv: brot.converges(cmplx, depth)
                    // conv: brot.convergenceDelay(cmplx, depth)
                    zetaProcess: zetaProcess,
                    conv: () => zetaProcess.iteration
                });
            }
        }
        return coords;
    }

    const EVOLVING_SPACE = false;

    const space = ({
        minx: minx,
        miny: miny,
        width: len,
        height: len,
        resolutionAim: resolution,
        currentResolution: currentResolution,
        status: 'idle...',
        next: function () {
            // if last:
            let last = false;
            let nextReolution = currentResolution * 0.1;

            // Simply overcoming float bug (nextReolution < this.resolutionAim)
            if (math.abs(nextReolution - this.resolutionAim) < this.resolutionAim) {
                last = true;
                nextReolution = this.resolutionAim;
            }

            this.status = 'rendering...';

            if (!EVOLVING_SPACE) { 
                nextReolution =  this.resolutionAim;
                this.currentResolution = currentResolution = this.resolutionAim * 10;
                last = true;
            }

            // Could be better. if did not include the rendering of locations from last state
            const newCoords = render(minx, miny, len, nextReolution)
            this.status = 'idle...';
            this.coords = newCoords;
            this.currentResolution = currentResolution = currentResolution * 0.1;
            let that = this;
            if (onRendered) onRendered(this);

            if (last) {
                delete this.next;
                this.status = 'done';
            } else {
                setTimeout(function() {
                    that = that.next();
                }, 2000);
            }

            return this;
        },
        coords: []
    }).next();

    return space;
};



if (window) {
    window.renderSpace = renderSpace;
} else if (exports) {
    exports.renderSpace = renderSpace;
}
