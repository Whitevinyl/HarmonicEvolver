/**
 * Created by luketwyman on 25/11/2015.
 */

//-------------------------------------------------------------------------------------------
//  INTERACTION
//-------------------------------------------------------------------------------------------



function mousePress() {
    mouseIsDown = true;
    rolloverCheck();

    setTouchPos();
}


function mouseRelease() {
    mouseIsDown = false;
}


function mouseMove(event) {

    var x,y;

    if (touchTakeover==true) {
        x = touch.pageX;
        y = touch.pageY;
    } else {
        x = event.pageX;
        y = event.pageY;
    }

    const ratio = getPixelRatio();
    mouseX = x * ratio;
    mouseY = y * ratio;
    rolloverCheck();


    if (mouseIsDown) {
        setTouchPos();
    }

}

function rolloverCheck() {
    //playOver = hudCheck(dx - (32*units),dy + (8*units) + (midType*0.9),64*units,64*units);
}

function hudCheck(x,y,w,h) { // IS CURSOR WITHIN GIVEN BOUNDARIES
    var mx = mouseX;
    var my = mouseY;
    return (mx>x && mx<(x+w) && my>y && my<(y+h));
}


// DETERMINE CLICK //
function clickOrTouch(event) {

    var x,y;

    if (touchTakeover==true) {
        x = touch.pageX;
        y = touch.pageY;
    } else {
        x = event.pageX;
        y = event.pageY;
    }

    const ratio = getPixelRatio();
    mouseX = x * ratio;
    mouseY = y * ratio;

    if (mouseIsDown==false) {
        mousePress(event);
    }
}

function setTouchPos() {
    genW = Math.round(((mouseX / fullX) * 65) + 3);
    var lastSpeed = CrossFadeSpeed;
    CrossFadeSpeed = (((mouseY / fullY) * 7)) + 0.2;
    //CrossFadeLFO.frequency.value = (1.75 - ((mouseY / fullY) * 1.75)) + 0.005;
    touchPos.x = mouseX;
    touchPos.y = mouseY;

    if (CrossFadeSpeed<lastSpeed) {
        if (fadeTween) {
            fadeTween.stop();
        }
        if (colTween) {
            colTween.stop();
        }
        crossFadeTo(CrossFade,CrossFadePolarity,CrossFadeSpeed);
    }

}