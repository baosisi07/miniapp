
export default class canvas {
    constructor(id, component, setting) {
        this.id = id;
        this.component = component;
        this.setting = setting || {};
        this.defaultColor = 'black';
        this.ctx = wx.createCanvasContext(id, component);

        if (this.setting.fillColor) {
            this.rect(0, 0, this.setting.width || 0, this.setting.height || 0, {
                fillColor: this.setting.fillColor
            });
        }
    }
    rect(x, y, w, h, extra = {}) {
        if (extra.fillColor) {
            this.ctx.setFillStyle(extra.fillColor);
            this.ctx.fillRect(x, y, w, h);
            this.ctx.setFillStyle(this.defaultColor);
        }

        if (extra.strokeColor || extra.strokeWidth || extra.strokeDash) {
            this.path([
                {x: x, y: y},
                {x: x + w, y: y},
                {x: x + w, y: y + h},
                {x: x, y: y + h}
            ], {
                closePath: true,
                lineColor: extra.strokeColor,
                lineWidth: extra.strokeWidth,
                lineDash: extra.strokeDash,
            });
        }

        this.ctx.draw(true);
    }
    line(startX, startY, endX, endY, extra = {}) {
        let points = [{
            x: startX,
            y: startY
        }, {
           x: endX,
           y: endY
        }];

        extra.closePath = false;

        this.path(points, extra);
    }
    path(points, extra = {}) {
        if (!points || !points.length) {
            return;
        }

        extra.lineDash && ctx.setLineDash([10, 20], 5);
        this.ctx.setLineCap(extra.lineCap);
        this.ctx.setLineJoin(extra.lineJoin);
        this.ctx.setLineWidth(extra.lineWidth || 1);
        this.ctx.setStrokeStyle(extra.lineColor || this.defaultColor);

        points.forEach((p, k) => {
            k ? this.ctx.lineTo(p.x, p.y) : this.ctx.moveTo(p.x, p.y);
        });

        extra.closePath && this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.draw(true);
    }

    image(src, x, y, w, h, extra = {}) {
        const self = this;

        const drawFn = (path) => {
            self.ctx.drawImage(path, x, y, w, h);

            if (extra.strokeColor || extra.strokeWidth || extra.strokeDash) {
                self.path([
                    {x: x, y: y},
                    {x: x + w, y: y},
                    {x: x + w, y: y + h},
                    {x: x, y: y + h}
                ], {
                    closePath: true,
                    lineColor: extra.strokeColor,
                    lineWidth: extra.strokeWidth,
                    lineDash: extra.strokeDash,
                });
            }

            self.ctx.draw(true);

            extra.callback && extra.callback();
        }

        if (src.indexOf('http://') > -1) {
            src = src.replace('http://', 'https://');
        }

        if (src.indexOf('https://') > -1) {
            src = src.replace(/{width}/g, w);
            src = src.replace(/{height}/g, h);
            src = src.replace(/{mode}/g, '2');

            wx.getImageInfo({
                src,
                success(res) {
                    drawFn(res.path);
                }
            })
        } else {
            drawFn(src);
        }
    }

    text(content, x, y, extra = {}) {
        if (!content) {
            return;
        }

        let fontSize = extra.fontSize || 14;

        this.ctx.setFontSize(fontSize);
        this.ctx.setFillStyle(extra.fontColor || 'black');
        this.ctx.setTextAlign(extra.textAlign || 'left');
        this.ctx.setTextBaseline(extra.baseline || 'top');

        let length = this.measureText(content, fontSize);

        if (extra.textLimitWidth) {
            let arr = content.split();

            if (this.ctx.measureText) {
                length = this.measureText(content, fontSize);

                if (length > extra.textLimitWidth) {
                    let index = Math.floor(arr.length * extra.textLimitWidth / length);
                    let loop = true;

                    while (loop && index > 0) {
                        arr.length = index--;
                        length = this.measureText(arr.join('') + '...', fontSize);

                        if (extra.textLimitWidth >= length) {
                            loop = false;
                        }
                    }

                    content = arr.join('') + '...';
                }
            } else {
                length = arr.length * fontSize * 0.8;

                if (length > extra.textLimitWidth) {
                    arr.length = Math.floor(arr.length * extra.textLimitWidth / length);
                    content = arr.join('') + '...';
                }
            }
        }

        this.ctx.fillText(content, x, y);
        this.ctx.draw(true);

        if (extra.lineThrough) {
            let _x = x,
                _y = y + fontSize / 1.5;

            if (extra.textAlign === 'center') {
                _x = x - length / 2;
            } else if (extra.textAlign === 'right') {
                _x = x - length;
            }

            this.line(_x, _y, _x + length, _y, {
                lineColor: extra.fontColor
            });
        }
    }

    measureText(text, fontSize = 20) {
        if (this.ctx.measureText) {
            return this.ctx.measureText(text).width / 11 * fontSize;
        } else {
            let arr = text.split();

            return arr.length * fontSize * 2;
        }
    }
}
