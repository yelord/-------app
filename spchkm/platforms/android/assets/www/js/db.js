	var func="盘点";
	var sku_items =[];
	var pd_items =[];	
	var sh_items = [];
	// sku class
	function sku(record) {
	    //sku,barcode,skuname,skuprice,stock
		this.sku = $.trim(record[0]) ||""; 
		this.name = $.trim(record[2]) ||'';
		this.barcode = $.trim(record[1]) ||'';
		this.price = $.trim(record[3]) || "";
		this.num = $.trim(record[4]);
	};
	//pd & sh class
	function pd(id,barcode,num) {
		this.id = $.trim(id);
		this.barcode = $.trim(barcode);
		this.num = $.trim(num);
	};
	
	//load data to items[]
	function loaddata(){
		var data1 = localStorage.getItem("infor_sku") || "";
		var data2 = localStorage.getItem("pd") || "";
		var data3 = localStorage.getItem("sh") || "";
		if (!!data1) { sku_items = JSON.parse(data1); }
		if (!!data2) { pd_items = JSON.parse(data2); }
		if (!!data3) { sh_items = JSON.parse(data3); }
		$("#datafile").val( localStorage.getItem("datafile") ||"http://123.123.123.250:5000/");
		$("#myfile").val( localStorage.getItem("myfile") ||"spchkm/");
		
	};
	
	
	function initdata(data) {
		//loading:
		//$.mobile.loading( "show" );
		var items = data.split('\r\n');
		
		var length = items.length;
		            
		sku_items = [];
		var n = 0;
		for (var i = 0; i <  length; i++) {
		    var item = items[i].split(',');
		    if (item.length < 5) { continue;}
		    //0:sku,1:barcode,2:name,3:price,4:num 
		    
			if (!!$.trim(item[1]) ) {
		        sku_items[n] = new sku(item);
		        n = n + 1;
			}
		}      
		// save to localstorage
		localStorage.removeItem('infor_sku'); //先清空
		localStorage.setItem("infor_sku" , JSON.stringify(sku_items) );
		//tips
		//$.mobile.loading( "hide" );
		$("#dat1").html(sku_items.length);
		
		$("#errtips").html("<p><font color=red>"+sku_items.length+"条数据处理完成！</font></p>");
		//window.location.href="#errtips"; 
	};
	
	/* 生成盘点、收货数据内容*/
	function createcontent(items) {
		var length = items.length;
		var item;
		if (length == 0){
			$("#errtips").html("没有可导出数据!");
			//alert("没有可导出数据!");
			return '';
		}
		var content=[];
		for (var i = 0; i <  length; i++) {
			item = items[i];
			content.push(item.id+','+item.barcode+','+item.num);
		}
		return content;
	}
	/* saveas text pd or sh */
	//window.location.href="data:application/octet-stream;filename=rk.txt,文件内容aaa";
	function save2txt(a, filename, items) {
		var content = createcontent(items);
		var dat = '';
		for (var i = 0; i < content.length; i++) {
			dat = dat + content[i]+'\r\n';
		}
    /*    var contentType =  'data:application/octet-stream,';
        var uriContent = contentType + encodeURIComponent(content);
        a.setAttribute('href', uriContent);
        a.setAttribute('download', filename); 
        */
        if (!!dat) {
        	writeToFile(filename,dat);
        }
    }
    /* ajax 获取服务器上的数据 同步(async: false)，不异步*/
	function fromajax(url) {
		var s;
		$.ajax({
			url: url,
			async: false,
			cache: false,
			timeout:30000,
		/*	contentType:'application/x-www-form-urlencoded; charset=UTF-8',
			beforeSend: function(XMLHttpRequest){
				$("#progress").html("<progress />");
			},  
			complete: function(XMLHttpRequest, textStatus){
				$("#progress").html('结束！');
			}, */
			success: function(data){
				data = JSON.parse(data);
				initdata(data);
				s = sku_items.length+"记录同步完成！";
				$("#errtips").html(s);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				//alert( "同步发生错误" +textStatus + ':'+errorThrown);
				s = "<p>"+"同步发生错误" +textStatus + ':'+errorThrown+"</p>";
				$("#errtips").html(s);
			}
		})    
	/*	htmlobj=$.ajax({url:url,async:false});
  		$("#errtips").html(htmlobj.responseText);
	*/	
	}
	/* ajax 发送数据到服务器上 同步(async: false)，不异步*/
	function postajax(url,items,filename) {
		var s;
		var content = JSON.stringify( createcontent(items) );
		if (!content) {return;}
		var dat = '?filename='+filename+'&data='+ content;
		
		$.ajax({
			type: "POST",
			url: url + dat,
			async: false,
		/*	data: JSON.stringify(dat),   */
			timeout:30000,
			contentType:'application/x-www-form-urlencoded; charset=UTF-8',
			success: function(data){
				s = "记录发送完成！";
				$("#errtips").html(s);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				//alert( "同步发生错误" +textStatus + ':'+errorThrown);
				s = "<p>"+"同步发生错误" +textStatus + ':'+errorThrown+"</p>";
				$("#errtips").html(s);
			}
		})    
	}
	//search barcode
	function findsku(barcode){
		var sku,name,price;
		var found = false;
		
		if (!barcode) {return;}
		
		$("#find_sku").val('');
		
		for (var i = 0; i < sku_items.length && !found ; i++) {
			if (sku_items[i].barcode == barcode) {
				name =  sku_items[i].name;
				sku = sku_items[i].sku;
				price = sku_items[i].price;
				found = true;
				
			}
		}
		
		$("#showdemo").html("");
		if (found) {
			$("#sku").html(sku);
			$("#skuname").html(name);
			$("#barcode").html(barcode);
			$("#price").html(price);
			$("#tips").html("<p>请扫码...</p>");
			$("#number-2").val('1');
			
			if (func == "验码") {
				$("#showdemo").html($("#skuinfo").html() );
			}
			else {
				$("#link2").click();
			}
			//window.location.href="#quantity";
			
		}
		else {
			$("#tips").html("<p>"+barcode+":未找到</p>");
		}
		
	};

	/* 初始化数据*/
	loaddata();
	//创建工作路径
	localdir();
