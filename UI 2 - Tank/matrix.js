export class MatrixUtility {
    constructor() {}
    static createIdentityMatrix() {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
    }
    static createTranslationMatrix(Tx, Ty) {
        return [
            [1, 0, Tx],
            [0, 1, Ty],
            [0, 0, 1]
        ];
    }
    static createRotationMatrix(angle) {
        return [
            [Math.cos(angle), -Math.sin(angle), 0],
            [Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 1]
        ];
    }
    static createScaleMatrix(Sx, Sy) {
        return [
            [Sx, 0, 0],
            [0, Sy, 0],
            [0, 0, 1]
        ];
    }
    static createFixedPointRotationMatrix(anchor, angle) {
        console.log(anchor);
        var m1 = this.createTranslationMatrix(-anchor.x, -anchor.y);
        var m2 = this.createRotationMatrix(angle);
        var m3 = this.createTranslationMatrix(anchor.x, anchor.y);
        console.log(m1,m2,m3);
        var hasil;
        hasil = this.MultiplyMatrix(m3,m2);
        hasil = this.MultiplyMatrix(hasil,m1);
        return hasil
    }
    static createFixedPointScaleMatrix(anchor, Sx, Sy) {
        var m1 = this.createTranslationMatrix({Tx:-anchor.x, Ty:-anchor.y});
        var m2 = this.createScaleMatrix(Sx, Sy);
        var m3 = this.createTranslationMatrix({Tx:anchor.x, Ty:anchor.y});

        var hasil;
        hasil = this.MultiplyMatrix(m3,m2);
        hasil = this.MultiplyMatrix(hasil,m1);
        return hasil
    }
    static MultiplyMatrix(A,B) {
        var hasil = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ];

        for (var i=0; i<3; i++) {
            for (var j=0; j<3; j++) {
                for (var k=0; k<3; k++) {
                    hasil[i][k] += A[i][j] * B[j][k];
                }
            }
        }
        return hasil;
    }
    static transformPoint(oldPoint, m) {
        var xi = m[0][0]*oldPoint.x + m[0][1]*oldPoint.y + m[0][2]*1;
        var yi = m[1][0]*oldPoint.x + m[1][1]*oldPoint.y + m[1][2]*1;

        return{x:xi,y:yi};
    }
    static transformPoints(arrPoints, m) {
        var hasil = [];
        for (var i=0; i<arrPoints.length; i++) {
            var hasilPoint;
            hasilPoint = this.transformPoint(arrPoints[i], m);
            hasil.push(hasilPoint);
        }
        

        return hasil;
    }
}