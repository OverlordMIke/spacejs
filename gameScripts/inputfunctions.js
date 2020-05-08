//Built in mouse & keyboard functions
function mousePressed() {
}
function mouseReleased() {
}
function keyPressed() {
  if(keyCode==UP_ARROW) {
    rocketaudio.setVolume(0.075);
    rocketaudio.loop();
  }
  if(key === "m") {
    if(musicMuted === true) {
      ambientaudio.setVolume(0.05);
      ambientaudio.play();
      musicMuted = false;
    }else{
      ambientaudio.stop();
      musicMuted = true;
    }
  }
  if(keyCode==ESCAPE) {
    if(paused) {
      paused = false;
    }else{
      paused = true;
    }
  }
}
function keyReleased() {
  if(keyCode==UP_ARROW) {
    rocketaudio.stop();
  }
}
function mouseWheel(event) {
  var mult;
  if(keyIsDown(SHIFT)) {
    mult = 10;
  }else{
    mult = 1;
  }
  if(event.delta < 0 && cam.pos.z >= 200) {
    cam.pos.z -= 4*mult;
  }else if(event.delta > 0 && cam.pos.z <= 2200) {
    cam.pos.z += 4*mult;
  }
}