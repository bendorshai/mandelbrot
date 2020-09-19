const math = require('mathjs');
const PRECISION = 20;

exports.converges = function (c) {
    const z = zetaDistance(c, PRECISION ? PRECISION : 1200);
    if (z ==  Infinity) return false;
    return true;
}

const zetaDistance = function (c, n, distancesArrayPtr) {
    if (n == 0) {
        return math.complex(0, 0);
    } else if (this.panic) {
        return Infinity;
    }

    let val = math.complex(0,0); // Initial Z0 value in Mandalbrot
    let dist;
    for (i = 0; i < n; i++) {

        val = math.chain(val)
            .multiply(val)
            .add(c)
            .done();
    
        dist = complexDistance(val, c);
        if (distancesArrayPtr) {
            distancesArrayPtr.push(dist);
        }

        // if (dist > 2) { // Note: apperently above 2 is practicly approaching Infinity
        //     break;
        // }
        if (dist == Infinity) { // Note: apperently above 2 is practicly approaching Infinity
            break;
        }
    }

    return dist;
}

function zetaRecursive(c, n, distancesArrayPtr) {
    if (n == 0) {
        return math.complex(0, 0);
    } else if (n == 1) {
        if (distancesArrayPtr) {
            const dist = complexDistance(c);
            distancesArrayPtr.push(dist);
        }
        return c;
    }

    const prev = zeta(c, n - 1,
        distancesArrayPtr != undefined ? distancesArrayPtr : undefined,
    );

    const val = math.chain(prev)
        .multiply(prev)
        .add(prev)
        .done();

    if (distancesArrayPtr) {
        const dist = complexDistance(val);
        distancesArrayPtr.push(dist);
    }

    return val;
}


function complexDistance(c1, c2) {
    if (!c2) c2 = math.complex(0,0);
    const re1 = math.re(c1);
    const im1 = math.im(c1);
    const re2 = math.re(c2);
    const im2 = math.im(c2);

    const dre = re1-re2;
    const dim = im1-im2;

    if (math.abs(dre) == Infinity) return Infinity;
    if (math.abs(dim) == Infinity) return Infinity;

    return math.chain(dre * dre).add(dim * dim).sqrt().done();
}

