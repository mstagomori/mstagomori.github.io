var circles = [];

function randomPosition(xmax, ymax) {
  let position = [Math.random()*xmax, Math.random()*ymax];
  return position;
}

function randomRadius(x, y, xmax, ymax, rmin, rmax) {
  let r = Math.random()*rmax;
  if (r < rmin) {
    r += rmin;
  }

  if (x-r < 0) {
    r = x;
  }

  if (y-r < 0) {
    r = y;
  }

  if (x+r > xmax) {
    r = xmax-x;
  }

  if (y+r > ymax) {
    r = ymax-y;
  }

  return r;
}

function distance (position, circles_list) {
  let d = 100;
  for (let circle of circles_list) {
    let point_circle_distance = Math.sqrt((circle[0] - position[0])**2 + (circle[1] - position[1])**2) - circle[2];
    d = Math.min(d, point_circle_distance);
  }
  return d;
}

function createCircle() {
  let p = randomPosition(600, 600);
  let x = p[0];
  let y = p[1];
  let d = distance(p, circles);
  if (d > 10) {
    r = randomRadius(x, y, 600, 600, 10, d);
    circles.push([x, y, r]);

  let div = document.createElement('div');
  div.style.position = "absolute";
  div.style.width = r.toString() +"px";
  div.style.height = r.toString() +"px";
  div.style.marginTop = y.toString()+"px";
  div.style.marginLeft = x.toString()+"px";
  div.style.background = "black";
  div.style.borderRadius = "50%";
  document.getElementById('square').insertAdjacentElement('afterbegin', div);
  }
}

function play() {
  start = setInterval(createCircle, 100);
}

function pause() {
  clearInterval(start);
}