var EPSION = 1e-7;

function det3x3(det) {
    let m1 = det[0][0]*(det[1][1]*det[2][2] - det[1][2]*det[2][1]);
    let m2 = det[0][1]*(det[1][0]*det[2][2] - det[2][0]*det[1][2]);
    let m3 = det[0][2]*(det[1][0]*det[2][1] - det[2][0]*det[1][1]);
    return m1 - m2 + m3;
}

class Point {
    constructor(x, y, index = -1){
        this.x = x;
        this.y = y;
        this.index = index;
    }
    static equal(a, b) {
        return Math.abs(a.x - b.x) < EPSION && Math.abs(a.y - b.y) < EPSION;
    }
    static random(index = -1){
        return new Point(Math.random(), Math.random(), index)
    }
}

class Point3D {
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static substract(a, b){
        return new Point3D(a.x - b.x, a.y - b.y, a.z - b.z);
    }

}

class Triangle {
    constructor(a, b, c){
        this.a = a;
        this.b = b;
        this.c = c;

        this.counterClockwise = this.orientation() > 0;
    }
    area(){
        let { a, b, c } = this;
        return Math.abs((a.x*(b.y-c.y) + b.x*(c.y-a.y)+ c.x*(a.y-b.y))/2.0);
    }
    
    orientation(){
        let { a, b, c } = this;
        return (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
    }

    isInside(point){
        let { a, b, c } = this;
        let t1 = new Triangle(a, b, point);
        let t2 = new Triangle(a, c, point);
        let t3 = new Triangle(b, c, point);

        let cumulativeArea = t1.area() + t2.area() + t3.area();
        return Math.abs(cumulativeArea - this.area()) < EPSION;
    
    }
    hasPoint(point){
        let { a, b, c } = this;
        return Point.equal(a, point) || Point.equal(b, point) || Point.equal(c, point);
    }
    hasEdge(a, b){
        return this.hasPoint(a) && this.hasPoint(b);
    }
    getOpposingPoint(a, b){
        return [this.a, this.b, this.c].find(point => !Point.equal(point, a) && !Point.equal(point, b));
    }
    isInsideCircumcircle(point){
        // Test the sign of the following matrix
        //  {a, b, c} = triangle
        // | a_x        a_y         a_x^2 + a_y^2           1 |
        // | b_x        b_y         b_x^2 + b_y^2           1 |
        // | c_x        c_y         c_x^2 + c_y^2           1 |
        // | point_x    point_y     point_x^2 + point_y^2   1 |
        let { a, b, c } = this;
        let matrix = [
            [a.x, a.y, a.x**2 + a.y**2],
            [b.x, b.y, b.x**2 + b.y**2],
            [c.x, c.y, c.x**2 + c.y**2],
            [point.x, point.y, point.x**2 + point.y**2]
        ]
        var determinant = - det3x3([matrix[1], matrix[2], matrix[3]])  
                          + det3x3([matrix[0], matrix[2], matrix[3]]) 
                          - det3x3([matrix[0], matrix[1], matrix[3]])
                          + det3x3([matrix[0], matrix[1], matrix[2]]);

        return this.counterClockwise? determinant > 0 : determinant < 0;
    }

    getIndexes(){
        let { a, b, c } = this;
        return [a.index, b.index, c.index];
    }
   
    getPoints(){
        return [this.a, this.b, this.c];
    }

}

export { Point, Point3D, Triangle };