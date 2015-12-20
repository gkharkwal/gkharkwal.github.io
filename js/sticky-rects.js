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

// ----------------------------------------------------------------------------
// Rect
// ----------------------------------------------------------------------------
function Rect() {
    this.draw = function (context) {
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
    canvas.addRect();
    canvas.draw();
};

})();

