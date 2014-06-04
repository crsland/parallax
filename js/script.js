

$(document).ready(function(){

	var windowHeight = window.innerHeight;
	var windowWidth = window.innerWidth;
	
	// image versions
	var imagePaths = {
		first  : {high : 'images/bg1a.jpg', low : 'images/bg1a_low.jpg'},
		second : {high : 'images/bg2b.jpg', low : 'images/bg2b_low.jpg'},
		third  : {high : 'images/bg3a.jpg', low : 'images/bg3a_low.jpg'},
		fourth : {high : 'images/bg4b.jpg', low : 'images/bg4b_low.jpg'},
		fifth  : {high : 'images/bg3b.jpg', low : 'images/bg3b_low.jpg'}
	};
	
	var images = {};
	
	var previousFrame = null;
	
	function _realToggleClass(elem, classa,classb){

		var classToAdd = (elem.is('.'+classa)) ? classb : classa;

		return elem.removeClass().addClass(classToAdd);
	};

	/**
	* @frame type: JQuery Object // First level element
	* Nombre de la clase es igual al id del elemento y la clase que recibe cuando está en el viewport,
	* se le agrega "className"+"ToViewPort"
	*/
	function doAnimation(frame){
			
		var elemsToAnimate = $('[data-action="animate"]',frame);

		if(elemsToAnimate.length){
			$.each(elemsToAnimate,function(i,val){
				// Toggle Classes
				_realToggleClass($(val),val.id,val.id+'ToViewPort');
			});
		}
	};
	
	
	function loadImages(){
		//1° Load all Images
		for(var i in imagePaths){
			images[i] = {
				low : new Image(),
				high: new Image()
			};
			images[i].low.src = imagePaths[i].low;
			images[i].high.src = imagePaths[i].high;
		}
	};
	loadImages();
	
	/**
	* Scale Low resolution Images to fix in the viewport
	*/
	function renderBackgroundImage(sibling){
		// get image container size
		var bgImg = images[sibling.attr('id')];

		var bgImgWidth = bgImg.low.width , bgImgHeight = bgImg.low.height;
		
		
		var scale = Math.max( windowHeight/bgImgHeight , windowWidth/bgImgWidth );
		var width = scale * bgImgWidth , height = scale * bgImgHeight;
		var left = (windowWidth-width)/2, top = (windowHeight-height)/2;

		var transform = 'translate('+[-bgImgWidth/2,-bgImgHeight/2].join('px,')+'px) scale('+scale+') translate('+[windowWidth/2/scale,windowHeight/2/scale].join('px,')+'px)';
		sibling
			.width(bgImgWidth).height(bgImgHeight)
			.css({
				'-webkit-transform':transform,
				'-moz-transform':transform,
				'-o-transform':transform,
				'-ms-transform':transform
			})
			  .css({'position':'fixed', top: 0, left: 0});
	}	
	
	
	/**
	* By default the background images are in low resolution
	* 
	*/
	function toggleImages(currentFrame){

		var background = "url(" + imagePaths[currentFrame.attr('id')].high +") 0 0 no-repeat";
		currentFrame.css({background : background});
		// Get siblings and set the low resolution image for them
		$.each(currentFrame.siblings(),function(index, sibling){
			//renderBackgroundImage($(sibling));
			$(sibling).css({
				background : "url("+ imagePaths[sibling.id].low +") 0 0 no-repeat"
			});
		});
	}
	
	
	$('#header li a').click(function(e){

		var pos_class = this.href.substring(this.href.indexOf("#")+1);
		$('#sections-holder').removeClass().addClass(pos_class);
		
		// currentFrame also represent who is in viewport
		var currentFrame = $("#"+ pos_class);
		
		if(previousFrame != currentFrame){
			// Set state On to the current frame. Animate it.
			doAnimation(currentFrame);
			
			if(previousFrame != null){
				// Set state Off to the hidden frame
				doAnimation(previousFrame);
			}
			
			// Replace images for the correspondat version.
			window.setTimeout(function(){
				toggleImages(currentFrame)
			},1500);

			previousFrame = currentFrame;
		}
		return false;
	});
	window.onload = function(){
		document.querySelector('#header ul li a').click();
	}
	//$('#first').trigger('click');
	
});