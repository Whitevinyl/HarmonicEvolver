
function setPartials(width) {

    // ZERO OUR PARTIALS ARRAY //
    var partials = [];
    for (var i=0; i<width; i++) {
        partials.push(0);
    }


    // PARTIAL GENERATION //
    var min = 2;
    var slots = Math.round(min + (Math.random()*(width - min)));

    var peakType = Math.floor(Math.random()*13);
    //peakType = 9;
    switch (peakType) {

        case 0:
            filterRandomiseAll(partials,slots);
            break;

        case 1:
            filterRandomPeaks(partials,slots,genW/3);
            filterLowPass(partials,slots,width/25);
            break;

        case 2:
            filterPeakSwell(partials,slots,genW/3);
            break;

        case 3:
            filterMaxAll(partials,slots);
            filterPeakNotch(partials,slots,genW/3);
            break;

        case 4:
            filter1Over(partials,slots);
            filterGrow(partials,slots,Math.random()*0.2);
            break;

        case 5:
            filter1OverSquared(partials,slots);
            filterGrow(partials,slots,Math.random()*0.2);
            break;

        case 6:
            filterGrow(partials,slots,0.1 + (Math.random()*0.5));
            filterLowPass(partials,slots,1);
            break;

        case 7:
            filter1Over(partials,slots);
            filter1OverSquared(partials,slots);
            break;

        case 8:
            filterRandomiseAll(partials,slots);
            filterHighPass(partials,slots,1);
            break;

        case 9:
            filterGrow(partials,slots,0.05);
            filter1OverSquared(partials,slots);
            filterLowPass(partials,slots,0.1);
            filterOrganise(partials,slots,0.4);
            break;

        case 10:
            filterGrow(partials,slots,0.05);
            filterLowPass(partials,slots,0.1);
            filterDisorganise(partials,slots,0.4,2);
            break;

        case 11:
            filterGrow(partials,slots,0.05);
            filterDisorganise(partials,slots,0.4,3);
            filterLowPass(partials,slots,0.1);
            break;

        case 12:
            filterGrow(partials,slots,0.05);
            filter1Over(partials,slots);
            filterDisorganise(partials,slots,0.4,5);
            filterLowPass(partials,slots,0.3);
            break;
    }

    //console.log(partials);
    filterNormalise(partials,slots);
    //console.log(partials);
    return partials;
}


//-------------------------------------------------------------------------------------------
//  ALGORITHM FILTERS
//-------------------------------------------------------------------------------------------

function filterRandomiseAll(partials,length) {
    for (var i=0; i<length; i++) {
        partials[i] = Math.random();
    }
}

function filterErode(partials,length,n) {
    for (var i=0; i<length; i++) {
        partials[i] -= (Math.random()*n);
    }
}

function filterGrow(partials,length,n) {
    for (var i=0; i<length; i++) {
        partials[i] += (Math.random()*n);
    }
}

function filterRandomPeaks(partials,length,n) {
    var peakNo = Math.ceil(Math.random()*n);
    var peaks = [];
    for (var i=0; i<peakNo; i++) {
        peaks.push(Math.floor(Math.random()*length));
    }
    for (i=0; i<peaks.length; i++) {
        partials[peaks[i]] += (0.5 + (Math.random()*0.5));
    }
}

function filterPeakSwell(partials,length,maxWidth) {
    var peakCenter = Math.floor(Math.random()*length);
    var peakWidth = 1 + Math.round(Math.random()*maxWidth);
    partials[peakCenter] = 1;
    for (var i=1; i<=peakWidth; i++) {
        if ((peakCenter - i)>0) {
            partials[peakCenter - i] += ((1/(peakWidth+1))*((peakWidth + 1) - i));
        }
        if ((peakCenter + i)<length) {
            partials[peakCenter + i] += ((1 / (peakWidth + 1)) * ((peakWidth + 1) - i));
        }
    }
}

function filterPeakNotch(partials,length,maxWidth) {
    var peakCenter = Math.floor(Math.random()*length);
    var peakWidth = 1 + Math.round(Math.random()*maxWidth);
    partials[peakCenter] = 0;
    for (var i=1; i<=peakWidth; i++) {
        if ((peakCenter - i)>0) {
            partials[peakCenter - i] -= ((1/(peakWidth+1))*((peakWidth + 1) - i));
        }
        if ((peakCenter + i)<length) {
            partials[peakCenter + i] -= ((1 / (peakWidth + 1)) * ((peakWidth + 1) - i));
        }
    }
}

function filterOrganise(partials,length,n) {
    for (var i=0; i<length; i++) {
        //octaves
        if (i===0||i===1||i===3) {
            partials[i] += n;
        }
        if (i===7) {
            partials[i] += n*0.9;
            partials[i+1] += n*0.05;
        }
        if (i===15) {
            partials[i] += n*0.25;
            partials[i+1] += n*0.01;
        }
        if (i===32) {
            partials[i] += n*0.1;
        }

        //fifths
        if (i===11) {
            partials[i] += n*0.5;
        }
        if (i===24) {
            partials[i] += n*0.05;
        }
    }
}

function filterDisorganise(partials,length,n,c) {
    for (var i=0; i<length; i++) {
        if (i%c===0) {
            partials[i] += (Math.random()*n);
        }
    }
}

function filterMaxAll(partials,length) {
    for (var i=0; i<length; i++) {
        partials[i] = 1;
    }
}

function filterMinAll(partials,length) {
    for (var i=0; i<length; i++) {
        partials[i] = 0;
    }
}

function filter1Over(partials,length) {
    for (var i=1; i<length; i++) {
        partials[i] += (1/i);
    }
}

function filter1OverSquared(partials,length) {
    for (var i=1; i<length; i+=2) {
        partials[i] += (1/(i*i));
    }
}

function filterHighPass(partials,length,n) {
    for (var i=1; i<length; i++) {
        partials[i] -= ((1-(i/length))*n);
    }
}

function filterLowPass(partials,length,n) {
    for (var i=(length-1); i>1; i--) {
        partials[i] -= ((i/length)*n);
    }
}

function filterNormalise(partials,length) {
    var peak = 0;
    for (var i=0; i<length; i++) {
        if (partials[i] < 0) { // flatten base
            partials[i] = 0;
        }
        if (partials[i] > peak) { // get peak
            peak = partials[i];
        }
    }
    if (peak>0) { // normalise
        var threshold = 1;
        var multiplier = (((1/peak))*threshold);
        for (i=0; i<length; i++) {
            partials[i] = partials[i] * multiplier;
        }
    } else {
        partials[1] = 1; // add fundamental if all zeros
    }

}

