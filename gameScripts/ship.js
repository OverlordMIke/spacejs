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
    //pointLight(255,255,255,bodygalileo.pos);
    directionalLight(255,255,255,-wfix,0,0);
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