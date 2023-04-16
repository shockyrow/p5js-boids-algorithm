const SKETCH_MARGIN = 32;

const INITIAL_PLANES_COUNT = 64;

const paper_planes = [];

function getCanvasWidth() {
  return windowWidth - SKETCH_MARGIN * 2;
}

function getCanvasHeight() {
  return windowHeight - SKETCH_MARGIN * 2;
}

function setup() {
  createCanvas(getCanvasWidth(), getCanvasHeight());

  noStroke();

  for (let i = 0; i < INITIAL_PLANES_COUNT; i++) {
    paper_planes.push(new PaperPlane());
  }
}

function draw() {
  background(24);

  fill(128);
  text(paper_planes.length, 8, 20);

  if (keyIsPressed) {
    if (keyCode === UP_ARROW) {
      paper_planes.push(new PaperPlane());
    } else if (keyCode === DOWN_ARROW) {
      paper_planes.pop();
    }
  }

  paper_planes.forEach((paper_plane) => {
    if (mouseIsPressed) {
      let mouse_position = createVector(mouseX, mouseY);
      let distance = mouse_position.dist(paper_plane.position);
      let mouse_force = p5.Vector.sub(paper_plane.position, mouse_position);

      if (distance < 100) {
        paper_plane.applyForce(mouse_force);
      }
    }

    paper_plane.flocking(paper_planes);
    paper_plane.update();
    paper_plane.draw();
  });
}
