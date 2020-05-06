var ship;
var bodypax, bodyxena, bodygalileo;
var shipoffx, shipoffy, bodyoffx, bodyoffy, xenaoffx, xenaoffy, galileooffx,galileooffy;
var helpoffx, helpoffy, orbitoffx, orbitoffy;
var dragging = false;
var cam;
var ambientaudio, rcsaudio, rocketaudio;
var zoomscale = 500;
var bgimg, earthimg;
var musicMuted = true;
var help;
var menufont;
var helvfont;
var renderMenu = true;
var wfix, hfix;
var cam3d;

function preload() {
  soundFormats("mp3");
  ambientaudio = loadSound('ambient');
  soundFormats("ogg");
  rcsaudio = loadSound('rcs');
  rocketaudio = loadSound('rocket');
  bgimg = loadImage('doublespace.jpg');
  earthimg = loadImage('earth.jpg');
  menufont = loadFont('menufont.ttf');
  helvfont = loadFont('Helvetica.ttf');
}

//potential warp mechanic
//increase speed?
//scale everything up along the axis ship is pointing
//noise buildup
//overlay warp animation "loading" screen
//load in new system
//noise decrease
//arrive in orbit of system main star

function setup() {
  //joojoo magic
  createCanvas(720, 720, WEBGL);
  frameRate(60);
  rectMode(CENTER);
  ellipseMode(CENTER);
  textFont(helvfont);
  wfix = width/2;
  hfix = height/2;
  
  //create all the things
  //Body(x,y,radius,mass,red,green,blue)
  bodypax = new Body(1500,-400,600,4000,126,132,225);
  bodyxena = new Body(3000,-100,550,2500,147,81,43);
  bodygalileo = new Body(1000,1000,100,1500,42,207,231);
  ship = new Ship();
  cam = new fakeCam();
  help = new introScreen();
  cam3d = new cameraEngine();
  
  //start bg music
  //ambientaudio.setVolume(0.05);
  //ambientaudio.play();
}

function draw() {
  background(10);
  
  push();
  translate(ship.pos.x,ship.pos.y)
  noStroke();
  texture(bgimg);
  sphere(4000);
  pop();
  
  cam.update();
  //bodypax.render();
  //bodyxena.render();
  ship.render();
  bodygalileo.render();
  orbitalPath(ship.pos,ship.vel);
  cam3d.run();
  
  push();
  fill(255)
  textSize(30);
  textAlign(CENTER,CENTER);
  //text("PAX", bodypax.pos.x, bodypax.pos.y);
  //text("XENA", bodyxena.pos.x, bodyxena.pos.y);
  text("GALILEO", bodygalileo.pos.x, bodygalileo.pos.y);
  pop();
  
  if(!dragging) {
    ship.turn();
    ship.update();
    ship.inputs();
    //bodypax.attract();
    //bodyxena.attract();
    bodygalileo.attract();
    bodygalileo.rotate();
  }
  
  //push();
  //fill(255)
  //text(ship.pos,50-wfix,50-hfix);
  //text(ship.vel,50-wfix,30-hfix);
  //text(mouseX + " , " + mouseY,50-wfix,10-hfix);
  //text(round(zoomscale,2),50-wfix,70-hfix)
  //text(calcForce(ship.pos.x,ship.pos.y,ship.mass,bodygalileo.pos.x,bodygalileo.pos.y,bodygalileo.mass),50-wfix,200-hfix);
  //pop()
}

function cameraEngine() {
  this.pos = createVector(ship.pos.x,ship.pos.y,(width/2)/tan(PI/6));
  
  this.run = function() {
    camera(ship.pos.x,ship.pos.y,this.pos.z,ship.pos.x,ship.pos.y,ship.pos.z,0,1,0);
  }
  
}


//with any luck this actually calculates orbital path
//who knows its mostly a poor attempt at translating
//scientific equations into this
//omg it works
function orbitalPath(a,b,c) {
  var startpos = createVector(a.x,a.y);
  var startvel = createVector(b.x,b.y);
  var dt = 5;
  var k1,k1v,k2,k2v,k3,k3v,k4,k4v;
  for(var steps = 0; steps < zoomscale; steps++) {
    k1 = createVector(startvel.x,startvel.y);
    k1v = calcForce(startpos.x,startpos.y,ship.mass,bodygalileo.pos.x,bodygalileo.pos.y,bodygalileo.mass)
    k2 = createVector(startvel.x + dt/2*k1v.x,startvel.y + dt/2*k1v.y);
    k2v = calcForce(startpos.x+dt/2*startvel.x,startpos.y+dt/2*startvel.y,ship.mass,bodygalileo.pos.x,bodygalileo.pos.y,bodygalileo.mass);
    k3 = createVector(startvel.x + dt/2*k2v.x,startvel.y + dt/2*k2v.y);
    k3v = calcForce(startpos.x + dt/2*k2.x,startpos.y + dt/2*k2.y,ship.mass,bodygalileo.pos.x,bodygalileo.pos.y,bodygalileo.mass);
    k4 = createVector(startvel.x+dt*k3v.x,startvel.y+dt*k3v.y);
    k4v = calcForce(startpos.x+dt*k3.x,startpos.y+dt*k3.y,ship.mass,bodygalileo.pos.x,bodygalileo.pos.y,bodygalileo.mass);
    
    startpos = createVector(startpos.x + dt/6 * (k1.x + (2*k2.x) + (2*k3.x) + k4.x),
                           startpos.y + dt/6 * (k1.y + (2*k2.y) + (2*k3.y) + k4.y));
    startvel = createVector(startvel.x + dt/6 * (k1v.x + (2*k2v.x) + (2*k3v.x) + k4v.x),
                           startvel.y + dt/6 * (k1v.y + (2*k2v.y) + (2*k3v.y) + k4v.y));
    if(steps%5===0) {
      push();
      fill(255,255,255,50);
      noStroke();
      ellipse(startpos.x,startpos.y,10,10);
      pop();
    }
  }
}

//was supposed to calculate and draw path
//but i got lazy and now it just gives you
//direction of travel and a rough idea of
//how much motion you have
function drawTravel() {
  var startPos = createVector(ship.pos.x,ship.pos.y);
  var vell = createVector(ship.vel.x,ship.vel.y);
  var calc = createVector(0,0);
  for(var i=0;i<=5;i++) {
    startPos.add(vell.mult(2));
    push();
    fill(255,255,255,50);
    ellipse(startPos.x,startPos.y,10,10);
    pop();
  }
}

//"moving the camera around" ie: move literally everything else
//in the universe because I can't be bothered to rewrite some of
//my code onto a better rendering method that has a built-in camera
function fakeCam() {
  this.update = function() {
    if(dragging) {
      ship.pos.x = shipoffx + mouseX;
      ship.pos.y = shipoffy + mouseY;
      bodypax.pos.x = bodyoffx + mouseX;
      bodypax.pos.y = bodyoffy + mouseY;
      bodyxena.pos.x = xenaoffx + mouseX;
      bodyxena.pos.y = xenaoffy + mouseY;
      bodygalileo.pos.x = galileooffx + mouseX;
      bodygalileo.pos.y = galileooffy + mouseY;
      help.pos.x = helpoffx + mouseX;
      help.pos.y = helpoffy + mouseY;
    }
  }
}

//Built in mouse & keyboard functions
function mousePressed() {
  dragging = true;
  shipoffx = ship.pos.x - mouseX;
  shipoffy = ship.pos.y - mouseY;
  bodyoffx = bodypax.pos.x - mouseX;
  bodyoffy = bodypax.pos.y - mouseY;
  xenaoffx = bodyxena.pos.x - mouseX;
  xenaoffy = bodyxena.pos.y - mouseY;
  galileooffx = bodygalileo.pos.x - mouseX;
  galileooffy = bodygalileo.pos.y - mouseY;
  helpoffx = help.pos.x - mouseX;
  helpoffy = help.pos.y - mouseY;
  console.log(cam3d.pos.z);
}
function mouseReleased() {
  dragging = false;
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
    if(renderMenu) {
      renderMenu = false;
    }else{
      renderMenu = true;
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
  if(event.delta < 0 && cam3d.pos.z >= 200) {
    cam3d.pos.z -= 4*mult;
  }else if(event.delta > 0 && cam3d.pos.z <= 2200) {
    cam3d.pos.z += 4*mult;
  }
}

//Static bodies. The ones that ignore physics and just dont move.
function Body(x,y,ra,m,r,g,b) {
  this.pos = createVector(x,y);
  this.mass = m;
  this.col = createVector(r,g,b);
  this.atmos = random(50,200);
  this.radius = ra/2;
  this.angle = 0;
  
  //this.render = function(){
    //push();
    //if(this.pos.x + ra + 90 < -width/2 || this.pos.x - ra - 90 > width || this.pos.y + ra + 90 < -height/2 || this.pos.y -ra - 90 > height) {
    //  return;
    //}
    //fill(this.col.x,this.col.y,this.col.z);
    //ellipse(this.pos.x,this.pos.y,ra);
    //fill(this.col.z,this.col.y,this.col.x,50);
    //noStroke();
    //ellipse(this.pos.x,this.pos.y,ra+this.atmos);
    //pop();
  //}
  
  this.rotate = function() {
    this.angle += 0.01;
  }
  
  this.render = function(){
    push();
    translate(this.pos.x,this.pos.y);
    rotateY(this.angle);
    noStroke();
    texture(earthimg);
    //emissiveMaterial(255,80,0);
    sphere(ra);
    pop();
  }
  
  this.attract = function() {
    this.force = p5.Vector.sub(this.pos, ship.pos);
    this.distanceSq = this.force.magSq();
    this.G = 0.5;
    this.strength = this.G * (this.mass * ship.mass) / this.distanceSq;
    this.force.setMag(this.strength);
    if(sqrt(this.distanceSq) > ra/2) { //sqrt(this.distanceSq) <= 1000
      ship.vel.add(this.force);
    }
  }
  
  
}

function calcForce(x1,y1,m1,x2,y2,m2) {
  var onePos = createVector(x2,y2);
  var twoPos = createVector(x1,y1);
  var force = p5.Vector.sub(onePos, twoPos);
  var distanceSq = force.magSq();
  var G = 0.5;
  var strength = G * (m2 * m1) / distanceSq;
  force.setMag(strength);
  return force;
}

//Intro/Help Screen
function introScreen() {
  this.pos = createVector(0,0);
  
  this.render = function() {
    if(!renderMenu) {
      return;
    }else{
      push();
      translate(this.pos.x,this.pos.y);
      fill(0,0,255,100);
      noStroke();
      rect(0,0,width-30,height-30);
      stroke(0);
      fill(255);
      textAlign(CENTER,CENTER);
      textSize(50);
      textFont(menufont);
      text("Untitled SpaceGame",0,-270);
      textSize(30);
      textFont(helvfont);
      text("Left/Right Arrow : Turn Your ship. Duh!",0,-160);
      text("Up Arrow : Thrusters. Hopefully you knew all that",0,-120);
      text("Down Arrow : Hold to stop spinning.",0,-80);
      text("Click and drag anywhere to move the camera",0,-20);
      text("Go find your ship",0,20);
      text("It's currently orbiting a small planet",0,80);
      text("Down and Right from here",0,120);
      text("Have a go at making it's orbit more circular",0,160);
      text("M toggles music",0,240);
      text("Esc toggles this screen",0,280);
      pop();
    }
  }
  
}

//All things to do with "fly boi"
function Ship() {
  this.pos = createVector(800,800);
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(1.6,-1.3);
  this.deltar = 0;
  this.mass = 1;
  this.bodyforce = 0;
  
  this.update = function() {
    this.pos.add(this.vel);
  }
  
  this.thrusters = function() {
    var force = p5.Vector.fromAngle(this.heading);
    this.vel.add(force);
    
  }
  
  this.render = function() {
    push();
    pointLight(255,255,255,bodygalileo.pos);
    translate(this.pos.x,this.pos.y);
    rotateZ(this.heading + PI/2);
    //fill(255,10,10);
    ambientMaterial(255,10,10);
    //specularMaterial();
    noStroke()
    ellipsoid(10,20,10);
    //fill(150);
    ambientMaterial(150,150,150);
    //specularMaterial();
    translate(0,20);
    sphere(7);
    //rect(0,0,20,35,15,15,0,0);
    //fill(10);
    //ellipse(0,-5,13);
    
    //flames
    fill(230,88,2);
    if(keyIsDown(UP_ARROW)) {
      triangle(-10,20,10,20,0,random(20,40));
    }
    pop();
  }
  
  this.setRotation = function(a) {
    this.rotation = a;
  }
  
  this.turn = function() {
    this.heading += this.deltar;
  }
  
  this.inputs = function() {
    if(keyIsDown(UP_ARROW)) {
      var force = p5.Vector.fromAngle(this.heading);
      this.vel.add(force.mult(0.01));
    }
    
    if(keyIsDown(LEFT_ARROW)) {
      this.deltar += -0.005;
      rcsaudio.setVolume(0.001);
      rcsaudio.play();
    }
    if(keyIsDown(RIGHT_ARROW)) {
      this.deltar += 0.005;
      rcsaudio.setVolume(0.001);
      rcsaudio.play();
    }
    if(keyIsDown(DOWN_ARROW)) {
      if(this.deltar < 0 && this.deltar > 0.005) {
        this.deltar = 0;
      }else if(this.deltar < 0) {
        this.deltar += 0.005
      }
      
      if(this.deltar > 0 && this.deltar < 0.005) {
        this.deltar = 0;
      }else if(this.deltar > 0) {
        this.deltar -= 0.005;
      }
    }
  }
}