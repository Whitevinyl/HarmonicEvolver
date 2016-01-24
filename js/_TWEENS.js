/**
 * Created by luketwyman on 05/11/2014.
 */

var fadeTween;


/*function numberTo(osc,par1,par2,i,t) {

    t = t || 1000;

    var nPos = {n:par1[i] };
    var nTween = new TWEEN.Tween(nPos);
    nTween.to({ n: par2[i]  }, t*1000);
    nTween.start();

    nTween.onUpdate(function() {
        //(function(ind) {
            par1[i] = this.n;
            if (i === 0) {
                osc.partials = par1;
            }
        //})(i);
    });
    nTween.onComplete(function() {
        if (i === 0) {
            genPartials(osc);
        }
    });
    nTween.easing( TWEEN.Easing.Quadratic.InOut );
}*/


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

function paletteTo(pal1,pal2,t) {

    var length = pal1.length;
    if (length > pal2.length) {
        length = pal2.length;
    }
    for (var i=0; i<length; i++) {
        colourToColour(pal1[i],pal2[i],t);
    }
}

/*function partialsTo(osc,par1,par2,t) {

    var length = par1.length;
    for (var j=0; j<length; j++) {
        numberTo(osc,par1,par2,j,t);
    }
}*/

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


