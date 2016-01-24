/**
 * Created by luketwyman on 24/01/2016.
 */

var Osc = [];
var CrossFade, CrossFadeLFO, CrossFadeMeter, CrossFadePolarity, CrossFadeSpeed;
var genW, genTime;

function setupAudio() {
    Tone.Master.volume.value = -18;

    var frequency = 50; // starting oscillator pitch frequency
    genW = 20; //harmonic width: 3 - 50 (ammount of )

    // SETUP CROSSFADER //
    CrossFadePolarity = 1;
    CrossFadeSpeed = 4;// starting crossfade time in seconds
    CrossFade = new Tone.CrossFade(0);

    // UNUSED LFO - REPLACED WITH TWEEN SO CAN GET CALLBACK AFTER CYCLE //
    /*CrossFadeMeter = new Tone.Meter();
    CrossFadeMeter.smoothing = 10;
    CrossFadeLFO = new Tone.LFO({
        "min" : 0,
        "max" : 1,
        "type" : "sine",
        "phase" : 0,
        "frequency" : 0.1
    });
    CrossFadeLFO.connect(CrossFade.fade);
    CrossFadeLFO.connect(CrossFadeMeter);
    CrossFadeLFO.start();*/

    CrossFade.toMaster();
    crossFadeTo(CrossFade,CrossFadePolarity,CrossFadeSpeed);


    // OUR TWO OSCILLATORS WE CROSSFADE BETWEEN //
    Osc[0] = new Tone.Oscillator(frequency);
    Osc[0].partials = setPartials(genW);
    Osc[0].connect(CrossFade.a);
    Osc[0].start();


    Osc[1] = new Tone.Oscillator(frequency);
    Osc[1].partials = setPartials(genW);
    Osc[1].connect(CrossFade.b);
    Osc[1].start();



}

// TEST TABLES //
var horn = [0,0.4,0.4,1,1,1,0.3,0.7,0.6,0.5,0.9,0.8];
var flute1 = [0,1,0.65,0.61,0.15,0.09,0.02,0.02,0.01,0.01,0.01,0];
var flute2 = [0,1,0.61,0.1,0.24,0.11,0.09,0,0.02,0,0,0.01,0];
var organ = [
        0.000000,
            -0.000000,
            -0.042008,
            0.010474,
            -0.138038,
            0.002641,
            -0.001673,
            0.001039,
            -0.021054,
            0.000651,
            -0.000422,
            0.000334,
            -0.000236,
            0.000191,
            -0.000161,
            0.000145,
            -0.018478,
            0.000071,
            -0.000066,
            0.000047,
            -0.000044,
            0.000041,
            -0.000034,
            0.000031,
            -0.000030,
            0.000028,
            -0.000025,
            0.000024,
            -0.000022,
            0.000020,
            -0.000015,
            0.000013,
            -0.011570,
            0.000004,
            -0.000003,
            0.000003,
            -0.000003,
            0.000003,
            -0.000003,
            0.000002,
            -0.000002,
            0.000002,
            -0.000002,
            0.000002,
            -0.000002,
            0.000002,
            -0.000002,
            0.000002,
            -0.000001,
            0.000001,
            -0.000001,
            0.000001,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000898,
            0.000001,
            -0.000001,
            0.000001,
            -0.000001,
            0.000001,
            -0.000001,
            0.000001,
            -0.000001,
            0.000001,
            -0.000001,
            0.000001,
            -0.000001,
            0.000001,
            -0.000001,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
            0.000000,
            -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000000,
        0.000000,
        -0.000245
];