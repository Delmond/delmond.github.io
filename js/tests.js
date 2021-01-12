import { Triangle, Point, Point3D } from './geometry.js';
import { Drawer } from './drawing.js';
import { Perlin2D } from './perlin.js'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function insideCircle(ctx){

    var drawer = new Drawer(ctx);
    var aspectRatio = drawer.getAspectRatio();
    

    var triangle = []; 
    var points = [];
    
    for(var i = 0; i < 3; i++)
        triangle.push(new Point(Math.random()*aspectRatio, Math.random()));
    triangle = new Triangle(...triangle);

    for(var i = 0; i < 100000; i++)
        points.push(new Point(Math.random()*aspectRatio, Math.random()));
    

    var inside_points = points.filter(point => triangle.isInsideCircumcircle(point));
    var outside_points = points.filter(point => !triangle.isInsideCircumcircle(point));

    drawer.drawPoints(drawer.scaleToCanvas(inside_points), "#00ff00");
    drawer.drawPoints(drawer.scaleToCanvas(outside_points), "#ff0000");
    
    var scaled_triangle_points = drawer.scaleToCanvas(triangle.getPoints());
    drawer.drawPoints(scaled_triangle_points);
    drawer.drawTriangles(scaled_triangle_points, [[0, 1, 2]], "#ffff00")

}


function insideTriangle(ctx) {
    var drawer = new Drawer(ctx);
    var aspectRatio = drawer.getAspectRatio();
    
    var triangle = []; 
    var points = [];
    
    for(var i = 0; i < 3; i++)
        triangle.push(new Point(Math.random()*aspectRatio, Math.random()));
    triangle = new Triangle(...triangle);

    for(var i = 0; i < 100000; i++)
        points.push(new Point(Math.random()*aspectRatio, Math.random()));
    

    var inside_points = points.filter(point => triangle.isInside(point));
    var outside_points = points.filter(point => !triangle.isInside(point));

    drawer.drawPoints(drawer.scaleToCanvas(inside_points), "#00ff00");
    drawer.drawPoints(drawer.scaleToCanvas(outside_points), "#ff0000");
    
    var scaled_triangle_points = drawer.scaleToCanvas(triangle.getPoints());
    drawer.drawPoints(scaled_triangle_points);
    drawer.drawTriangles(scaled_triangle_points, [[0, 1, 2]], "#ffff00")
    
}


function perlinNoise(ctx){
    var drawer = new Drawer(ctx);
    var perlin = new Perlin2D(256);
    
    let { height, width }  = drawer.getDimensions(false);
    let scale = 10.0/width;
    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            let noise = perlin.at(i*scale, j*scale);
            let scaled_noise = (noise + 1)/2.0; 

            let color = Math.floor(scaled_noise*256); 
         
            let colorString = "rgb(" + color + "," + color + "," + color + ")";
            drawer.drawPixel(i, j, colorString);
        }
    }
}

async function perlinNoise_moving(ctx, dx, dy, time){
    var drawer = new Drawer(ctx);
    var perlin = new Perlin2D(256);
    
    let { height, width }  = drawer.getDimensions();
    let scale = 10.0/width;
    let t = 0;
    while(true) {
        let offset_x = t*dx;
        let offset_y = t*dy;
        
        for(let i = 0; i < width; i++){
            for(let j = 0; j < height; j++){
                let noise = perlin.at((i + offset_x)*scale, (j + offset_y)*scale);
                let scaled_noise = (noise + 1)/2.0; 

                let color = Math.floor(scaled_noise*256); 
            
                let colorString = "rgb(" + color + "," + color + "," + color + ")";
                drawer.drawPixel(i, j, colorString);
            }
        }
        t += 1;
        await sleep(time);
    }
}

function randomNoise(ctx){
    var drawer = new Drawer(ctx);
    let { height, width }  = drawer.getDimensions();
    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            let color = Math.floor(Math.random() * (2**8)); 
            let colorString = "rgb(" + color + "," + color + "," + color + ")";
            drawer.drawPixel(i, j, colorString);
        }
    }

}

function cubeProjection(ctx){
    var drawer = new Drawer(ctx);
    const { height, width } = drawer.getDimensions();

    const size = 250;
    var center = new Point3D(0, 0, -2000)
    var focal_length = 500;
    var points = [
        new Point3D(center.x - size, center.y - size, center.z - size),
        new Point3D(center.x + size, center.y - size, center.z - size),
        new Point3D(center.x + size, center.y + size, center.z - size),
        new Point3D(center.x - size, center.y + size, center.z - size),
        new Point3D(center.x - size, center.y - size, center.z + size),
        new Point3D(center.x + size, center.y - size, center.z + size),
        new Point3D(center.x + size, center.y + size, center.z + size),
        new Point3D(center.x - size, center.y + size, center.z + size),
    ];

    var edges = [[0, 1], [1, 2], [2, 3], [3, 0],
                 [0, 4], [4, 5], [5, 1], [1, 0],
                 [1, 5], [5, 6], [6, 2], [2, 1],
                 [3, 2], [2, 6], [6, 7], [7, 3],
                 [0, 3], [3, 7], [7, 4], [4, 0],
                 [4, 7], [7, 6], [6, 5], [5, 4]
    ];

    // var projected_points = points.map( point => new Point(point.x, point.y));
    
    var rotateX = (point, radian, center) => {
        var cosine = Math.cos(radian);
        var sine = Math.sin(radian);

        return new Point3D(point.x, 
           center.y + ((point.y - center.y)*cosine - (point.z - center.z)*sine), 
           center.z + ((point.y - center.y)*sine + (point.z - center.z)*cosine)
        );
    };


    function loop() {
        window.requestAnimationFrame(loop);
        drawer.clear();
        points = points.map(point => rotateX(point, 0.02, center));
        var projected_points = points.map(point => new Point((point.x*focal_length)/point.z, (point.y*focal_length)/point.z));
        var rasterized_points = projected_points.map(point => new Point(point.x + width/2, point.y + height/2))
        drawer.drawEdges(rasterized_points, edges, "#00f");
        drawer.drawPoints(rasterized_points, "#0f0");

    };
    loop();
}

export {
    insideCircle as testInsideCircle,
    insideTriangle as testInsideTriangle,
    perlinNoise as testPerlinNoise,
    perlinNoise_moving as testPerlinNoise_moving,
    randomNoise as testRandomNoise,
    cubeProjection as testCubeProjection
};


