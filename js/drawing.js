var POINT_RADIUS = 5;

class Drawer {
    constructor(context) {
        this.context = context;
    }

    getAspectRatio(){
        let { clientWidth, clientHeight } = this.context.canvas;
        return clientWidth/clientHeight; 
    }
    
    getDimensions(){
        let { clientWidth, clientHeight } = this.context.canvas;
        return { height: clientHeight, width: clientWidth };
    }

    drawPoints(points, fillStyle = "#000000") {
        this.context.fillStyle = fillStyle;
        points.forEach(point => {
            this.context.beginPath();
            this.context.arc(point.x, point.y, POINT_RADIUS, 0, 2*Math.PI);
            this.context.fill();
        });
    }
    
    drawEdges(points, edges, strokeStyle = "#000000") {
        this.context.strokeStyle = strokeStyle;

        edges.forEach(edge => {
            this.context.beginPath();
            this.context.moveTo(points[edge[0]].x, points[edge[0]].y);
            this.context.lineTo(points[edge[1]].x, points[edge[1]].y);
            this.context.stroke();
        })
    }

    drawTriangles(points, triangles, triangleColors){    

        triangles.forEach((triangle, index) => {
            this.context.fillStyle = triangleColors[index];
            this.context.beginPath();
            this.context.moveTo(points[triangle[0]].x, points[triangle[0]].y);
            this.context.lineTo(points[triangle[1]].x, points[triangle[1]].y);
            this.context.lineTo(points[triangle[2]].x, points[triangle[2]].y);
            this.context.closePath();
            this.context.fill();
            
        })
    }

    drawPixel(i, j, color  = "#000000"){
        this.context.fillStyle = color;
        this.context.fillRect(i, j, 1, 1);
    }

    clear() {
        let { width, height } = this.context.canvas;
        this.context.clearRect(0, 0, width, height);
    }

}

export { Drawer };