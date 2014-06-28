var datafile = '';
var currentPath = '/sdcard/';
var parentPath;

function errorHandler(e) {
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = '超出配额';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = '文件没找到';
      break;
    case FileError.SECURITY_ERR:
      msg = '安全错误';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = '无修改权限';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = '无效状态';
      break;
    default:
      msg = '错误';
      break;
  };
  msg = e.code+':'+ msg;
  //alert(msg);
  $("#errtips").html(msg);
}
/*
document.querySelector('#myfile').onchange = function(e) {
  var files = this.files;
  datafile = files[0].name;
  
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
    // Duplicate each file the user selected to the app's fs.
    for (var i = 0, file; file = files[i]; ++i) {

      // Capture current iteration's file in local scope for the getFile() callback.
      (function(f) {
        fs.root.getFile(file.name, {create: true, exclusive: false}, function(fileEntry) {
          fileEntry.createWriter(function(fileWriter) {
            fileWriter.write(f); // Note: write() can take a File or Blob object.
          }, errorHandler);
        }, errorHandler);
      })(file);

    }
  }, errorHandler);

};
*/
function localdir() {  
	var curdir = $("#myfile").val();
	if (!curdir) {
		curdir = 'spchkm/';
	}
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
    	function(fileSystem){   
        	//创建目录  
        	fileSystem.root.getDirectory(curdir, {create:true},   
        		function(fileEntry){}, errorHandler);    
        }, 
    	errorHandler);  
}  

function localFile() {  
	var curdir = $("#myfile").val();
	datafile = curdir + "goods.txt";  
	//$("#errtips").html('<progress>o(︶︿︶)o</progress>');
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
    	function(fileSystem){   
        	//创建目录  
        	fileSystem.root.getDirectory(curdir, {create:true},   
        		function(fileEntry){ 
        			fileSystem.root.getFile(datafile, null, gotReadFileEntry, errorHandler); ;  
        		}, errorHandler);    
        }, 
    	errorHandler);  
}  
    
function readFile() {  
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSForRead, errorHandler);  
    }  
function gotFSForRead(fileSystem) {
      fileSystem.root.getFile(datafile, null, gotReadFileEntry, errorHandler);  
    }  
function gotReadFileEntry(fileEntry) {  
      fileEntry.file(gotFileRead, errorHandler);  
    }  
function gotFileRead(file){  
      //readDataUrl(file);  
      readAsText(file);  
    }  
function readDataUrl(file) {  
      var reader = new FileReader();  
      reader.onloadend = function(evt) {  
      };  
      reader.readAsDataURL(file);  
    }  
function readAsText(file) {  
	$.mobile.loading( "show" );
    var reader = new FileReader();  
    reader.onprogress = function(e){
    	/*var total = e.total;
    	var loaded = e.loaded;
    	var progress = document.getElementById('progress');
    	progress.value = (loaded/total)*progress.max;
    	*/
   	}  
   	reader.onloadend = function(e){
    	var data = e.target.result;
        initdata(data);
        /*if(e.total!=0){
     		var progress = document.getElementById('progress');
     		progress.value = progress.max;
    	} */
    	$.mobile.loading( "hide" );
    }
    reader.readAsText(file,'GBK');  //默认是utf-8，我的文件是gbk（gb2312)
    }  
/* 写文件*/
function writeToFile(filename,content) {  
	var curdir = $("#myfile").val();
	if (!curdir) {
		curdir = 'spchkm/';
	}
	datafile = curdir + filename;
	$.mobile.loading( "show" );
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
    	function(fileSystem) {  
    		fileSystem.root.getFile(datafile, {create: true, exclusive: false}, 
    			function(fileEntry) {  
      				fileEntry.createWriter( 
      					function(writer) {  
     						writer.seek(0);  
     						writer.write(content);  
     						writer.onwriteend = function(evt){  
       							$.mobile.loading( "hide" ); 
       							$("#errtips").html("<p>"+filename+"导出完成！</p>");
     						} 
     					}, errorHandler);  
    			} , errorHandler);  
    	}, errorHandler);  
    
    }  
/*
function gotFSForWrite(fileSystem) {  
      fileSystem.root.getFile(datafile, {create: true, exclusive: false}, gotWriteFileEntry, errorHandler);  
    }  
function gotWriteFileEntry(fileEntry) {  
      fileEntry.createWriter(gotFileWriter, errorHandler);  
    }  
function gotFileWriter(writer) {  
     var userText = $('#userInput').val();  
     writer.seek(0);  
     writer.write('\n\n' + userText);  
     writer.onwriteend = function(evt){  
       alert("You wrote ' " + userText + " ' at the end of the file.");  
     }   
     
    }  
*/    
/* 文件上传*/    
function uploadFile(fileURI,targetUrl) {  
    var options = new FileUploadOptions();  
    options.fileKey = "file";  
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);  
    options.mimeType = "multipart/form-data";  
    options.chunkedMode = false;  
    
    var ft = new FileTransfer();  
    var uploadUrl=encodeURI(targetUrl);  
    alert(datafile);
    ft.upload(fileURI,uploadUrl,
    	function(){ alert('上传成功!');},   
        function(){ alert('上传失败!');},  
    	options);  
}  
/* 文件下载*/
function downloadFile(sourceUrl,targetUrl){  
    var ft = new FileTransfer();   
    var uri = encodeURI(sourceUrl);    
  
    fileTransfer.download(  
        uri,targetUrl,
        function(entry){   
            alert(entry.fullPath + '下载成功!');  
        },
        function(error){  
            alert("下载网络图片出现错误");  
        });    
}  
    
/* 文件目录列表  */    
function getFilesList(entries) {  
	//var dirlist = [];
	//var filelist = [];
	var li_dirs='',li_files='';
	
	var showPath = "当前位置是：" + currentPath.substring(currentPath.indexOf(':') + 3);  
	//加入上一级项目  
    if (currentPath != 'file:///mnt/sdcard') {  
    	//dirlist.push('..上一级'); 
    	li_dirs = '<li data-icon="bullets"><a href="#">'+'..上一级'+'</a></li>';
    }  
    //entry objects include: isFile, isDirectory, name, fullPath
    for (var i = 0; i < entries.length; i++) { 
    	fileName = entries[i].name; 
    	//文件夹显示  
        if (entries[i].isDirectory) {  
        	//dirlist.push( fileName ); 
        	li_dirs = li_dirs + '<li><a href="#">'+fileName+'</a></li>';
        }  
        else {  
        	fileType = fileName.substring(fileName.lastIndexOf('.') + 1);  
            //txt文件才显示  
            if (fileType == "txt") {  
                //filelist.push(fileName) ;
                li_files = li_files +'<li data-icon="false"><a href="#">'+fileName+'</a></li>';
            }  
        } 
    }
    var s = '<ul data-role="listview" data-inset="true">';
    s = s + '<p>'+showPath + '</p>';
    s = s + li_dirs+li_files;
    s = s + '</ul>';
    
    $("#filelist").html(s);
}  

//
$(document).on("pageshow","#dirlist",function(){ 
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
    	fileSystem = fs;  
    	currentPath = fileSystem.root.fullPath; 
    	//alert(currentPath);
    	currentPathName = currentPath.substring(currentPath.lastIndexOf('/') + 1); 
    	dirReader = fileSystem.root.createReader();  
    	dirReader.readEntries(getFilesList, errorHandler);  
  	}, errorHandler);
  
});
 

/* 选择 */
function selecteditem(item) {  
    if (item == "..上一级") {  
        parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));  
        parentName = parentPath.substring(parentPath.lastIndexOf('/') + 1);  
        parentEntry = new DirectoryEntry(parentName, parentPath);  
        currentPath = parentPath;  
        dirReader = parentEntry.createReader();  
        dirReader.readEntries(getFilesList, errorHandler);  
    }  
    else {  
        parentEntry = new DirectoryEntry(item, currentPath + '/' + item);  
        fileType = item.substring(item.lastIndexOf('.') + 1);  
        if (parentEntry.isDirectory && fileType != "txt") {  
            currentPath = currentPath + '/' + item;  
            dirReader = parentEntry.createReader();  
            dirReader.readEntries(getFilesList, errorHandler);   
        }  
        //如果是txt文件  
        else {  
        	//window.plugins.message.Toast(onSuccess, onError, fileType);  
            txtPath = currentPath.substring(currentPath.indexOf(':') + 3);  
            txtPath = txtPath + '/' + item;  
            //window.plugins.pdfView.showPdf(onSuccess, errorHandler, pdfPath);  
        }  
    }
}  