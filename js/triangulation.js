
import { Point, Triangle } from "./geometry.js";

function flip_edge(triangles, a, b, p){
    
    let potential_triangle = new Triangle(a, b, p); 
    let index = triangles.findIndex(triangle => triangle.hasEdge(a, b));
    if (index == -1) {
        triangles.push(potential_triangle);
        return;
    }
    let triangle = triangles.splice(index, 1)[0];
    let opposing_point = triangle.getOpposingPoint(a, b);
    // console.log(opposing_point);
    if(opposing_point && potential_triangle.isInsideCircumcircle(opposing_point)) {
        triangles.push(new Triangle(p, a, opposing_point));
        triangles.push(new Triangle(p, b, opposing_point));
    } else {
        triangles.push(potential_triangle);
        triangles.push(triangle);
    }
}

function extractEdges(triangles){
    var edges = [];
    triangles
        .map(triangle => triangle.getIndexes())
        // .filter(triangle => triangle.every(point => point != -1))
        .map(triangle => triangle.filter(point => point != -1))
        .forEach(triangle => {
            if(triangle.length == 3){
                let [a, b, c] = triangle;    
                edges.push([a, b]);
                edges.push([a, c]);
                edges.push([b, c]);
            } else if(triangle.length == 2) {
                let [a, b] = triangle;
                edges.push([a, b]);
            
            }
            
        });
    return edges;
}


function getSuperTriangle(points) {
    const offset = 0.1;
    const minX = Math.min(...points.map(p => p.x)) - offset;
    const maxX = Math.max(...points.map(p => p.x)) + offset;
    const minY = Math.min(...points.map(p => p.y)) - offset;
    const maxY = Math.max(...points.map(p => p.y)) + offset;
    return new Triangle(new Point(minX, minY), new Point(minX, 2*maxY), new Point(2*maxX, minY));
}

function bowyerwatson(points) {
    
    let superTriangle = getSuperTriangle(points);
    let triangles = [superTriangle];
    
    points.forEach(point => {
        let index = triangles.findIndex(triangle => triangle.isInside(point));
        let { a, b, c } = triangles.splice(index, 1)[0];
        // Split the triangle in 3 
        for(var edge of [[a, b], [a, c], [b, c]]){
            flip_edge(triangles, ...edge, point);
        }
    });

    return triangles
                .map(triangle => triangle.getIndexes())
                .filter(triangle => triangle.every(point => point != -1));

}

function* generateBowyerwatson(points, showSuperTriangle = false){
    let super_triangle = getSuperTriangle(points);
    let triangles = [super_triangle];
    
    var startIndex = showSuperTriangle? 2: 0;

    for(let i = startIndex; i < triangles.length; i++) {
        var point = points[i];
        
        let index = triangles.findIndex(triangle => triangle.isInside(point));
        let lies_in = triangles.splice(index, 1)[0];
        yield [points, extractEdges(triangles), i];
        // Split the triangle in 3 
        let { a, b, c } = lies_in;
        for(const edge of [[a, b], [a, c], [b, c]]) {

            flip_edge(triangles, ...edge, point);
            yield [points, extractEdges(triangles), i];
        }
    };

    yield [points, extractEdges(triangles), i];

}

export { 
    bowyerwatson as triangulation,
    generateBowyerwatson as generateTriangulation
};