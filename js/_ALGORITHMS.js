
var currentGen = 0;
var currentPartials = [];
var genMode = 0;
var genNames = [
    "ORGAN",
    "WARM BUZZ",
    "BUZZ",

    "SOFT BUZZ",
    "SOFT BUZZ RING",
    "LOWS",

    "BALANCED RANDOM",
    "WIDE PEAK",
    "WIDE TROUGH",

    "RANDOM PEAKS",
    "BUZZ CHIRP",
    "METALLIC CHIRP",

    "HIGHS",
    "METALLIC RING",
    "GLASS",
    "METALLIC BUZZ",
    "METALLIC REED",
    "TUBULAR"
];


function setPartials(width) {

    // ZERO OUR PARTIALS ARRAY //
    var partials = [];
    for (var i=0; i<width; i++) {
        partials.push(0);
    }

    // PARTIAL GENERATION //
    var min = 5;
    if (width < min) {
        min = width;
    }
    // VARY HOW MUCH OF THE ARRAY WE ACTUALLY USE //
    var slots = Math.round(min + (Math.random()*(width - min)));

    // SELECT MODE //
    //genMode = Math.floor(Math.random()*2);

    switch (genMode) {
        case 0: // random
            partials = modeRandom(partials,slots);
            break;
        case 1: //step down
            partials = modeStep(partials,slots,-1);
            break;
    }

    //console.log(partials);
    filterNormalise(partials,partials.length);
    //console.log(partials);

    // save this array for next osc//
    currentPartials = toArray(partials);
    return partials;
}


//-------------------------------------------------------------------------------------------
//  ALGORITHM MODES
//-------------------------------------------------------------------------------------------

// RANDOM //

function modeRandom(partials,length) {

    // randomly select algorithm type //
    var peakType = Math.floor(Math.random()*18);
    //peakType = 17;
    currentGen = peakType;

    switch (peakType) {

        case 0: // organ
            filterGrow(partials,length,0.05);
            filter1OverSquared(partials,length);
            filterLowPass(partials,length,0.1,0);
            filterOrganise(partials,length,0.4);
            break;

        case 1: // warm buzz
            filter1Over(partials,length);
            filter1OverSquared(partials,length);
            break;

        case 2: // buzz
            filter1Over(partials,length);
            filterGrow(partials,length,Math.random()*0.05);
            break;

        case 3: // soft buzz
            filter1OverSquared(partials,length);
            filterGrow(partials,length,Math.random()*0.05);
            break;

        case 4: // soft buzz ring
            filterGrow(partials,length,0.05);
            filter1Over(partials,length);
            filterDisorganise(partials,length,0.4,5);
            filterLowPass(partials,length,0.3,0);
            //genMode = 1;
            break;

        case 5: // lows
            filterGrow(partials,length,0.1 + (Math.random()*0.5));
            filterLowPass(partials,length,1,0);
            break;

        case 6: // balanced random
            filterRandomiseAll(partials,length);
            break;

        case 7: // peak
            filterPeakSwell(partials,length,genW/3);
            break;

        case 8: // trough
            filterMaxAll(partials,length);
            filterPeakNotch(partials,length,genW/3);
            break;

        case 9: // random peaks
            filterRandomPeaks(partials,length,genW/3);
            filterLowPass(partials,length,genW/25,0);
            break;

        case 10: // buzz chirp
            filterRandomiseAll(partials,length);
            filterHighPass(partials,length,1,0);
            filter1Over(partials,length);
            filter1OverSquared(partials,length);
            break;

        case 11: // metallic chirp
            filterGrow(partials,length,0.05);
            filterLowPass(partials,length,0.1,0);
            filterDisorganise(partials,length,0.4,2);
            break;

        case 12: // highs
            filterRandomPeaks(partials,length,genW/3);
            filterHighPass(partials,length,1,0);
            break;

        case 13: // metallic ring
            filterGrow(partials,length,0.05);
            filterDisorganise(partials,length,0.4,3);
            filterLowPass(partials,length,0.1,0);
            break;

        case 14: // glass
            filterDisorganise(partials,length,0.4,2);
            filterHighPass(partials,length,1,0);
            filterIndexMatchPeak(partials,length,1,1);
            break;

        case 15: // metallic buzz
            filterLowPass(partials,length,1,1);
            filterZeroMultiple(partials,length,2);
            break;

        case 16: // metallic reed
            filterLowPass(partials,length,1,1);
            filterZeroInterval(partials,length,3,1);
            break;

        case 17: // tubular
            filterPeakInterval(partials,length,4,0,1);
            filterLowPass(partials,length,0.8,0);
            break;
    }
    return partials;
}

function modeStep(partials,length,step) {
    partials = toArray(currentPartials);
    length = partials.length;
    if (step > 0) {
        filterStepUp(partials,length,step);
    } else {
        step = -step;
        filterStepDown(partials,length,step);
    }

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

function filterErode(partials,length,strength) {
    for (var i=0; i<length; i++) {
        partials[i] -= (Math.random()*strength);
    }
}

function filterGrow(partials,length,strength) {
    for (var i=0; i<length; i++) {
        partials[i] += (Math.random()*strength);
    }
}

function filterRandomPeaks(partials,length,maxPeaks) {
    var peakNo = Math.ceil(Math.random()*maxPeaks);
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

function filterOrganise(partials,length,strength) {
    for (var i=0; i<length; i++) {
        //octaves
        if (i===1||i===3) {
            partials[i] += strength;
        }
        if (i===7) {
            partials[i] += strength*0.9;
            partials[i+1] += strength*0.05;
        }
        if (i===15) {
            partials[i] += strength*0.25;
            partials[i+1] += strength*0.01;
        }
        if (i===32) {
            partials[i] += strength*0.1;
        }
        //fifths
        if (i===11) {
            partials[i] += strength*0.5;
        }
        if (i===24) {
            partials[i] += strength*0.05;
        }
    }
}

function filterDisorganise(partials,length,strength,multiplesOf) {
    for (var i=0; i<length; i++) {
        if (i%multiplesOf===0) {
            partials[i] += (Math.random()*strength);
        }
    }
}

function filterPeakInterval(partials,length,interval,offset,strength) {
    for (var i=(interval+offset); i<length; i+=interval) {
        partials[i] += strength;
    }
}

function filterZeroMultiple(partials,length,multiplesOf) {
    for (var i=0; i<length; i++) {
        if (i%multiplesOf===0) {
            partials[i] = 0;
        }
    }
}

function filterZeroInterval(partials,length,interval,offset) {
    for (var i=(interval+offset); i<length; i+=interval) {
        partials[i] = 0;
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

function filterHighPass(partials,length,strength,boost) {
    for (var i=1; i<length; i++) {
        partials[i] -= ((1-(i/length))*strength);
        partials[i] += boost;
    }
}

function filterLowPass(partials,length,strength,boost) {
    for (var i=(length-1); i>1; i--) {
        partials[i] -= ((i/length)*strength);
        partials[i] += boost;
    }
}

function filterIndexMatchPeak(partials,length,index,strength) {
    var peak = 0;
    for (var i=0; i<length; i++) {
        if (partials[i] > peak) { // get peak
            peak = partials[i];
        }
    }
    partials[index] = peak*strength;
}

function filterStepDown(partials,length,step) {
    for (var i=1; i<length; i++) {
        if (partials[i+step]) {
            partials[i] = partials[i+step];
        } else {
            partials[i] = 0;
        }
    }
}

function filterStepUp(partials,length,step) {
    for (var i=(length-1); i>0; i--) {
        if (partials[i-step]) {
            partials[i] = partials[i-step];
        } else {
            partials[i] = 0;
        }
    }
}

function filterNormalise(partials,length) {
    var peak = 0;
    for (var i=0; i<length; i++) {
        if (partials[i] < 0 || i == 0) { // flatten base | set dc offset to 0
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

function toArray(array) {
    var newArray = [];
    for (var i=0;i<array.length; i++) {
        newArray.push(array[i]);
    }
    return newArray;
}
