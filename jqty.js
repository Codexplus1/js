(function($)
{
	$.fn.jQty = function(options){ 
		var q = null;
		this.each(function(e){ 
			//initialize the class
			q = new qy();
		});
		return q;
	}

//set up the class
	var qy = (function()
		{
			function qy()//constructor
			{
				this.evts();
			}

			qy.prototype.res = ".res";
			qy.prototype.st = ".st span"; // this is the sub total class
			qy.prototype.p = ".jqty";// this is the parent class
	        qy.prototype.evts = function()
	        {
	            var $this = this;
	            $("td.bn").on('click touchstart', function(e)
	            {
	                if($(this).hasClass("minus"))
	                {
	                    $this.decrement($(this));
	                }

	                if($(this).hasClass("plus"))
	                {
	                    $this.increment($(this));
	                }
	                $this.runSubTotalUpdate();
	            });
	        }
	        qy.prototype.process = function(e)
	        {
	        	var q = parseInt($(this.res).text());	
	        	var p = parseFloat(e.parents(this.p).find(".p span").text());
	        	var r = q * p;
	        	$(this.st).html(r.toFixed(2));		
	        }
	        qy.prototype.increment = function(e)
	        {
	            var r = parseInt(e.siblings(this.res).find("span").text());	            
	            var q = r+= 1;	            
	            e.siblings(this.res).find("span").html(q);
	            this.process(e);// calculate the results
	        }
	        qy.prototype.decrement = function(e)
	        {
	        	var r = parseInt(e.siblings(this.res).find("span").text());	            
	            if(r > 1){
	            	var q = r-= 1;	            
	            	e.siblings(this.res).find("span").html(q);
	            	this.process(e);// calculate the results
	        	}
	        }
	        qy.prototype.runSubTotalUpdate = function()
	        {
	        	var $this = this;
	        	if($("body").find("#cartlist").size() !=0)
	        	{
	        		var ps = $("body").find(this.p), r = 0;

	        		ps.each(function()
	        		{
	        			var qty = $(this).find($this.res), q = qty.find("span").text();
	        			var pc = $(this).find(".p span").text();
	        			r += (parseInt(q) * parseFloat(pc))//multiply the result and sum in a variable        			
	        		});
	        		$(".subtotalx span").html(r.toFixed(2))//update the subtotal
	        	}
	        }
			//return class object
			return qy;

		}());

})(jQuery)

$(function(){
	$("body").jQty();
});