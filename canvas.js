const readline = require('readline');

let canvas = new Canvas(0, 0);
start();

function start() {
    readAsync('enter command: ').then((input) => {
        handle(input);
    });
}

function handle(input) {
    let cmd = input.substr(0, 1);
    let val = input.substr(2);
    switch(cmd)
    {
        case 'C':
            let w = parseInt(val.split(' ')[0]);
            let h = parseInt(val.split(' ')[1]);
            canvas.width = w;
            canvas.height = h;
            canvas.init();
            canvas.print();
            break;
        case 'L':
            let x1 = parseInt(val.split(' ')[0]);
            let y1 = parseInt(val.split(' ')[1]);
            let x2 = parseInt(val.split(' ')[2]);
            let y2 = parseInt(val.split(' ')[3]);
            canvas.drawLine(x1, y1, x2, y2);
            canvas.print();
            break;
        case 'R':
            let xx1 = parseInt(val.split(' ')[0]);
            let yy1 = parseInt(val.split(' ')[1]);
            let xx2 = parseInt(val.split(' ')[2]);
            let yy2 = parseInt(val.split(' ')[3]);
            canvas.drawRectangle(xx1, yy1, xx2, yy2);
            canvas.print();
            break;
        case 'B':
            let x = parseInt(val.split(' ')[0]);
            let y = parseInt(val.split(' ')[1]);
            let colour = val.split(' ')[2].substr(0, 1);
            canvas.fill(x, y, colour);
            canvas.print();
            break;
        case 'Q':
            console.log('see you.');
            return;
        break;
        default:
            console.log('command not correct.\nC w h           Should create a new canvas of width w and height h.\nL x1 y1 x2 y2   Should create a new line from (x1,y1) to (x2,y2). Currently only\n                horizontal or vertical lines are supported.\nR x1 y1 x2 y2   Should create a new rectangle, whose upper left corner is (x1,y1) and\n                lower right corner is (x2,y2).\nB x y c         Should fill the entire area connected to (x,y) with "colour" c. The\n                behaviour of this is the same as that of the "bucket fill" tool in paint\n                programs.\nQ               Should quit the program.\n');
            start();
    }
}

function readAsync(tips) {
    return new Promise((resolve) => {
        const line = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        line.question(tips, (answer) => {
            line.close();
            resolve(answer.trim());
        });
    });
}

function Canvas(w, h) {
    let self = this;
    this.width = w;
    this.height = h;
    this.canvas = new Array();
    this.init = () => {
        if (self.width > 0 && self.height > 0) {
            for (let i = 0; i < self.height + 2; i++) {
                self.canvas[i] = new Array();
                for (let j = 0; j < self.width + 2; j++) {
                    if (i === 0 || i === self.height + 1) {
                        self.canvas[i][j] = '-';
                    } else if (j === 0 || j === self.width + 1) {
                        self.canvas[i][j] = '|';
                    } else {
                        self.canvas[i][j] = ' ';
                    }
                }
            }
        }
    };
    this.print = () => {
        let text = '';
        self.canvas.map((x) => { text += x.join('') + '\n'; });
        console.log(text);
        start();
    }
    this.canDraw = () => {
        if (typeof self.width === 'number' && self.width > 0 &&
            typeof self.height === 'number' && self.height > 0) {
            return true;
        } else {
            console.log('please create canvas first.')
            return false;
        }
    }
    this.drawLine = (x1, y1, x2, y2) => {
        if (!self.canDraw()) return;
        if (x1 <= 0 || x1 >= self.width + 1 || 
            x2 <= 0 || x2 >= self.width + 1 || 
            y1 <= 0 || y2 >= self.height + 1 ||
            y2 <= 0 || y2 >= self.height + 1) {
            console.log('input exceeds range.');
            return;
        }
        if (x1 === x2) {
            let min = y1;
            let max = y2;
            if(y1 > y2) {
                min = y2;
                max = y1;
            }
            for (let i = min; i <= max; i++) {
                self.canvas[i][x1] = 'x';
            }
        } else if (y1 === y2) {
            let min = x1;
            let max = x2;
            if (x1 > x2) {
                min = x2;
                max = x1;
            }
            for (let i = min; i <= max; i++) {
                self.canvas[y1][i] = 'x';
            }
        } else
            console.log('Currently only horizontal or vertical lines are supported.');
    }
    this.drawRectangle = (x1, y1, x2, y2) => {
        self.drawLine(x1, y1, x1, y2);
        self.drawLine(x1, y1, x2, y1);
        self.drawLine(x2, y1, x2, y2);
        self.drawLine(x1, y2, x2, y2);
    }
    this.fill = (x, y, colour) => {
        if (!self.canDraw()) return;
        if (x <= 0 || x >= self.width + 1 || y <= 0 || y >= self.height + 1) {
            return;
        }
        if (self.canvas[y][x] !== ' ')
            return;
        self.canvas[y][x] = colour;
        self.fill(x - 1, y, colour);
        self.fill(x, y - 1, colour);
        self.fill(x + 1, y, colour);
        self.fill(x, y + 1, colour);
    }
}