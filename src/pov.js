const brot = require('./brot.js');
const math = require('mathjs');

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
                    conv: brot.converges(cmplx)
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
        status: 'idle...',
        next: function() { 
            // if last:
            if (currentResolution * 0.1 < this.resolutionAim) { 
                // final generation had passed.
                delete this.next;
                this.status = 'done';
                return this;
            }

            this.status = 'rendering...';
            // Could be better. if did not include the rendering of locations from last state
            const newCoords = render (minx,miny,len, currentResolution * 0.1)
            this.status = 'idle...';
            this.coords = newCoords
            this.currentResolution = currentResolution = currentResolution * 0.1;
            let that = this;
            if (onRendered) onRendered(this);
            
            setTimeout(function() {
                that = that.next();
            }, 1000);

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
