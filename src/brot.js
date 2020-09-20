const math = require('mathjs');

exports.converges = function (c, limit) {
    const z = zetaData(c, limit ? limit : 120);
    if (z.distance == Infinity) return false;
    return true;
}

exports.convergenceDelay = function (c, limit) {
    const z = zetaData(c, limit ? limit : 120);
    return z.iterations;
}


exports.createZetaProcess = function (c, n) {
    if (!n) n = 0;

    return {
        val: math.complex(0, 0),
        distance: 0,
        iteration: 0,
        status: 'idle...',
        limit: 50,
        next: function (force) {
            // Note: once could extend the limit and then hit next(true) to further investigate
            if (!force) force = false;
            if (this.status == "converged" && !force) return;

            this.status = "seeking...";

            let i;
            for (i = 0; i < 5; i++) {
                this.val = math.chain(this.val)
                    .multiply(this.val)
                    .add(c)
                    .done();

                if (math.abs(math.re(this.val)) == Infinity) break;
                if (math.abs(math.im(this.val)) == Infinity) break;
            }

            this.iteration += i;

            this.distance = complexDistance(this.val, c);

            if (this.distance == Infinity) {
                delete this.next;
                this.status = "diverged"
            } else if (this.iteration >= this.limit) {
                this.status = "converged"
            }
        }
    }
}


const zetaData = function (c, n, distancesArrayPtr) {
    if (n == 0) {
        return math.complex(0, 0);
    }

    let val = math.complex(0, 0); // Initial Z0 value in Mandalbrot
    let dist;
    for (i = 1; i <= n; i++) {

        val = math.chain(val)
            .multiply(val)
            .add(c)
            .done();

        dist = complexDistance(val, c);
        if (distancesArrayPtr) {
            distancesArrayPtr.push(dist);
        }

        if (dist == Infinity) { // Note: apperently above 2 is practicly approaching Infinity
            break;
        }
    }

    return {
        distance: dist,
        iterations: Math.min(i, n)
    };
}

function complexDistance(c1, c2) {
    if (!c2) c2 = math.complex(0, 0);
    const re1 = math.re(c1);
    const im1 = math.im(c1);
    const re2 = math.re(c2);
    const im2 = math.im(c2);

    const dre = re1 - re2;
    const dim = im1 - im2;

    if (math.abs(dre) == Infinity) return Infinity;
    if (math.abs(dim) == Infinity) return Infinity;

    return math.chain(dre * dre).add(dim * dim).sqrt().done();
}

