
(function($)
{
	$.fn.js_flow_control = function(options){ 

		var cls = null;
		this.each(function(e)
		{ 
			//initialize the class
			cls = new j();
		});
		return cls;
	}

	//set up the class
	var j = (function()
		{
			function j()//constructor
			{
				this.blockAnim();
				var $this = this;
				var v = new Slider();
				v.flow_list_wrap();

				//Chart rendering section
				var pqc = parseFloat($(".graph_caption").attr("id"));
				v.renderDoughnutChart(parseInt(pqc.toFixed(0)), 'donut_single');

				//render the line chart
				v.renderLineChart();
								
			}
			j.prototype.blockAnim = function()
			{
				$("button.sbmt").removeClass("animated");
				$(".sbmt").removeClass("animated, hidden, fadeInUp");
				$("body").find(".nxt, .prv, .sbmt").removeClass("animated")
			}
		
//###########################################################################################################################

		//return class object
		return j;

	}());

	function Super()
    {
        this.name = "";
        this.wrapper = ".flow_list_wrap";
        this.resRelease = function()
        {
        	var $this = this;
        	$(window).on("load", function()
			{
				var p = $("body").find($this.wrapper);
				if(p.size() != 0){
					p.fadeIn("fast");
				}
			})
        }
        this.regexp = function(data)
        {
        	return data.replace(/[^-\d\.]/g, '');
        }
        this.renderLineChart = function()
        {
        		google.charts.load('current', {'packages':['corechart']});

		      	google.charts.setOnLoadCallback(drawChart);

		      	function drawChart() {
		        var data = google.visualization.arrayToDataTable([
		          ['Year', 'C1', 'C2'],
		          ['Q1',  1000,   400],//SA - Strongly Agree
		          ['Q2',  1170,   460],//AG - Agree
		          ['Q3',  345,   1120],//NDA - Neither Disagree or Agree
		          ['Q4',  2,      540],//DG - Disagree
		          ['Q5',  0,      340],//SD - Strongly Disagree
		          ['Q6',  500,    400],//SA - Strongly Agree
		          ['Q7',  0,      460],//AG - Agree
		          ['Q8',  0,     1120],//NDA - Neither Disagree or Agree
		          ['Q9',  0,      540],//DG - Disagree
		          ['Q10', 0,   	  340],//SD - Strongly Disagree
		          ['Q11', 0,   	  400],//SA - Strongly Agree
		          ['Q12', 0,   	  460],//AG - Agree
		          ['Q13', 0,   	 1120],//NDA - Neither Disagree or Agree
		          ['Q14', 0,   	  540],//DG - Disagree
		          ['Q15', 0,      340]//SD - Strongly Disagree
		        ]);

		        var options = {
		          title: 'Compliance Flow',
		          curveType: 'function',
		          legend: { position: 'bottom' }
		        };

		        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

		        chart.draw(data, options);
		      }

        }
        this.renderDoughnutChart = function(int_value, dom)
        {
        	var total = int_value;
        	var params = [
		          ['Effort', 'Amount given'],
		          ['Attempted',    total],
		        ]

        	if(int_value < 100 )
        	{        		

        		var total = (100 - int_value);

        		var params = [
		          ['Effort', 'Amount given'],
		          ['Attempted',     int_value],
		          ['Remainder',     total],
		        ]
        	}

        	google.charts.load('current', {'packages':['corechart']});
		      google.charts.setOnLoadCallback(drawChart);

		      function drawChart() {

		        var data = google.visualization.arrayToDataTable(params);

		        var options = {
		          pieHole: 0.5,
		          pieSliceTextStyle: {
		            color: 'black',
		          },
		          legend: 'none'
		        };

		        var chart = new google.visualization.PieChart(document.getElementById(dom));
		        chart.draw(data, options);
		      }

        }

    }

    function Slider()
    {
        Super.call(this);
        Slider.prototype = Object.create(Super.prototype);
            Slider.prototype.constructor = Slider;

        this.row = ".flow_listview";
        this.item = ".flow_list_item";
        this.w = $.getWidth($(this.wrapper));
        this.h = $.getHeight($(this.wrapper));
        

        this.flow_list_wrap = function()
		{
			this.resRelease();

			// make it's overflow hidden 
			//set the width of the list row here
			this.flow_list_row();

			//set width of the item list
        	this.flow_list_item(this.w);

			// for on window resize
			var $this = this;
			$(window).resize(function()
			{
				$this.w = $.getWidth($($this.wrapper));
        		$this.h = $.getHeight($($this.wrapper));
        		
        		//reset row back to 0
        		$($this.row).find($this.item).removeClass("active");
        		$($this.row).find($this.item+":first").addClass("active");
        		$($this.row).css({marginLeft:"0px"});

        		//set the width of the list row here
				$this.flow_list_row();

        		//reset width of the item list
        		$this.flow_list_item($this.w);
			});

			//init control function
			this.flow_list_row_control();
			
		}

		this.flow_list_row = function()
		{
			var p = $(this.wrapper), im = p.find(this.item).size();
			var e = parseFloat(this.w) * im;
			$(this.row).css({width:e.toFixed(2)+"px"});
		}

		this.flow_list_item = function(w){

			var r = $(this.item);
			r.css({float:"left"});
			r.css({width:w+"px"});
		}

		this.flow_list_row_control = function()
		{
			var $this = this;
			//get the first item on the list and add class active to it
			$(this.row).find(this.item+":first").addClass("active");

			$(".btn").on("click touchstart", function()
			{
				if($(this).hasClass("nxt")){ $this.animateNext(); }
				if($(this).hasClass("prv")){ $this.animatePrev(); }
				if($(this).hasClass("csbmt")){ $this.cbtnControlResources($(this)); 
				}else{
					if($(this).hasClass("sbmt")){ $this.btnControlResources($(this)); }
				}

			});
		}
		this.animateNext = function()
		{			
			var a = $(".active"), id = a.next().attr("id"), mv = this.w, qcounts = parseInt(id)+1;
			if(id <= $(this.row).find(this.item).size()-1){	
				this.pushSlide(id, mv, 70);
				this.resetActive(a, id, true);
				$(".qcounts").html(qcounts);
			}

			if(id >= $(this.row).find(this.item).size()-1){
				$(".nxt").css({display:"none"});
				$("button.sbmt").css({display:"block"}).removeClass("animated").removeClass("hidden");
			}else{
				$(".prv").css({display:"block"});
			}
		}

		this.animatePrev = function()
		{
			var a = $(".active"), id = a.prev().attr("id"), mv = this.w, qcounts = parseInt(id)+1;
			if(id >= 0){	
				this.pushSlide(id, mv, 70);
				this.resetActive(a, id, false);
				$(".qcounts").html(qcounts);
			}

			if(id > 0){
				$(".nxt").css({display:"block"});
				$(".sbmt").css({display:"none"});
			}else{
				$(".prv").css({display:"none"});
			}
		}

		this.cbtnControlResources = function(e)
		{
			var $this = this, assess_id = $(this.wrapper).attr("id");
			var res = this.packData();

			var url = $.path(), data = {"res":res,"assess_id":assess_id};
			var res = $.getValues(data, url+"rpi/course_rpi", e, "POST");
			res.done(function(json){

				if(json != "" && json != null)
				{
					var json = $.parseJSON(json);
					$this.rsps($(".rs-ta"), json.s, json.m);
					if(json.s == 1){
						document.location.href = url+"cmp/course_completion/"+json.rlink;
					}
				}
			});
			res.fail(function(){
				//add code here
			});

		}

		this.btnControlResources = function(e)
		{
			var $this = this, assess_id = $(this.wrapper).attr("id");
			var res = this.packData();
			var url = $.path(), data = {"res":res,"assess_id":assess_id};
			var res = $.getValues(data, url+"rpi/assess_rpi", e, "POST");
			res.done(function(json){
				if(json != "" && json != null)
				{
					var json = $.parseJSON(json);
					$this.rsps($(".rs-ta"), json.s, json.m);
					if(json.s == 1){
						document.location.href = url+"imp/assessment_completion";
					}
				}
			});
			res.fail(function(){
				//add code here
			});

		}

		this.rsps = function(dom, status, message)
		{			
			var html = "";
			switch(status)
			{
				case 0: html = "<span style=\"color:red\">"+message+"</span>"; break;
				case 1: html = "<span style=\"color:green\">"+message+"</span>"; break;
				default: html = "<span style=\"color:blue\">"+message+"</span>";
			}

			dom.html(html);
			setTimeout(function(){ dom.html(""); }, 2000)
		}

		this.packData = function()
		{
			var pack = $(this.row).find(this.item), data = new Array();
			pack.each(function(k, v)
			{
				var qid = $(this).find("input:nth-child(1)").val();				
				var qoptid = $(this).find("input[type=radio]:checked").val()
				var dv = {"qid":qid, "qoptid":qoptid}
				data.push(dv);
			});

			return data;
		}

		this.pushSlide = function(n, w, v)
		{
			var moveByDis = (n*w);
			$(this.row).animate({marginLeft:-moveByDis+'px'}, v);	
		}

		this.resetActive = function(a, id, b)
		{			
			var aclass = "active"; a.removeClass(aclass);
			if(b){
				a.next().addClass(aclass);
			}else{
				a.prev().addClass(aclass);
			}
		}

    }


})
(jQuery)

//Multi-Phase Ajax Request
jQuery.extend({alertx:".alertx",isNumeric:function(value){ return /^\d+$/.test(value);},path:function(){var url=$("body").attr("id");return	url;},fgetv:function(fid,key,name){var d=0,f=$(fid).find(key);f.each(function(){if($(this).val()==""){d++;}});return d;},fget:function(formid,key,name,allowempty){var d={},f=$(formid).find(key);f.each(function(){var k=$(this).attr(name),v=$(this).val();if(allowempty){d[k]=v;}else{if($(this).val()!=""){d[k]=v;}}});return d;},getValues:function(data,url_,dom,method){var result=null;return $.ajax({url:url_,data:data,type:method,async:true,beforeSend:$.onSend});},onSend:function(){},onComplete:function(){ },parseJson:function(data){var jsonString=$.parseJSON(data);return jsonString;},notice:function(dom, msg){dom.html(msg).fadeIn("fast");setTimeout(function(){	dom.html(msg).fadeOut("fast");}, 5000);},getWidth:function(dom){return dom.width();},getHeight:function(dom){ return dom.height(); },setWidth:function(dom, v){ dom.css({width:v+"px"}); },setHeight:function(dom, h){ dom.css({height:h+"px"}); } });
