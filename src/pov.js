const brot = require('./brot.js');
const math = require('mathjs');

const LIMIT = 50;

// need perspective of space.
// center point. (x,y), depth (z).

const renderSpace = function(minx,miny,len, resolution, onRendered) {
    if (resolution > 1) throw 'bad resolution request';
    currentResolution = 1;

    function render(minx,miny,len, resolution) {
        const coords = [];
        for (let x = minx; x <= minx+len; x += resolution) {
            for (let y = miny; y <= miny+len; y += resolution) {
                const cmplx = new math.complex(x, y);
                coords.push({ 
                    x: x,
                    y: y,
                    // conv: brot.converges(cmplx, LIMIT)
                    conv: brot.convergenceDelay(cmplx, LIMIT)
                });
            }
        }
        return coords;
    }
   
    const space = ({
        minx: minx,
        miny: miny,
        width: len,
        height: len,
        resolutionAim: resolution,
        currentResolution: currentResolution,
        depthLimit: LIMIT,
        status: 'idle...',
        next: function() { 
            // if last:
            let last = false;
            let nextReolution = currentResolution * 0.1;

            // Simply overcoming float bug (nextReolution < this.resolutionAim)
            if (math.abs(nextReolution - this.resolutionAim) < this.resolutionAim) { 
                last = true;
                nextReolution = this.resolutionAim;
            }

            this.status = 'rendering...';
            // Could be better. if did not include the rendering of locations from last state
            const newCoords = render (minx,miny,len, nextReolution)
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
                }, 300);
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
