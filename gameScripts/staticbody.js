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