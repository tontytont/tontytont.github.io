// Draw Worm
// Ported from flash demo - https://wonderfl.net/c/9os2
//

var colors = ['#000','#fff'];
var tmp = parseInt(Math.floor((Math.random()*2)));
var color = colors[tmp];
$(".intro").css('background-color','#000');
$(".intro h1").css('color','#fff');
if(color==='#fff'){
    $(".lineart").css('background-color','#000'); 
    $(".intro").css('background-color','#fff');
    $(".intro h1").css('color','#000');
}
$( ".intro" ).on( "click", function() {
	if(color==='#fff'){
    		$(".lineart").css('background-color','#fff');
		    $(".intro").css('background-color','#000');
		    $(".intro h1").css('color','#fff');
    		color='#000';
		}
		else if(color==='#000'){
    		$(".lineart").css('background-color','#000');
		    $(".intro").css('background-color','#fff');
		    $(".intro h1").css('color','#000');
    		color='#fff';
		}
});
function DrawWorm(){
  
  var canvas;
  var context;

  var width;
  var height;
	
	var mouse = {x: window.innerWidth/2, y:  0};
  this.mouse = mouse;
		
	var interval;
	
	var vms = [];
	
	var MAX_NUM = 100;
	var N = 100;
	
	var px = window.innerWidth/2;
	var py = 0;
		
	this.initialize = function(){
		canvas  = document.getElementById("canvas");
		context = canvas.getContext('2d');
			
		width = window.innerWidth;
		height = window.innerHeight;
		
		canvas.width = width;
		canvas.height = height*5;
		
		canvas.addEventListener('touchmove', TouchMove, false);
		canvas.addEventListener('mousemove', MouseMove, false);
		canvas.addEventListener('click', MouseDown, false);
		
		//Set interval - Bad! - I know!
		var interval = setInterval(Draw, 10);
		
	}
	
	var Draw = function(){
		
		var len = vms.length;
		var i;
		
		//fadeScreen();
		
		for (i = 0; i < len; i++){
			
			var o = vms[i];
			
			if (o.count < N){
				DrawWorm(o);
				o.count++;				
			//This looks a tad hacky - modifying the loop from within :S
			} else {
				len--;
				vms.splice(i, 1);
				i--;
			}	
		}
		
		Check();
	}
	
	//Takes a worm (obj) param
	var DrawWorm = function (obj){

		if (Math.random() > 0.9){
			obj.tmt.rotate(-obj.r * 2);
			obj.r *= -1;
		}
		
		//Prepend is just concat -- right?

		obj.vmt.prependMatrix(obj.tmt);
			
		var cc1x = -obj.w * obj.vmt.c + obj.vmt.tx;
		var cc1y = -obj.w * obj.vmt.d + obj.vmt.ty;
		
		var pp1x = (obj.c1x + cc1x) / 2;
		var pp1y = (obj.c1y + cc1y) / 2;
		
		var cc2x = obj.w * obj.vmt.c + obj.vmt.tx;
		var cc2y = obj.w * obj.vmt.d + obj.vmt.ty;
		
		var pp2x = (obj.c2x + cc2x) / 2;
		var pp2y = (obj.c2y + cc2y) / 2;
		
		context.fillStyle = color;
		context.strokeStyle = color;
		context.beginPath();

		context.moveTo(obj.p1x , obj.p1y);
		context.quadraticCurveTo(obj.c1x, obj.c1y, pp1x, pp1y);
		
   		context.lineTo(pp2x, pp2y);
   		
   		context.quadraticCurveTo(obj.c2x, obj.c2y, obj.p2x, obj.p2y);
   		
   		//context.stroke();
		context.closePath();
		context.fill();	
		
	
	    obj.c1x = cc1x;
        obj.c1y = cc1y;
        obj.p1x = pp1x;
        obj.p1y = pp1y;
        obj.c2x = cc2x;
        obj.c2y = cc2y;
        obj.p2x = pp2x;
        obj.p2y = pp2y;
	}
	
	var Check = function(){
		
		var x0 = mouse.x;
		var y0 = mouse.y;
		
		var vx = x0 - px;
		var vy = y0 - py;	
		
		var len = Math.min(Magnitude(vx, vy), 50);
		
		if (len < 10){
			return;
		}
		
		var matrix = new Matrix2D();		
	
		matrix.rotate((Math.atan2(vy, vx)));
		
		matrix.translate(x0, y0);
			
		createWorm(matrix, len);
		
		context.beginPath(); 
		context.strokeStyle = color;
   		context.moveTo(px, py);
   		context.lineTo(x0, y0);
   		context.stroke();
   		context.closePath();
   		
   		px = x0;
   		py = y0;
   	
		//More logic here for afterwards?
	}
	
	var createWorm = function(mtx, len){
				
		var angle = Math.random() * (Math.PI/6 - Math.PI/64) + Math.PI/64;
		
		if(Math.random() > 0.5){
			angle *= -1;		
		}
		

		var tmt = new Matrix2D();	
		tmt.scale(0.95, 0.95);
		tmt.rotate(angle);			
		tmt.translate(len, 0);
		
		var w = 0.5;

		 var obj = new Worm();
 		
		 obj.c1x = (-w * mtx.c + mtx.tx);
		 obj.p1x = (-w * mtx.c + mtx.tx);
		 	
		 obj.c1y = (-w * mtx.d + mtx.ty);
		 obj.p1y = (-w * mtx.d + mtx.ty);	
		 	
		 obj.c2x = (w * mtx.c + mtx.tx);
		 obj.p2x = (w * mtx.c + mtx.tx);	
		 	 
		 obj.c2y = (w * mtx.d + mtx.ty);
		 obj.p2y = (w * mtx.d + mtx.ty); 
	 	 
		 obj.vmt = mtx;
		 obj.tmt = tmt;
 		
		 obj.r = angle;
		 obj.w = len/20;
		 obj.count = 0;
 		
		 vms.push(obj);
		
		if (vms.length > MAX_NUM){
			vms.shift();
		}
	}
	
	//Not sure why they do this kinda thing in flash.
	var Worm = function(){	
		this.c1x = null;
		this.c1y = null;
		this.c2x = null;
		this.c2y = null;
		this.p1x = null;
		this.p1y = null;
		this.p2x = null;
		this.p2y = null;
		
		this.w = null;
		this.r = null;
		
		this.count = null;
		this.vmt = null;
		this.tmt = null;
		
	}
	
	var fadeScreen = function(){
		context.fillStyle = 'rgba(255, 255, 255, 0.02)';
		context.beginPath();
		context.rect(0, 0, width, height);
		context.closePath();
		context.fill();	
	}
	
	//Clear the screen, 
	var MouseDown = function(e) {
		e.preventDefault();
		canvas.width = canvas.width;
		if(color==='#fff'){
    		$(".lineart").css('background-color','#fff');
		    $(".intro").css('background-color','#000');
		    $(".intro h1").css('color','#fff');
    		color='#000';
		}
		else if(color==='#000'){
    		$(".lineart").css('background-color','#000');
		    $(".intro").css('background-color','#fff');
		    $(".intro h1").css('color','#000');
    		color='#fff';
		}

		vms = [];
	}
	
	var MouseMove = function(e) {
        //mouse.x = e.layerX - canvas.offsetLeft;
        mouse.y = e.layerY - canvas.offsetTop;
	}
	
	var TouchMove = function(e) {
		e.preventDefault();
    	//mouse.x = e.targetTouches[0].pageX - canvas.offsetLeft;
    	//mouse.y = e.targetTouches[0].pageY - canvas.offsetTop;
	}
	
	//Returns Magnitude
	var Magnitude = function(x, y){
		return Math.sqrt((x * x) + (y * y));
	}
			
}
    
//Hacked up matrix, borrowed from easel.js -- thanks grant!
//
// -- If you are forking this, then you will want to play with the code above this line.
// -- Unless you are totally nuts!
//
(function(window) {


var Matrix2D = function(a, b, c, d, tx, ty) {
  this.initialize(a, b, c, d, tx, ty);
}
var p = Matrix2D.prototype;

// static public properties:

	Matrix2D.identity = null; // set at bottom of class definition.

	Matrix2D.DEG_TO_RAD = Math.PI/180;


	p.a = 1;

	p.b = 0;

	p.c = 0;

	p.d = 1;

	p.tx = 0;

	p.ty = 0;

	p.alpha = 1;

	p.shadow  = null;

	p.compositeOperation  = null;

	p.initialize = function(a, b, c, d, tx, ty) {
		if (a != null) { this.a = a; }
		this.b = b || 0;
		this.c = c || 0;
		if (d != null) { this.d = d; }
		this.tx = tx || 0;
		this.ty = ty || 0;
	}

	p.prepend = function(a, b, c, d, tx, ty) {
		var n11 = a * this.a + b * this.c;
		var n12 = a * this.b + b * this.d;
		var n21 = c * this.a + d * this.c; 
		var n22 = c * this.b + d * this.d;
		var n31 = tx * this.a + ty * this.c + this.tx; 
		var n32 = tx * this.b + ty * this.d + this.ty;
			
		this.a  = n11;
		this.b  = n12;
		this.c  = n21;
		this.d  = n22;
		this.tx = n31;
		this.ty = n32;
	}

	p.append = function(a, b, c, d, tx, ty) {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;

		this.a  = a*a1+b*c1;
		this.b  = a*b1+b*d1;
		this.c  = c*a1+d*c1;
		this.d  = c*b1+d*d1;
		this.tx = tx*a1+ty*c1+this.tx;
		this.ty = tx*b1+ty*d1+this.ty;
		
	}

	p.prependMatrix = function(matrix) {
		this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		this.prependProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
	}

	p.appendMatrix = function(matrix) {
		this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		this.appendProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
	}

	p.prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		if (rotation%360) {
			var r = rotation*Matrix2D.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (regX || regY) {
			// append the registration offset:
			this.tx -= regX; this.ty -= regY;
		}
		if (skewX || skewY) {
			// TODO: can this be combined into a single prepend operation?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
			this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
		} else {
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}

	}

	p.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		if (rotation%360 == 0 && scaleX == 1 && scaleY == 1 && skewX == 0 && skewY == 0) {
			this.tx += x-regX;
			this.ty += y-regY;
			return;
		}

		if (rotation%360) {
			var r = rotation*Matrix2D.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (skewX || skewY) {
			// TODO: can this be combined into a single append?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
		} else {
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}

		if (regX || regY) {
			// prepend the registration offset:
			this.tx -= regX*this.a+regY*this.c;
			this.ty -= regX*this.b+regY*this.d;
		}
	}

	p.rotate = function(angle) {
		 var sin = Math.sin(angle);
         var cos = Math.cos(angle);
         var n11 = cos * this.a + sin * this.c;
         var n12 = cos * this.b + sin * this.d;
         var n21 = -sin * this.a + cos * this.c;
         var n22 = -sin * this.b + cos * this.d;
	     this.a  = n11; 
	     this.b  = n12;
         this.c  = n21;
         this.d  = n22;
	}

	p.skew = function(skewX, skewY) {
		skewX = skewX*Matrix2D.DEG_TO_RAD;
		skewY = skewY*Matrix2D.DEG_TO_RAD;
		this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
	}

	p.scale = function(x, y) {
		this.a *= x/1;
		this.d *= y/1;
		this.tx *= x/10;
		this.ty *= y/10;
	}

	p.translate = function(x, y) {
		this.tx += x;
		this.ty += y;
	}

	p.identity = function() {
		this.alpha = this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		this.shadow = this.compositeOperation = null;
	}

	p.invert = function() {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		var tx1 = this.tx;
		var n = a1*d1-b1*c1;

		this.a = d1/n;
		this.b = -b1/n;
		this.c = -c1/n;
		this.d = a1/n;
		this.tx = (c1*this.ty-d1*tx1)/n;
		this.ty = -(a1*this.ty-b1*tx1)/n;
	}

	p.isIdentity = function() {
		return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
	}

	p.decompose = function(target) {
		// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation
		// even when scale is negative
		if (target == null) { target = {}; }
		target.x = this.tx;
		target.y = this.ty;
		target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
		target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

		var skewX = Math.atan2(-this.c, this.d);
		var skewY = Math.atan2(this.b, this.a);

		if (skewX == skewY) {
			target.rotation = skewY/Matrix2D.DEG_TO_RAD;
			if (this.a < 0 && this.d >= 0) {
				target.rotation += (target.rotation <= 0) ? 180 : -180;
			}
			target.skewX = target.skewY = 0;
		} else {
			target.skewX = skewX/Matrix2D.DEG_TO_RAD;
			target.skewY = skewY/Matrix2D.DEG_TO_RAD;
		}
		return target;
	}

	p.reinitialize = function(a,b,c,d,tx,ty,alpha,shadow,compositeOperation) {
		this.initialize(a,b,c,d,tx,ty);
		this.alpha = alpha || 1;
		this.shadow = shadow;
		this.compositeOperation = compositeOperation;
		return this;
	}

	p.appendProperties = function(alpha, shadow, compositeOperation) {
		this.alpha *= alpha;
		this.shadow = shadow || this.shadow;
		this.compositeOperation = compositeOperation || this.compositeOperation;
	}

	p.prependProperties = function(alpha, shadow, compositeOperation) {
		this.alpha *= alpha;
		this.shadow = this.shadow || shadow;
		this.compositeOperation = this.compositeOperation || compositeOperation;
	}

	p.clone = function() {
		var mtx = new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
		mtx.shadow = this.shadow;
		mtx.alpha = this.alpha;
		mtx.compositeOperation = this.compositeOperation;
		return mtx;
	}


	p.toString = function() {
		return "[Matrix2D (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]";
	}

	// this has to be populated after the class is defined:
	Matrix2D.identity = new Matrix2D(1, 0, 0, 1, 0, 0);

window.Matrix2D = Matrix2D;
}(window));    

var app, interval, count;

function demoApp() {
  count++;
  if (count % 2 == 0){
	  app.mouse.y -= 40    
      } else {
       app.mouse.y += 40; 
      }

  if (count > 30) {
   window.clearInterval( interval );
  }
}

setTimeout( function() {
  app = new DrawWorm();
  app.initialize();
  count = 0;
}, 10);