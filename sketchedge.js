const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');



//SketchSettings

const settings = {
  dimensions: [ 1024, 1024 ],
  animate : false,
  totalFrames : 2,
};


var protoCanvas = document.createElement('canvas');
var colorCanvas = document.createElement('canvas');
const SrcImage = "crow2.png";
const SrcContour = "crow2Contour.png";
const protoContext = protoCanvas.getContext('2d');
const colorContext = colorCanvas.getContext('2d');


//-----------------------------------Utility class for represeting images(zero-indexed)-------------------------------------

//#region image class
class MyImage{
  constructor(data, width, height) {
    this.data =data;
    this.width = width;
    this.height = height;
    this.defaultFilling = new Vector4(0,0,0,0);
  }


  IsCoordinateValid(pos){
    if(pos.x<0 || pos.x >=this.height || pos.y<0 || pos.y >= this.width){
      return false;
    }
    return true;
  }

  //pos: coordinates i: rgba 1234
  GetPixelSingleChannel(pos,i){
    // console.log(pos);
    // if(res>2371584){
    //   console.log(pos);
    // }

    return  this.IsCoordinateValid(pos)? this.data[4*(pos.x*this.width+pos.y)+i-1]:this.defaultFilling.Index(i-1);
  }



  SetPixelSingleChannel(pos,i,val){
    if(this.IsCoordinateValid(pos)){
      data[4*(pos.x*width+pos.y+1)+i] = val;
    }
  }

  GetPixelRGB(pos){
    return new Vector3(this.GetPixelSingleChannel(pos,1),this.GetPixelSingleChannel(pos,2),this.GetPixelSingleChannel(pos,3));
  }

  SetPixelRGB(pos,val){
    this.SetPixelSingleChannel(pos,1,val.x);
    this.SetPixelSingleChannel(pos,2,val.y);
    this.SetPixelSingleChannel(pos,3,val.z);
  }

  GetPixelRGBA(pos){
    return new Vector4(this.GetPixelSingleChannel(pos,1),this.GetPixelSingleChannel(pos,2),this.GetPixelSingleChannel(pos,3),this.GetPixelSingleChannel(pos,4));
  }
  SetPixelRGBA(pos,val){
    this.SetPixelSingleChannel(pos,1,val.x);
    this.SetPixelSingleChannel(pos,2,val.y);
    this.SetPixelSingleChannel(pos,3,val.z);
    this.SetPixelSingleChannel(pos,4,val.w);
  }

}

//#endregion

//---------------------------------Utility classes for vectors---------------------------------------

//#region Vector classes
class Vector2{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  Add(other){
    return new Vector2(this.x+other.x, this.y+other.y);
  }

  AddBy(other){
    this.x += other.x;
    this.y += other.y;
  }

  ScalarAdd(other){
    return new Vector2(this.x+other,this.y+other);
  }

  ScalarAddBy(other){
    this.x += other;
    this.y += other;
  }

  ScalarMultiply(other){
    return new Vector2(this.x*other, this.y *other);
  }

  ScalarMultiplyBy(other){
    this.x *= other;
    this.y *= other;
  }

  Index(i){
    switch(i){
      case 0:
        return this.x;
      case 1:
        return this.y;
    }

    throw new Error('Vector2 index out of range');
  }

  Length(){
    return Math.sqrt(this.x**2+this.y**2);
  }

  Normalize(){
    let length = this.Length();
    this.x /= length;
    this.y /= length;
  }
}

class Vector3{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
  Add(other){
    return new Vector3(this.x+other.x, this.y+other.y,this.z+other.z);
  }

  AddBy(other){
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  }

  ScalarAdd(other){
    return new Vector3(this.x+other,this.y+other,this.z+other);
  }

  ScalarAddBy(other){
    this.x += other;
    this.y += other;
    this.z += other;
  }

  ScalarMultiply(other){
    return new Vector3(this.x*other, this.y *other,this.z*other);
  }

  ScalarMultiplyBy(other){
    this.x *= other;
    this.y *= other;
    this.z *= other;
  }

  xy(){
    return new Vector2(this.x,this.y);
  }
  xz(){
    return new Vector2(this.x,this.z);
  }
  yz(){
    return new Vector2(this.y,this.z);
  }

  Index(i){
    switch(i){
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
    }

    throw new Error('Vector3 index out of range');
  }


  Length(){
    return Math.sqrt(this.x**2+this.y**2+this.z**2);
  }

  Normalize(){
    let length = this.Length();
    this.x /= length;
    this.y /= length;
    this.z /= length;
  }
}

class Vector4{
  constructor(x,y,z,w){
    this.x = x;
    this.y = y;
    this.z =z;
    this.w = w;
  }
  Add(other){
    return new Vector4(this.x+other.x, this.y+other.y,this.z+other.z,this.w+other.w);
  }

  AddBy(other){
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    this.w += other.w;
  }

  ScalarAdd(other){
    return new Vector4(this.x+other,this.y+other,this.z+other,this.w+other);
  }

  ScalarAddBy(other){
    this.x += other;
    this.y += other;
    this.z += other;
    this.w += other;
  }

  ScalarMultiply(other){
    return new Vector4(this.x*other, this.y *other,this.z*other,this.w*other);
  }

  ScalarMultiplyBy(other){
    this.x *= other;
    this.y *= other;
    this.z *=other;
    this.w *= other;
  }
  xy(){
    return new Vector2(this.x,this.y);
  }
  xz(){
    return new Vector2(this.x,this.z);
  }
  yz(){
    return new Vector2(this.y,this.z);
  }

  xyz(){
    return new Vector3(this.x,this.y,this.z);
  }

  yzw(){
    return new Vector3(this.y,this.z,this.w);
  }

  Index(i){
    switch(i){
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
    }

    throw new Error('Vector4 index out of range');
  }

  Length(){
    return Math.sqrt(this.x**2+this.y**2+this.z**2+this.w**2);
  }

  Normalize(){
    let length = this.Length();
    this.x /= length;
    this.y /= length;
    this.z /= length;
    this.w /= length;
  }

}


//#endregion

//-------------------------Filter Functions-----------------------------



// Returns the local area's 'gradient' by comparing the horizontal regression and vertical regression and pick (the one with more color consistency between rows/cols) (!NEED EXPLANATION)
const GetLocalDirection = (img, pos,filterSize)=>{
  let weightedGradient = WeightedSLR(img,pos, filterSize);
  return weightedGradient;
}


//#region obsolete
//Returns the local area's 'gradient' obtained by
//1. avging out each row of the area and set a new point on that row with x = weighted x coordinate of all points, y = avg of all RGB values turned into grayscale (!iMPROVE);
//2. use the new points to calculate the simple linear regression line and use \hat{/alpha} as the local gradient;
//3. The returned result has the following interpretation: x,y: normalized local gradient z: The MSD of the averaged out values(the smaller the 'fitter' the gradient is)
const GetVerticalRegressionStat = (img, pos, size) =>{
  let count = 1;
  let res = GetRowRGBAvg(img,pos,size);
  let avg = RGBToGrayScale(res);
  // if(RGBToGrayScale(res) != 0 && RGBToGrayScale(res) <255){
  //   console.log(pos);console.log(avg);
  // }
  let points = [new Vector2(0,res.w)];
  let ys = [avg];
  let halfLength = Math.floor(size/2);
  for(i = 1; i<=halfLength ;i++){
    res = GetRowRGBAvg(img,new Vector2(pos.x-i,pos.y),size);
    avg = RGBToGrayScale(res);
    points.push(new Vector2(-i,res.w));
    ys.push(avg);
    res = GetRowRGBAvg(img,new Vector2(pos.x+i,pos.y),size);
    avg = RGBToGrayScale(res);
    points.push(new Vector2(i,res.w ));
    ys.push(avg);
    count +=2;
  }
  // console.log(points);
  let gradient =  new Vector2(Covariance(points)/FastMeanSquaredDeviation(halfLength),1);
  gradient.Normalize();
  return new Vector3(gradient.x, gradient.y, MSD(ys));
}


const GetHorizontalRegressionStat = (img, pos, size) =>{
  let count = 1;
  let res = GetColumnRGBAvg(img,pos,size);
  let avg = RGBToGrayScale(res);

  // console.log(res);

  let points = [new Vector2(res.w,0)];
  // console.log(points[0]);
  let ys = [avg];
  let halfLength = Math.floor(size/2);
  for(i = 1; i<=halfLength ;i++){
    res = GetColumnRGBAvg(img,new Vector2(pos.x,pos.y-i),size);
    avg = RGBToGrayScale(res);
    points.push(new Vector2(res.w,-i));
    ys.push(avg);
    res = GetColumnRGBAvg(img,new Vector2(pos.x,pos.y+i),size);
    avg = RGBToGrayScale(res);
    points.push(new Vector2(res.w,i));
    ys.push(avg);
    count +=2;
  }
  // console.log(Covariance(points));
  let gradient = new Vector2(1,Covariance(points)/FastMeanSquaredDeviation(halfLength));
  gradient.Normalize();
  return new Vector3(gradient.x, gradient.y, MSD(ys));
}



// Returns the average RGB of the row of pixels of length \size centered at \pos (pixels outside the image boundary are considered black) and the avg position as w
const GetRowRGBAvg = (img, pos, size) =>{
  let count = 1;
  let sum = img.GetPixelRGB(pos);
  let sumgray = RGBToGrayScale(sum);
  let sumweighted = 0;
  let halfLength = Math.floor(size/2);
  for(i = 1; i<=halfLength ;i++){
    let res = img.GetPixelRGB(new Vector2(pos.x, pos.y+i));
    sum.AddBy(res);
    sumgray += RGBToGrayScale(res);
    sumweighted += RGBToGrayScale(res)*i;
    res = img.GetPixelRGB(new Vector2(pos.x, pos.y-i));
    sum.AddBy(res);
    sumgray += RGBToGrayScale(res);
    sumweighted -= RGBToGrayScale(res)*i;
    count +=2;
  }
  sum.ScalarMultiplyBy(1/count);
  let weightedpos = 0;
  if(sumgray>0){
    weightedpos = sumweighted/sumgray;
  }
  return new Vector4(sum.x,sum.y,sum.z,weightedpos);
}

// Returns the average RGB of the column of pixels of length \size centered at \pos (pixels outside the image boundary are considered black)
const GetColumnRGBAvg = (img, pos, size) =>{
  let count = 1;
  let sum = img.GetPixelRGB(pos);
  let sumgray = RGBToGrayScale(sum);
  let sumweighted = 0;
  let halfLength = Math.floor(size/2);
  for(i = 1; i<=halfLength ;i++){
    let res = img.GetPixelRGB(new Vector2(pos.x+i, pos.y));
    sum.AddBy(res);
    sumgray += RGBToGrayScale(res);
    sumweighted += RGBToGrayScale(res)*i;
    res = img.GetPixelRGB(new Vector2(pos.x-i, pos.y));
    sum.AddBy(res);
    sumgray += RGBToGrayScale(res);
    sumweighted -= RGBToGrayScale(res)*i;
    count +=2;
  }
  sum.ScalarMultiplyBy(1/count);
  let weightedpos = 0;
  if(sumgray>0){
    weightedpos = sumweighted/sumgray;
  }
  return new Vector4(sum.x,sum.y,sum.z,weightedpos);
}
//#endregion

//A weighted linear regression in the square area with weight represented by the pixel color's Lightness.
const WeightedSLR = (img, pos, size) =>{
  let halfLength = Math.floor(size/2);
  let xyw = 0;
  let x2w = 0;
  let w = 0;
  let xw = 0;
  let yw = 0;
  let y2w = 0;
  let xywC = 0;
  let x2wC = 0;
  let y2wC = 0;
  let wC = 0;
  let xwC = 0;
  let ywC = 0; 
  let count = 0;
  let points = [];
  for(i=-halfLength ; i<=halfLength; i++){
    for (j = -halfLength; j<=halfLength;j++){
      if(i**2+j**2>halfLength**2){
        continue;
      }
      color = img.GetPixelRGB(new Vector2(pos.x-j, pos.y+i));
      weight = RGBToGrayScale(color);
      points.push(color);
      weightC = 1-weight;
      xyw += i*j*weight;
      x2w += (i**2)*weight;
      w += weight;
      xw += i*weight;
      yw += j*weight;
      y2w += (j**2)*weight;

      xywC += i*j*weightC;
      x2wC += (i**2)*weightC;
      y2wC += (j**2)*weightC;
      wC += weightC;
      xwC += i*weightC;
      ywC += j*weightC;

    }
  }
  let gradient = new Vector2(0,1);
  if(x2w*w-(xw)**2 != 0){
    let y = (xyw*w-xw*yw)/(x2w*w-(xw)**2);
    gradient = new Vector2(1,y);
  }
  gradient.Normalize();

  let gradientC = new Vector3(0,1);
  if(x2wC*wC-(xwC)**2 != 0){
    let yC = (xywC*wC-xwC*ywC)/(x2wC*wC-(xwC)**2);
    gradientC = new Vector2(1,yC);
  }
  gradientC.Normalize();

  let gradientR = new Vector2(1,0);
  if(  y2w*w-(yw)**2 != 0){
    let yR = (xyw*w-yw*xw)/(y2w*w-(yw)**2);
    gradientR = new Vector2(yR,1);
  }
  gradientR.Normalize();

  let gradientRC = new Vector3(0,1);
  if(y2wC*wC-(ywC)**2 != 0){
    let yRC = (xywC*wC-xwC*ywC)/(y2wC*wC-(ywC)**2);
    gradientRC = new Vector2(yRC,1);
  }
  gradientRC.Normalize();
  

    //    if(pos.x == 120 && pos.y == 300){

    //     console.log(gradientR);
    //  }
    let a,b;
    if(w>wC){
      a= gradient;
    }else{
      a= gradientC;
    }
    if(w>wC){
      b= gradientR;
    }else{
      b= gradientRC;
    }

    return Math.abs(xw)>Math.abs(yw)? b:a;

}

//#region Data Processing Functions
//A simple conversion from RGB to Gray-scale
const RGBToGrayScale = (col) =>{
  return (col.x+col.y+col.z)/3/255;
}


//Returns the expectation of the data: (\sum_{i} x_i)/n
const Avg = (arr) =>{
  if(arr.length == 0){
    return  0;
  }
  let sum =0;
  for(i = 0; i< arr.length; i++){
    sum += arr[i];
  }
  return sum/arr.length;
}

//Returns the covariance of the Vector2 array 1/n* \sum_{i} (x_i-\hat{x})(y_i-\hat{y})
const Covariance = (Vec2arr) =>{
  if(Vec2arr.length == 0){
    return 0;
  }
  let sumx = 0;
  let sumy = 0;
  Vec2arr.forEach(element => {
    sumx += element.x;
    sumy += element.y;
  });
  sumx /= Vec2arr.length;
  sumy /= Vec2arr.length;
  let sum=0;
  Vec2arr.forEach(element => {
    sum += (element.x-sumx)*(element.y-sumy);
  });
  return sum / Vec2arr.length;
}

//Returns the mean squared deviation of the data : 1/n * \sum_{i} (x_i-\hat{x})^2
const MSD = (arr) =>{
  if(arr.length == 0){
    return 0;
  }
  sum = 0;
  avg = Avg(arr);
  arr.forEach(element => {
    sum += (element-avg)**2;
  });
  return sum/arr.length;
}

//Returns the MSD of the array -halflength, -halflength+1,....,0,....,halflength-1,halflength
const FastMeanSquaredDeviation = (size) =>{
  let halfLength = Math.floor(size/2);
  return halfLength*(halfLength+1)/3;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

//#endregion

//-----------------------------------------------Control Panel----------------------------------------------------
//#region  Control Panel

const params = {
  cellSizeX : 20,
  cellSizeY : 20,
  refreshing : true,
  posJitter : 3,
  widthJitter : 3,
  angleJitter : 0.1,
  lengthJitter : 4,
  filterSize :101,
}


const createPane = () =>{
  const pane = new Tweakpane.Pane();
  let folder;
  
  folder = pane.addFolder({title:'Grid'});
  folder.addInput(params,'cellSizeX',{min:1, max:50, step:1});
  folder.addInput(params,'cellSizeY',{min:1, max:50, step:1});
  folder = pane.addFolder({title:'Randomization'});
  folder.addInput(params,'posJitter',{min:0, max:10, step:1});
  folder.addInput(params,'widthJitter',{min:0, max:10, step:1});
  folder.addInput(params,'angleJitter',{min:0, max:1});
  folder.addInput(params,'lengthJitter',{min:0, max:10,step:1});
  folder = pane.addFolder({title:'Randomization'});
  folder.addInput(params,'filterSize',{min:5, max:201,step:1});

  const btn = pane.addButton({
    title: 'Refresh',
  });
  btn.on('click', () => {
    manager.render();
  });
}

//#endregion

//---------------------------------------------------Main Process----------------------------------------------------------

//Preprocess the Image

prepareImage = () => {
  return new Promise((resolve, reject) => {
      const img = new Image();
      const colorImg = new Image();
      img.onload = () => {
        protoCanvas.width = img.width;
        protoCanvas.height = img.height;
        colorCanvas.width = colorImg.width;
        colorCanvas.height = colorImg.height;
        protoContext.drawImage(img, 0, 0);
        colorContext.drawImage(colorImg,0,0);
        settings.dimensions = [img.width-img.width%params.cellSizeX, img.height-img.height%params.cellSizeY];
        resolve();
      }
      img.onerror = reject;
      img.src = SrcContour;
      colorImg.src = SrcImage;
    }
  )
}

//The main drawing
const sketch = () => {
  return ({ context, width, height,frame }) => {

    const protoData = protoContext.getImageData(0, 0, protoCanvas.width, protoCanvas.height).data;
    const myImage = new MyImage(protoData,protoCanvas.width,protoCanvas.height);
    var cols = Math.floor(protoCanvas.width/params.cellSizeX);
    var rows = Math.floor(protoCanvas.height/params.cellSizeY);
    const colorData =  colorContext.getImageData(0, 0, width, height).data;
    // console.log(test);
    const indices = [];
    for (let i = 0; i <  rows* cols; i++) {
        indices.push(i);
    }
    shuffleArray(indices);
    for (let i = 0; i <  rows* cols; i++) {
      const col = indices[i] % cols;
      const row = Math.floor(indices[i] / cols);
      const x = col * params.cellSizeX+Math.floor(random.range(-params.posJitter,params.posJitter+1));
      const y = row * params.cellSizeY+Math.floor(random.range(-params.posJitter,params.posJitter+1));
      const r = colorData[(width*y+x)*4 + 0];
      const g = colorData[(width*y+x)*4 + 1];
      const b = colorData[(width*y+x)*4 + 2];

      context.fillStyle = `rgb(${r},${g},${b})`;
      context.strokeStyle = `rgb(${r},${g},${b})`;

      
      context.lineWidth = params.cellSizeX*1.5 +random.range(-params.widthJitter,params.widthJitter);
      context.save();
      context.translate(x, y);
      let pos = new Vector2(y,x);
      // To Debug a particular cell
      // if(pos.x == 120 && pos.y == 300){
      //   context.strokeStyle = 'blue';
      // }
      context.lineCap = "round";
      var gradient = GetLocalDirection(myImage,pos,params.filterSize);
      // console.log(gradient);
      let angle;
      if(gradient.x == 0 ){
        if(gradient.y == -1){
            angle = -Math.PI/2;
        }else{
          angle = Math.PI/2;
        }
      }else{

        angle = Math.atan(gradient.y/gradient.x);
        // if(pos.x == 120 && pos.y == 300){
        //   console.log(angle);
        // }
        if(gradient.x<0){
          angle += Math.PI;
        }
      }
      angle *= -1;
      angle += random.range(-params.angleJitter,params.angleJitter);
      // if(pos.x == 120 && pos.y == 300){
      //   console.log(angle);
      // }
      // context.rotate())
      // context.translate(params.cellSizeX * 0.5,params.cellSizeY*0.5);
      context.rotate(angle);
      // context.arc(0, 0, random.range(cellSizeX*0.7,cellSizeX * 1.1), 0,  Math.PI * 2);
      // context.fill();
      context.beginPath();
      context.moveTo(-params.cellSizeX*0.5+random.range(-params.lengthJitter,params.lengthJitter),0);
      context.lineTo(params.cellSizeX*0.5+random.range(-params.lengthJitter,params.lengthJitter), 0);
      context.stroke();
      context.restore();

    }
    
  };
};




var manager;
const start = async () => {
  const init = await prepareImage();
  manager = await canvasSketch(sketch, settings);
}

createPane();
start();