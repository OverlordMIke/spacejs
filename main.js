var ship;
var forceres;
var bodypax, bodyxena, bodygalileo;
var ambientaudio, rcsaudio, rocketaudio;
//var zoomscale = 500;
var bgimg, earthimg;
var musicMuted = true;
var wfix, hfix;
var cam;
var paused = false;
var zoomscale = 500;
var spacefont;
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;
var engine;
var world;
var shiphb, galileohb;

function preload() {
  soundFormats("mp3");
  ambientaudio = loadSound('gameAudio/ambient');
  soundFormats("ogg");
  rcsaudio = loadSound('gameAudio/rcs');
  rocketaudio = loadSound('gameAudio/rocket');
  bgimg = loadImage('gameImgs/doublespace.jpg');
  earthimg = loadImage('gameImgs/earth.jpg');
  spacefont = loadFont('gameFonts/menufont.ttf');
}

function setup() {
  //joojoo magic
  createCanvas(720, 720, WEBGL);
  frameRate(60);
  rectMode(CENTER);
  ellipseMode(CENTER);
  wfix = width/2;
  hfix = height/2;
  
  //create all the things
  //Body(x,y,radius,mass,red,green,blue)
  bodypax = new Body(1500,-400,600,4000,126,132,225);
  bodyxena = new Body(3000,-100,550,2500,147,81,43);
  bodygalileo = new Body(1000,1000,100,1500,42,207,231);
  ship = new Ship();
  cam = new cameraEngine();
  
  engine = Engine.create();
  world = engine.world;
  shiphb = Bodies.rectangle(ship.pos.x,ship.pos.y,20,40);
  shiphb.frictionAir = 0;
  galileohb = Bodies.circle(bodygalileo.pos.x,bodygalileo.pos.y,bodygalileo.radius,{isStatic: true});
  //Engine.run(engine);
  World.add(world,shiphb);
  World.add(world,galileohb);
  world.gravity.y = 0;
  console.log(shiphb);
  console.log(world);
  
  
  //start bg music
  //ambientaudio.setVolume(0.05);
  //ambientaudio.play();
}

function draw() {
  background(10);
  
  //forceres = calcForce(ship.pos.x,ship.pos.y,ship.mass,bodygalileo.pos.x,bodygalileo.pos.y,bodygalileo.mass);
  
  
  //skybox
  push();
  translate(ship.pos.x,ship.pos.y)
  noStroke();
  texture(bgimg);
  sphere(4000);
  pop();
  
  //bodypax.render();
  //bodyxena.render();
  
  ship.render();
  bodygalileo.render();
  orbitalPath(ship.pos,ship.vel);
  cam.run();
  
  if(!paused) {
    ship.turn();
    ship.update();
    ship.inputs();
    //bodypax.attract();
    //bodyxena.attract();
    bodygalileo.attract();
    bodygalileo.rotate();
  }
  
  if(paused) {
    push();
    translate(ship.pos.x,ship.pos.y,cam.pos.z-100);
    textAlign(CENTER,CENTER);
    textFont(spacefont);
    text("PAUSED",0,0);
    pop();
  }
  
  
  //push();
  //fill(255);
  //rect(shiphb.position.x,shiphb.position.y,20,40);
  //ellipse(galileohb.position.x,galileohb.position.y,210);
  //pop();
  
  //Matter.Body.setVelocity(shiphb,ship.vel);
  //shiphb.force = ship.vel;
  Engine.update(engine);
  
  //Broken debug info
  //
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