var POINT_RADIUS = 5;

class Drawer {
    constructor(context) {
        this.context = context;

        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = context.canvas.width;
        this.offscreenCanvas.height = context.canvas.width;  
        this.offscreenContext = this.offscreenCanvas.getContext("2d");
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
        this.offscreenContext.fillStyle = fillStyle;
        points.forEach(point => {
            this.offscreenContext.beginPath();
            this.offscreenContext.arc(point.x, point.y, POINT_RADIUS, 0, 2*Math.PI);
            this.offscreenContext.fill();
        });
    }
    
    drawEdges(points, edges, strokeStyle = "#000000") {
        this.offscreenContext.strokeStyle = strokeStyle;

        edges.forEach(edge => {
            this.offscreenContext.beginPath();
            this.offscreenContext.moveTo(points[edge[0]].x, points[edge[0]].y);
            this.offscreenContext.lineTo(points[edge[1]].x, points[edge[1]].y);
            this.offscreenContext.stroke();
        })
    }

    drawTriangles(points, triangles, triangleColors){    

        triangles.forEach((triangle, index) => {
            this.offscreenContext.fillStyle = triangleColors[index];
            this.offscreenContext.beginPath();
            this.offscreenContext.moveTo(points[triangle[0]].x, points[triangle[0]].y);
            this.offscreenContext.lineTo(points[triangle[1]].x, points[triangle[1]].y);
            this.offscreenContext.lineTo(points[triangle[2]].x, points[triangle[2]].y);
            this.offscreenContext.closePath();
            this.offscreenContext.fill();
            
        })
    }

    drawPixel(i, j, color  = "#000000"){
        this.offscreenContext.fillStyle = color;
        this.offscreenContext.fillRect(i, j, 1, 1);
    }

    clear() {
        let { width, height } = this.offscreenCanvas;
        this.offscreenContext.clearRect(0, 0, width, height);
    }
    render(){
        this.context.drawImage(this.offscreenCanvas, 0, 0);
    }

}

export { Drawer };