import { Point, Point3D } from './geometry.js';
import { triangulation, generateTriangulation } from './triangulation.js';
// import { testInsideCircle, testInsideTriangle, testPerlinNoise, testRandomNoise, testPerlinNoise_moving, testCubeProjection } from './tests.js';
import { Perlin2D } from './perlin.js'
import { Drawer } from './drawing.js';

const numberOfPoints = 6000;
const dX = 0.
const dY = 0.005;
const focalLength = 400;
const perlinScale = 2.5;
const rotationAngle = -0.5;
const distanceFromCamera = 2000;
const noiseHeight = 400;

function initializeCanvas(canvasId){
    var canvas = document.getElementById(canvasId);
    console.log(canvas.width)
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    return canvas;
}

function halton(index, base){
    const SKIP = 20;
    index += SKIP;

    var f = 1.0;
    var result = 0;
    while (index > 0) {
        f = f/base;
        result += f*(index % base);
        index = Math.floor(index/base)
    }
    return result;
}

function randomUniform(count, aspectRatio = 1){
    var points = [];
    for(let i = 0; i < count; i++){
        points.push(new Point(Math.random() * aspectRatio, Math.random(), i));
    }
    return points;
}

function randomHalton(count, aspectRatio = 1, base_x = 3, base_y = 7){
    var points = [];
    for(let i = 0; i < count; i++){
        points.push(new Point(halton(i, base_x) * aspectRatio, halton(i, base_y), i));
    }
    return points;
}

function rotateX(point, radian, centerz) {
    const cosine = Math.cos(radian);
    const sine = Math.sin(radian);

    return new Point3D(point.x,
       (point.y*cosine - (point.z - centerz)*sine),
       centerz + (point.y*sine + (point.z - centerz)*cosine)
    );
};


function main(){

    /********* SETUP *********/
    var canvas = initializeCanvas("perlin");
  
    var ctx = canvas.getContext("2d");
    
    var drawer = new Drawer(ctx);
    var perlin = new Perlin2D(256);

    const { width, height } = drawer.getDimensions();
    console.log(width, height)
    const aspectRatio = drawer.getAspectRatio();
    
    var points = randomUniform(numberOfPoints, aspectRatio);
    var triangles = triangulation(points);

    var scaledPoints = points.map(point => new Point((point.x - aspectRatio/2)*2000, (point.y - 0.5)*2000))
    
    var offsetX = 0;
    var offsetY = 0;
    var loop = () => {
        window.requestAnimationFrame(loop);

        var noise = points.map(point => perlin.at((point.x + offsetX)*perlinScale, (point.y + offsetY)*perlinScale))
        
        var triangleColors = triangles.map(triangle => {
            let color = Math.max(noise[triangle[0]], noise[triangle[1]], noise[triangle[2]]);
            color = (color + 0.5)*255;
            return "rgb(" + color + "," + color + "," + color + ")";

        })
        var rasterizedPoints = scaledPoints
                                .map((point, index) => new Point3D(point.x, point.y, noise[index]*noiseHeight - distanceFromCamera))
                                .map(point => rotateX(point, rotationAngle, -distanceFromCamera))
                                .map(point => new Point((point.x*focalLength)/point.z, (point.y*focalLength)/point.z))
                                .map(point => new Point(point.x + width/2, point.y + height/2));

        drawer.clear();
        drawer.drawTriangles(rasterizedPoints, triangles, triangleColors);
        offsetX += dX;
        offsetY += dY;
    }

    loop();
}


window.onload = main();



