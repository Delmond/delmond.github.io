function grad(hash, x, y, z=0) {
    let h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
    let u = h<8 ? x : y;                 // INTO 12 GRADIENT DIRECTIONS.
    let v = h<4 ? y : h==12||h==14 ? x : z;
    return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
}
function smooth(fract){        
    return fract*fract*fract*(fract*(fract*6 - 15) + 10);
}
function lerp(a, b, lambda){
    return a + lambda*(b - a);
}
function normalize(value){
    // The range of perlin noise is [-sqrt(N/4), -sqrt(N/4)] and we normalize it to [-1, 1]
    return value * Math.sqrt(2)/2;
}

// Unit square formula

class Vec2D {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    normalize(){
        let mag = Math.sqrt(this.x*this.x + this.y*this.y);
        this.x /= mag;
        this.y /= mag;
        return this;
    }
    static random(){
        return (new Vec2D(2*Math.random() - 1, 2*Math.random() - 1)).normalize();
    }
    static add(a, b) {
        return new Vec2D(a.x + b.x, a.y + b.y);
    }
    static dot(a, b) {
        return a.x*b.x + a.y*b.y;
    }
}

class Perlin2D {

    constructor(size=2**8){
        this.size = size;
    
        this.table = this.permutationTable()
    }

    generateTable(){
        var table = []
        for(var i = 0; i < this.size + 1; i++){
            let row = []
            for (var j = 0; j < this.size + 1; j++){
                row.push(Vec2D.random())
            }
            table.push(row)
        }
        return table;
    }
    permutationTable(){
        
        // Original permutation table used by Ken Perlin in his Improved Perlin Noise implementation
        let p = [151,160,137,91,90,15,
            131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
            190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
            88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
            77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
            102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
            135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
            5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
            223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
            129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
            251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
            49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
            138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
        ];
        // Duplicate the table
        return [...p, ...p];
    }

    at(x, y){
        let i = Math.floor(x) & 255;
        let j = Math.floor(y) & 255;
        
        let xFrac = x - Math.floor(x);
        let yFrac = y - Math.floor(y);
        
        
        let A  = this.table[i] + j;
        let B  = this.table[i + 1] + j;
        let AA = this.table[A];
        let AB = this.table[A + 1];
        let BA = this.table[B];
        let BB = this.table[B + 1];
        
        var u = smooth(xFrac);
        var v = smooth(yFrac);
        
        
        return normalize(
            lerp(
                lerp(grad(this.table[AA], xFrac, yFrac), grad(this.table[BA], xFrac - 1, yFrac), u),
                lerp(grad(this.table[AB], xFrac, yFrac - 1), grad(this.table[BB], xFrac - 1, yFrac - 1), u),
                v
            )
        )
    }
    
}

export { Perlin2D };