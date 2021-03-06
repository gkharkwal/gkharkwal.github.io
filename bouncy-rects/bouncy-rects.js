(function () {

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
function getRandomInteger(min, max, step) {
    step = step || 1;
    min = min/step;
    max = max/step;
    return (Math.floor(Math.random() * (max - min) + min) * step);
}

function getRandomNumber(min, max) {
    return (Math.random() * (max - min)) + min;
}

function range(start, stop, step) {
    // Validation checks
    if (start === undefined) {
        return [];
    }
    if (stop === undefined) {
        stop  = start;
        start = 0;
    }
    step = step || 1;

    var arr = [];
    for (var i = start; i < stop; i += step) {
        arr.push(i);
    }

    return arr;
}

// ----------------------------------------------------------------------------
// Rect
// ----------------------------------------------------------------------------
function Rect() {
    this.draw = function (context) {
        var animState = this.animSeq[this.animCtr];
        this.animCtr = (this.animCtr + 1) % this.animSeq.length;

        this.x = this.x - animState * (this.animAmt / 2);
        this.y = this.y - animState * (this.animAmt / 2);
        this.width  = this.width  + (animState * this.animAmt);
        this.height = this.height + (animState * this.animAmt);

        context.fillStyle = this.colour;
        context.fillRect(this.x, this.y, this.width, this.height);
    };

    // MAIN
    this.width  = getRandomInteger(50, 100);
    this.height = getRandomInteger(50, 100);
    this.x = getRandomInteger(25, canvas.width - (this.width + 25), 25);
    this.y = getRandomInteger(25, canvas.height - (this.height + 25), 25);
    this.colour = 'rgba(' +
                      getRandomInteger(50, 250, 50) + ', ' + // R
                      getRandomInteger(50, 250, 50) + ', ' + // G
                      getRandomInteger(50, 250, 50) + ', ' + // B
                      getRandomNumber(.2, .8) + // A 
                    ')';

    this.animSeq = range(-3, 4);
    this.animCtr = this.animSeq.indexOf(0);
    this.animAmt = 2;
}

// ----------------------------------------------------------------------------
// Canvas
// ----------------------------------------------------------------------------
function Canvas(canvas) {
    this.addRect = function () {
        this.rects.push(new Rect());
    };

    this.draw = function () {
        this.context.clearRect(0, 0, canvas.width, canvas.height);

        this.rects.forEach(function (rect) {
            rect.draw(this.context);
        }, this);
    };

    // MAIN
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.rects = [];
}

window.onload = function () {
    var canvas = document.getElementById('canvas');
    if (!canvas || !canvas.getContext) {
        // no candy for you
        return;
    }

    canvas = new Canvas(canvas);
    canvas.addRect();

    // Add more rectangles
    document.getElementById('more').addEventListener('click', function () {
        canvas.addRect();
    });

   (function draw() {
       setTimeout(function () {
           window.requestAnimationFrame(draw);
           canvas.draw();
       }, 1000/15); // 15 fps
   })();
};

})();

