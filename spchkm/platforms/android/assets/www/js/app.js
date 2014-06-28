/* barcode scan  */
/* cordova plugin add https://github.com/wildabeast/BarcodeScanner.git */
function scan(){
	cordova.plugins.barcodeScanner.scan(
    function (result) {
    /*	alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);  */
        var barcode = result.text; 
        findsku(barcode); 
    },
    function (error) {
        alert("错误: " + error);
        return "";
    }
    );
}

$(document).ready(function(){	
	
	$("#refresh").click(function(){
		$("#errtips").html("<p>正在处理数据...</p>");
	    localFile();
	    localStorage.setItem("myfile",$("#myfile").val());
	    
	});
	$("#refresh2").click(function(){
		var url = $("#datafile").val();
		localStorage.setItem("datafile",url);
		var s = document.getElementById("checkbox-h-6a").checked;
		if (s == true) {
			$("#errtips").html("<p>正在下载数据...</p>");		
	    	var down = url + 'download';
	    	fromajax(down);
	    }
	    var up = url + "upload";
	    //盘点	
	    s = document.getElementById("checkbox-h-6b").checked;
		if (s == true) { 
			$("#errtips").html("<p>正在上传盘点数据...</p>");	
			postajax(up,pd_items,"pd.txt"); 
		}   
	    
	    //收货	    
	    s = document.getElementById("checkbox-h-6c").checked;
		if (s == true) { 
			$("#errtips").html("<p>正在上传收货数据...</p>");
			postajax(up,sh_items,"sh.txt"); 
		}   
	    
	   
	});
	$("#dl-pd").click(function(){
		$("#errtips").html("<p>正在处理数据...</p>");
		save2txt(this, 'pd.txt', pd_items);
	});
	$("#dl-sh").click(function(){
		$("#errtips").html("<p>正在处理数据...</p>");
		save2txt(this, 'sh.txt', sh_items);
	});
	
	$("#lookfor").click(function(){
		scan();
	});
	$("#find_sku").keydown(function(e){
		var barcode;
		if (e.keyCode == 13) {
			barcode = $("#find_sku").val();
			
			findsku(barcode);
	   	}
	}); 
	
	$("#find_sku").focus(function(){
		
		$("#find_sku").select();
	});
	/* 删除本地盘点或收货数据*/
	$("#ok").click(function(){
		if (func == "验码") {
			return false;
		}
		else if (func == "盘点") {
			localStorage.removeItem('pd'); //清空
			pd_items = [] ;
		}
		else {
			localStorage.removeItem('sh'); //清空
			sh_items = [] ;
		}
		//$("span[name=dat2]").html(pd_items.length); 
		//$("span[name=dat3]").html(sh_items.length); 
		$("#cancel").click();
	});
	/* 功能选择：盘点，收货，验码*/	
	$("input[name=radio-choice-h-2]").click(function(){
		func = $(this).val() ||"";
		$("span[name=fn]").html(func);
		$("#del").removeClass("ui-state-disabled");
		if (func == "验码") {
			$("#del").addClass("ui-state-disabled");				
		}
	});
	/* 数量确认 */
	$("#confirm").click(function() {
		var num = $("#number-2").val();
		var id = '1001';
		var barcode = $("#barcode").text();
		var items = [];
		var olditems;
		var key;
		
		if (!!barcode) {
		
			if (func == "盘点") {
				olditems = pd_items;
				key = "pd";
			}
			else {
				key = "sh";
				olditems = sh_items;
			}
			var found = false;
			for (var i = 0; i <  olditems.length; i++) {
				if (barcode == olditems[i].barcode) {
					olditems[i].num  =  parseFloat(olditems[i].num) + parseFloat(num);
					found = true;
					//alert(olditems[i].num);
					break;
				}
			}
			if (!found) {
				olditems.push( new pd(id,barcode,num) );
			}
			// save to localstorage
			localStorage.removeItem(key); //先清空
			localStorage.setItem(key , JSON.stringify(olditems) );
		}
		
		$("#ret2").click();
		
	});
	
	
});

$(document).on("pageshow","#main",function(){ // 当进入主界面时
	$("#dat1").html(sku_items.length); 
	$("span[name=dat2]").html(pd_items.length); 
	$("span[name=dat3]").html(sh_items.length); 
	$("#inhand").hide();  //暂时隐藏

});

$(document).on("pageshow","#two",function(){ // 当进入查找页面时
	$("span[name=fn]").html(func);
	if (func == "盘点"){
		$("#record").html(pd_items.length);
	}
	else if (func == "收货") {
		$("#record").html(sh_items.length);
	}
	else {
		$("#record").html("");
	}
	$("#find_sku").focus();

});

$(document).on("pageshow","#quantity",function(){ // 当进入数量录入时
	$("#number-2").val('1');
	//$("#number-2").focus();
	//$("#number-2").select();
});
