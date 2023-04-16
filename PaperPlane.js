class PaperPlane {
  constructor() {
    this.size = 5;
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D().mult(random(1, 2));
    this.acceleration = createVector();
    this.max_speed = 4;
    // this.color = random(['red', 'slateblue', 'gold']);
    this.color = 84;
    // this.color = 'cyan';
    this.perceptionRadius = random(96, 128);
  }

  checkBoundries() {
    if (this.position.x < 0) {
      this.position.x = width;
    } else if (this.position.x > width) {
      this.position.x = 0;
    }

    if (this.position.y < 0) {
      this.position.y = height;
    } else if (this.position.y > height) {
      this.position.y = 0;
    }
  }

  alignment(paper_planes) {
    let count = 0;
    const result = createVector();

    paper_planes.forEach(paper_plane => {
      result.add(paper_plane.velocity);
      count++;
    });

    if (count > 0) {
      result.div(count);
    }

    return result;
  }

  cohesion(paper_planes) {
    let count = 0;
    const result = createVector();

    paper_planes.forEach(paper_plane => {
      result.add(paper_plane.position);
      count++;
    });

    if (count > 0) {
      result.div(count);
    }

    return result;
  }

  separation(paper_planes) {
    let count = 0;
    const result = createVector();

    paper_planes.forEach(paper_plane => {
      if (this === paper_plane) {
        return;
      }

      const force = p5.Vector.sub(this.position, paper_plane.position);
      force.div(p5.Vector.dist(this.position, paper_plane.position));
      result.add(force);
      count++;
    });

    if (count > 0) {
      result.div(count);
    }

    return result;
  }

  flocking(paper_planes) {
    const flock = paper_planes.filter(
      paper_plane => this.position.dist(paper_plane.position) < this.perceptionRadius
    );

    console.log(flock);

    this.applyForce(this.separation(flock).normalize());
    this.applyForce(this.alignment(flock).normalize());
    this.applyForce(p5.Vector.sub(this.cohesion(flock), this.position).normalize());
  }

  update() {
    this.velocity.add(this.acceleration).limit(this.max_speed);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0);
    this.checkBoundries();
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    beginShape();
    fill(this.color);
    vertex(this.size, 0);
    vertex(-this.size, this.size);
    vertex(-this.size * .5, 0);
    vertex(-this.size, -this.size);
    endShape(CLOSE);
    pop();
  }

  applyForce(force) {
    this.acceleration.add(force);
  }
}
