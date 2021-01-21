import { Point, Point3D } from './geometry.js';
import { triangulation, generateTriangulation } from './triangulation.js';
import { testInsideCircle, testInsideTriangle, testPerlinNoise, testRandomNoise, testPerlinNoise_moving, testCubeProjection } from './tests.js';
import { Perlin2D } from './perlin.js'
import { Drawer } from './drawing.js';
import { CanvasControls } from './controls.js';

const numberOfPoints = 6000;
const dX = 0.
const dY = 0.005;
const focalLength = 400;
const perlinScale = 2.5;
const rotationAngle = -0.5;
const noiseHeight = 400;

function initializeCanvas(canvasId){
    var canvas = document.getElementById(canvasId);

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

function main(){

    /********* SETUP *********/
    var canvas = initializeCanvas("perlin");
    var ctx = canvas.getContext("2d");

    var drawer = new Drawer(ctx);
    var perlin = new Perlin2D(256);

    const { width, height } = drawer.getDimensions();
    const aspectRatio = drawer.getAspectRatio();
    
    var points = randomUniform(numberOfPoints, aspectRatio);
    var triangles = triangulation(points);

    
    var distanceFromCamera = 2000;
    var offsetX = 0;
    var offsetY = 0;
    
    const scaledPoints = points.map(point => new Point((point.x - aspectRatio/2)*2000, (point.y - 0.5)*2000))
    
    var triangleColors = new Array(triangles.length);
    var noise = new Array(points.length);
    var rasterizedPoints = scaledPoints.map(_ => new Point3D(0,0,0));

    var animation = () => {

        points.forEach((point, index) => {
            noise[index] = perlin.at((point.x + offsetX)*perlinScale, (point.y + offsetY)*perlinScale);
        });
        
        triangles.forEach((triangle, index) => {
            let color = Math.floor((Math.max(noise[triangle[0]], noise[triangle[1]], noise[triangle[2]]) + 0.5)*255);
            triangleColors[index] = "rgb(" + color + "," + color + "," + color + ")"
        })
        
            
        rasterizedPoints.forEach((point, index) => {
            point.x = scaledPoints[index].x;
            point.y = scaledPoints[index].y;
            point.z = noise[index]*noiseHeight - distanceFromCamera;
            
            point.rotateAroundXAxis(rotationAngle, -distanceFromCamera);
        })
        // Project the points onto the camera
        rasterizedPoints.forEach(point => {
            point.x = (point.x*focalLength)/point.z;
            point.y = (point.y*focalLength)/point.z;
        })
        
        // Center the picture on the canvas
        rasterizedPoints.forEach(point => {
            point.x = Math.floor(point.x + width/2);
            point.y = Math.floor(point.y + height/2);
        })
        

        drawer.clear();
        drawer.drawTriangles(rasterizedPoints, triangles, triangleColors);
        drawer.render();

        offsetX += dX;
        offsetY += dY;
    }
    var controls = new CanvasControls("controls", animation);
    // loop();
}


window.onload = main();



