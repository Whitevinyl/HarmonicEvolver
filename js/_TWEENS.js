/**
 * Created by luketwyman on 05/11/2014.
 */

var fadeTween;
var colTween;

function colourTo(col,r,g,b,a,t) {

    t = t || 1000;

    var cPos = {red: col.R, green: col.G, blue: col.B, alpha: col.A };

    colTween = new TWEEN.Tween(cPos);
    colTween.to({ red: r, green: g, blue: b, alpha: a  }, t*1000);
    colTween.start();

    colTween.onUpdate(function() {
        col.R = this.red;
        col.G = this.green;
        col.B = this.blue;
        col.A = this.alpha;
    });

    colTween.easing( TWEEN.Easing.Quadratic.InOut );
}

function colourToColour(col,col2,t) {

    t = t || 1000;

    var cPos = {red: col.R, green: col.G, blue: col.B, alpha: col.A };

    var colTween = new TWEEN.Tween(cPos);
    colTween.to({ red: col2.R, green: col2.G, blue: col2.B, alpha: col2.A  }, t*1000);
    colTween.start();

    colTween.onUpdate(function() {
        col.R = this.red;
        col.G = this.green;
        col.B = this.blue;
        col.A = this.alpha;
    });

    colTween.easing( TWEEN.Easing.Quadratic.InOut );
}



function crossFadeTo(cross,polarity,t) {
    t = t || 1000;
    var n;
    if (polarity===1) {
        n = 1;
    } else {
        n = 0;
    }

    var nPos = {n:cross.fade.value };
    fadeTween = new TWEEN.Tween(nPos);
    fadeTween.to({ n: n  }, t*1000);
    fadeTween.start();

    fadeTween.onUpdate(function() {
        cross.fade.value = this.n;
    });
    fadeTween.onComplete(function() {
        var partials = setPartials(genW);
        var col = [0,0,0,0,0,0];
        for (var h=1; h<6; h++) {
            if (partials[h]) {
                col[h] = partials[h];
            }
        }
        if (polarity===1) {
            Osc[0].partials = partials;
            colourTo(bgCols[0],(col[1])*255,(col[2])*255,((col[3]+col[4]+col[5])/3)*255,1,CrossFadeSpeed);
        } else {
            Osc[1].partials = partials;
            colourTo(bgCols[0],(col[1])*255,(col[2])*255,((col[3]+col[4]+col[5])/3)*255,1,CrossFadeSpeed);
        }
        CrossFadePolarity = -CrossFadePolarity;
        crossFadeTo(cross,CrossFadePolarity,CrossFadeSpeed);
    });
    fadeTween.easing( TWEEN.Easing.Sinusoidal.InOut );
}


