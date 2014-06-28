# --*-- coding:utf-8 --*---

from flask import Flask
from flask import request,url_for
import json  

app = Flask(__name__)

@app.route('/')
def index():
	try:
		txt = open('readme.txt').readlines()
		str = '<p>'+ '</p><p>'.join(txt)
		txt = str.decode("gbk")
		txt = txt+'</p>'
	except:
		txt = ""
	appfile = url_for('static',filename='spchkm.apk')
	return u"""
    	<br /><h1>欢迎使用智能机盘点！</h1>
    	<br /><br />
    	%s
    	<br /><br />
    	<p><a href="%s">下载手机端APP</a></p>
    	<br /> <p>&nbsp;<img src="static/logo28.png" /></p>
    	<p>By <a href="mailto:yelord@qq.com">yelord.</a></p>
    	"""%(txt,appfile)

@app.route('/upload', methods=['GET', 'POST'])
def upload_txt():
    if request.method == 'POST':
        fn = request.args.get('filename', 'null')
        dat = request.args.get('data', 'null')
        print fn
        #print dat
        content = json.loads(dat)
        print content
        open("data/"+fn,"w").write('\r\n'.join(content))
        
    return "ok"
    
@app.route('/download', methods=['GET', 'POST'])
def download_txt():
    #return open('data/goods.txt').read() 
    return json.dumps( open('data/goods.txt').read().decode('GBK') ,ensure_ascii=False )
    
    
if __name__ == '__main__':
    print u"========================================="
    print u"   本服务为手机盘点程序制作的简易后台服务"
    print ""
    print u"   *****  by yelord@qq.com  *******"
    print ""
    print u"         !!! 不要关闭此窗口 !!!"
    print ""
    print u"     如果程序挂掉请重新运行此服务"
    print u"========================================="
    print u"启动web服务..."
    app.run(host='0.0.0.0')
