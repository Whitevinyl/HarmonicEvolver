/**
 * Created by luketwyman on 24/01/2016.
 */

function setPartials(width) {

    var i;
    var partials = [];

    // ZERO OUR PARTIALS ARRAY //
    for (i=0; i<width; i++) {
        partials.push(0);
    }

    // PARTIAL GENERATION //
    var min = 2;
    var slots = Math.round(min + (Math.random()*(width - min)));

    var peakType = Math.floor(Math.random()*6);
    //peakType = 4;

    var val;
    var peakCenter, peakWidth;

    switch (peakType) {

        case 0: // RANDOMISE ALL HARMONICS //

            for (i=0; i<slots; i++) {
                val = Math.random();
                partials[i] = val;
            }

            break;

        case 1: // PEAK A FEW HARMONICS //

            var peakNo = Math.ceil(Math.random()*6);
            var peaks = [];
            for (i=0; i<peakNo; i++) {
                peaks.push(Math.round(Math.random()*slots));
            }

            for (i=0; i<peaks.length; i++) {
                val = 0.5 + (Math.random()*0.5);
                partials[peaks[i]] = val;
            }

            break;

        case 2: // PEAK SWELL //

            peakCenter = Math.round(Math.random()*slots);
            peakWidth = 1 + Math.round(Math.random()*4);

            partials[peakCenter] = 1;
            for (i=1; i<=peakWidth; i++) {
                if ((peakCenter - i)>0) {
                    partials[peakCenter - i] = ((1/(peakWidth+1))*((peakWidth + 1) - i));
                }
                if ((peakCenter + i)<slots) {
                    partials[peakCenter + i] = ((1 / (peakWidth + 1)) * ((peakWidth + 1) - i));
                }
            }

            break;

        case 3: // PEAK NOTCH //

            for (i=0; i<slots; i++) {
                partials[i] = 1;
            }

            peakCenter = Math.round(Math.random()*slots);
            peakWidth = 1 + Math.round(Math.random()*4);

            partials[peakCenter] = 0;
            for (i=1; i<=peakWidth; i++) {
                if ((peakCenter - i)>0) {
                    partials[peakCenter - i] = ((1/(peakWidth+1))* i);
                }
                if ((peakCenter + i)<slots) {
                    partials[peakCenter + i] = ((1 / (peakWidth + 1)) * i);
                }
            }

            break;

        case 4: //  1 OVER PARTIAL (like saw & square) //

            for (i=1; i<slots; i++) {
                    partials[i] = (1/i);
            }

            break;

        case 5: //  1 OVER PARTIAL SQUARED (like triangle) //

            for (i=1; i<slots; i+=2) {
                partials[i] = (1/(i*i));
            }

            break;
    }
    return partials;
}

function genPartials(osc) {
    var partials = setPartials(genW);
    partialsTo(osc,osc.partials,partials,genTime);
}

/*
function crossFadePeakAnalyze() {
    if (CrossFadeMeter) {
        var precision = 100;
        var val = CrossFadeMeter.getValue();

        if (((Math.ceil(val*precision)/precision)===1) && CrossFadePolarity===1) {
            Osc[0].partials = setPartials(genW);
            CrossFadePolarity = -CrossFadePolarity;
        }
        if (((Math.floor(val*precision)/precision)===0) && CrossFadePolarity===-1) {
            Osc[1].partials = setPartials(genW);
            CrossFadePolarity = -CrossFadePolarity;
        }
    }
}*/
