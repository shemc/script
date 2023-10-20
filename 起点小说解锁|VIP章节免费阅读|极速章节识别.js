// ==UserScript==
// @name         起点小说解锁|VIP章节免费阅读|极速章节识别
// @version      1.3.4
// @description  可解锁起点小说VIP付费章节。基本还原付费效果，无需设置即可阅读。
// @author       JiGuang
// @namespace    www.xyde.net.cn
// @homepageURL  http://www.xyde.net.cn
// @match        https://www.qidian.com/chapter/*
// @match        https://read.qidian.com/chapter/*
// @match        *://book.zongheng.com/chapter/*/*.html
// @require https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require https://cdn.staticfile.org/jquery/2.0.3/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant GM_registerMenuCommand
// @connect
// @license MIT
// ==/UserScript==
 
(function() {
  'use strict';
    //全局配置
     //获取cookie值
    var index = getCookie("choice");
    var times = getCookie("times");
    var csrfToken = getCookie("_csrfToken");
    if(index==null){index=0}
    if(times==null){times=0}
    var config = {
        //配置版本号
        version:1,
        //支持的书源地址：
        //步骤1
        webSites :
        ["https://souxs.leeyegy.com/search.aspx?key=",
         "http://www.dushuge.com/hsdgiohsdigohsog.php?ie=gbk&q=",
         "https://www.disixs.com/search.php?keyword=",
         "https://so.biqusoso.com/s2.php?ie=utf-8&siteid=qu-la.com&q=",
         "http://www.b5200.net/modules/article/search.php?searchkey=",
         "http://www.siluke.cc/search.html?name=",
         "https://69shu.net/s.php="
        ],
        //跳转网址：用于修正脚本读取章节地址自动把起点前缀拼接起来
        //步骤1
        webGo: ['https://quapp.shenbabao.com/book/','http://www.dushuge.com','https://www.disixs.com','https://www.qu-la.com','http://www.b5200.net/','http://www.siluke.cc','https://69shu.net/'],
        //网页内容：F12查看页面元素 找到章节文字所在的标签id
        webContent:["",'#content','#content','#txt','#content','#content',"novelcontent"],
        //书源描述
        webDesc:["参八宝","读书阁","58小说网","官术网","书趣阁","思路客","69书吧"],
        //正在使用的书源
        webSiteIndex : index,
        //搜索前缀:
        //步骤2：查看书源网站搜索关键字后跳转地址 并替换
        webSearch : ["&page=1&siteid=app2",'','','','',''],
        //搜索方法 : 目前没有特别大的作用
        webMethod :["GET","GET","GET","POST","POST","GET"],
        //使用序列: 不同书源的获取章节目录的标签选择不同
        //步骤5：0 代表第一个字符串
        webReturn:[0,2,0,1,0,0],
        //书源类型:0代表网页书源，1代表api请求书源
        webType:[1,0,0,0,0,0,0],
        //具体章节网址替换
        webHref:[0,0,0,0,1,0,0],
        //book：不同书源的获取作品名的标签选择不同
        //步骤3:去书源网站搜索页面查找标签并替换
        webBook:["",
                 "h4.bookname > a",
                 "a.result-game-item-title-link",
                 "a",
                 ".odd > a",
                 ".s2 > a"],
          //author
        //步骤3:去书源网站搜索页面查找标签并替换
        webAuthor:["",
                   "div.author",
                   "div.result-game-item-info > p:nth-child(1) > span:nth-child(2)",
                   "span.s4",
                   ".odd",
                   ".s4 > a"]
    }
    //注册的菜单和对应执行的函数
    var menus = [
    {
        name:'打开设置',
        event:openSetting
    },
    ]
 
    //增加cookie缓存
     function setCookie(cName,value,datetime){
    var oDate = new Date();
    if(datetime==0){datetime=1* 24 * 60 * 60 * 1000}
    oDate.setTime(oDate.getTime() + datetime);//设置过期时间
    var cookieString =cName + value + ";expires='" + oDate.toGMTString() + ";path=/";
    document.cookie = cookieString;//存cookie
    }
 
    //获取指定名称的cookie的值
    function getCookie(cName){
        var arrStr = document.cookie.split("; ");
        for (var i = 0; i < arrStr.length; i++) {
            var temp = arrStr[i].split("=");
            if (temp[0] == cName){
                return decodeURI(temp[1]);
            }
        }
    }
 
    //增加菜单
    function addMenu(){
        for(var menu of menus){
        GM_registerMenuCommand(menu.name, menu.event)
    }
    }
 
    //添加新书源
    function openSetting(){
        try{
            document.querySelector("#j_navSettingBtn > a").click()
        }catch(e){
            notify('打开设置失败','warning')
        }
    }
 
 
    //把更换书源增加到设置菜单
    function hookSetting(){
        let bookhtml = ``
        for(var di in config.webDesc){
          bookhtml += `<option value="${di}">${config.webDesc[di]}</option>`
        }
        if(!document.querySelector(".setting-list-wrap")){
            setTimeout(hookSetting,1000)
            return
        }
        let e = document.createElement("div")
        e.innerHTML = `<li class="remind" style="margin-top:10px;">
<i>书源切换</i>
<select id="select" style="position:relative;top:5px">
<option value="#">请选择要切换的书源</option>
${bookhtml}
</select>
</li>`
        document.querySelector(".setting-list-wrap").firstElementChild.appendChild(e)
        document.querySelector("#select").onchange = function(){
            var index=document.querySelector("#select").value
            setCookie("choice=",index,0)
            location.reload()
        }
        //打开评论
         document.querySelector("#j-sectionCommentBtn").onclick =function(){
             var state = document.querySelector("#j-sectionCommentSwitch").innerHTML
             if(state=="关闭"){
                 // $("body").addClass("section-comment-open")
                $("html").addClass=("j-sectionCommentLimit")
                $("#j_chapterBox > div > div").removeClass("j-sectionCommentLimit")
             }
             else{
               //  $("body").removeClass("section-comment-open")
                $("#j-readPage").removeClass("j-sectionCommentLimit")
                $("#j_chapterBox > div > div").removeClass("j-sectionCommentLimit")
                // $("#paragraph-review-app").css("display","none")
             }
         }
    }
    //自动加载本章说
   async function comment(){
      $("#j-readPage").removeClass("j-sectionCommentLimit")
      $("#j_chapterBox > div > div").removeClass("j-sectionCommentLimit")
    }
 
    //提示用户
    function notify(title = '操作成功',type = 'success',show = true){
        console.log(title)
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        if(show)
        Toast.fire({
            icon: type,
            title: title
        })
        return Toast
    }
 
    //获取章节名
    function QDgetBookChapter(){
      if(document.querySelector("div > div.text-head > h3 > span.content-wrap")){
        let res = '' + document.querySelector("div > div.text-head > h3 > span.content-wrap").innerText
        res = res.replace(' ','')
        return res
      }
      return undefined
    }
 
    //获取书本名
    function QDgetBookName(){
      return document.querySelector("#bookImg").innerText
    }
 
    //本章是否已被购买
    function QDgetChapterOrder() {
        // @ts-ignore
        return document.querySelector("a.admire.lang.j_admireBtn")
    }
 
    //设置页面阅读内容
 async  function QDsetContent(content){
   // console.log(content)
      const regs =/<br>[\s]{0,1}<br>/g
    //  console.log(regs.test(content))
      content=content.replace(regs, "<br><br>　　")
       let int = 1;
       while (true) {
       let key = `<span class="review-count" data-segid="${int++}" style=" cursor: pointer; "></span>`;
       content = content.replace("<br><br>", key);
       content = content.replace("</p><p>", key);
       if(content.indexOf("<br><br>") == "-1" && content.indexOf("</p><p>") == "-1") break;
       }
      var fir ='<p data-type="2">'
      content =fir +content
      var reg = RegExp("　　", "g");
      content = content.replace(reg, '</p><p data-type="2">');
      document.querySelector("div > div.read-content.j_readContent ").innerHTML = content
      let readQrcodeMobile = document.querySelector("#readQrcodeMobile")
      let cid = readQrcodeMobile.dataset.cid
     let bid = readQrcodeMobile.dataset.bid
     const res = await parseDocFromAjax("GET",`https://read.qidian.com/ajax/chapterReview/reviewSummary?_csrfToken=${csrfToken}&&bookId=${bid}&&chapterId=${cid}`,true)
     console.log(res)
       res.list.map(item => {
            const span = document.querySelector(`span[data-segid="${item.segmentId}"]`)
            span ? span.innerHTML = item.reviewNum+"<i><cite></cite></i>" : ""
        })
      document.getElementsByClassName('read-content')[0].setAttribute('style',`line-height: 1.5;letter-spacing: 1px`)
    const removeSpan = document.querySelectorAll("span[data-segid")
    removeSpan.forEach(item => {
    if(item.innerText == '' || item.innerText == 0) item.remove()
    })
    console.log("移除成功")
}
 
    //将请求的url的html内容转化成document对象
    async function parseDocFromAjax(method,url,flag){
      return new Promise((resolve,reject) => {
          GM_xmlhttpRequest({
              method,
              url:url,
              onload:(res) => {
                  if(config.webType[config.webSiteIndex] == 1 || flag){
                   let str = res.response
               // console.log(str)
                    str=str.replace(/\\r\\n　　\\r\\n　　/g, "<br><br>　　&nbsp;&nbsp;&nbsp;&nbsp;")
                    str=str.replace(/\\r\\n　　/g, "<br><br>　　&nbsp;&nbsp;&nbsp;&nbsp;")
                   let arr = eval('(' + str + ')')
                   const {data}=arr
                  console.log(data)
                   return resolve(data)
                  }
                  let htmldoc = document.createElement('html')
                  let htmlstr = res.responseText
                  htmlstr=htmlstr.replace(/http /g, "https")
                  htmlstr=htmlstr.replace(/img src/g, "a url")
                  htmlstr=htmlstr.replace(/onerror/g, "class")
              //  console.log(htmlstr)
                  htmldoc.innerHTML = htmlstr
                  console.log(url)
                  resolve(htmldoc)
              },
              onerror:(err) => {
                  reject(err)
              }
          })
      })
    }
 
 
 
    //搜索小说并返回结果
    async function searchBook(keywords){
      const r = await parseDocFromAjax(config.webMethod[config.webSiteIndex],config.webSites[config.webSiteIndex]+keywords +config.webSearch[config.webSiteIndex] )
      let resList = []
       if(config.webType[config.webSiteIndex] == 1){
           r.map(item =>{
                resList.push({id:item.Id,bookName:item.Name,author:item.Author,url:config.webGo[config.webSiteIndex] +item.Id+"/"})
               //console.log(item)
           })
           //console.log(resList[0])
           return resList
       }
      var bookList = r.querySelectorAll(config.webBook[config.webSiteIndex])
      const authorList = r.querySelectorAll(config.webAuthor[config.webSiteIndex])
      for(let i in bookList){
            if(bookList[i].title){
                resList.push({bookName:bookList[i].title,author:authorList[i].innerText,url:config.webGo[config.webSiteIndex] + bookList[i].pathname})
            }
            resList.push({bookName:bookList[i].innerText,author:authorList[i].innerText,url:config.webGo[config.webSiteIndex] + bookList[i].pathname})
      }
       // console.log(resList)
      return resList
    }
 
    //获取小说目录
    async function getChapterList(book){
      let resList = []
      let bookUrl = book.url.replace('https://read.qidian.com/',config.webGo[config.webSiteIndex])
      const r = await parseDocFromAjax('GET',bookUrl)
        if(config.webType[config.webSiteIndex] == 1){
           // console.log(r)
             r.list.map(item => {
                 item.list.map(i => {
               resList.push({title:i.name,url:config.webGo[config.webSiteIndex]+book.id+"/"+i.id+".html"})
            })
        })
           // console.log(resList);
            return resList
        }
      let s=["#list > dl > dd > a","ul.cf > li > a","div.listmain > dl > dd > a"]
      //步骤4：如书源目录标签不相同 此处添加后再在webReturn修改对应数字
      const cateList = r.querySelectorAll(s[config.webReturn[config.webSiteIndex]])
      console.log("cateList:",cateList)
      for(let i of cateList){
       // console.log( i)
        let url = i.getAttribute("href")
        if(config.webHref[config.webSiteIndex] == 1){
           // console.log("Ok")
           //  bookUrl = bookUrl.substring(0, bookUrl.lastIndexOf("/")+1)
            config.webGo[config.webSiteIndex] = ''
           }
        url =config.webGo[config.webSiteIndex] +url
        resList.push({title:i.innerText,url:url})
      }
      return resList
    }
 
    //获取章节内容
    async function getContent(pageUrl){
      const res = await parseDocFromAjax('GET',pageUrl)
      if(config.webType[config.webSiteIndex] == 1){
          let title = res.cname.replace(" ",'' )
          if(res.content.indexOf(title) == -1) return res.content
          title = title +'<br><br>　　'
         res.content= res.content.replace(title,'')
        //console.log('getContent:',res.content)
          return res.content
      }
      return res.querySelector(config.webContent[config.webSiteIndex]).innerHTML
    }
 
 
    //解析书源函数
    async function parseMain(){
 
      //搜索小说名字
      var r = await searchBook(QDgetBookName())
      var a = g_data.bookInfo.authorName
      let ii = 0
      //优先匹配名字相同的
      for(let suoyin in r){
        if(r[suoyin].bookName == QDgetBookName()||r[suoyin].author==a){
          ii = suoyin
            break;
        }
      }
      if(r[ii] == undefined){
          console.log("搜索作者")
        r = await searchBook(a)
        for(let suoyin in r){
          if(r[suoyin].bookName == QDgetBookName()){
                 ii = suoyin
                 break;
              }
          }
      }
      //获取第一项结果章节目录
      if(r[ii] == undefined){
        console.log('该小说暂无资源')
      }
     //  console.log(r[ii])
      const clist = await getChapterList(r[ii])
      if(QDgetBookChapter() == undefined || clist.length == 0){
        console.log('抓取目录失败')
      }
      console.log('抓取目录成功')
    // console.log(clist)
      //获取章节名
      for(let i in clist){
        let tit = '' + clist[i].title
        let str = tit
        tit = tit.replace(' ','')
        //console.log('匹配',tit,QDgetBookChapter())
          var patt1 =/[a-zA-Z\u4e00-\u9fa5]+/g
          var patt2 =/[0-9]+/g
          str = QDgetBookChapter()
          var flag=false
          //排除纯数字章节的影响
          if(tit.match(patt1)==null){
              tit = tit.match(patt2)
              str = str.match(patt2)
          }
        else if(str.match(patt1)==null){
              str = str.match(patt2)
              tit = tit.match(patt2)==null?tit.match(patt1):tit.match(patt2)
          }
          else{
              str = str.match(patt1)
              tit = tit.match(patt1)
              //有些作者喜欢加第几卷第几章 但是书源网站没有卷名
              var str2 =str.join("").split(/卷|章/)
              var tit2 =tit.join("").split(/卷|章/)
              //模糊读取，若无法精准匹配 尝试模糊名匹配 并设置缓存默认以此方法匹配，默认是2分钟
              console.log(times)
              if(times>=4&times<11){
                  //自带数字章节名 首个字符串与书源匹配
                  if(str[0]==tit[0]){
                    flag=true
                    setCookie("times=",times,1*1000*60*2)//这里修改2可以改缓存时间
                  }
              }
             else if(times>=11&times<17){
                 //末尾名匹配
                   if(str2[str2.length-1]==tit2[tit2.length-1]){
                       flag=true
                       setCookie("times=",times,1*1000*60*2)
                   }
                 }
             else if(times>=17){
                 //中间名匹配
                if(str2[str2.length-2]==tit2[tit2.length-2]){
                    flag=true
                    setCookie("times=",times,1*1000*60*2)
                  }
              }
          }
       //  console.log(str[0],tit[0])
        if(str.join("")==tit.join("")||flag==true){
          console.log('检查到结果')
          const content = await getContent(clist[i].url)
          QDsetContent(content)
          console.log('写入成功')
          notify('小说读取成功')
          return
        }
      }
        times++
         setCookie("times=",times,1*1000*60*2)
         console.log('目录匹配失败')
      notify('未查询到该小说内容','warning')
      throw new Error('该书源解析失败')
    }
 
    //递归更换书源
    async function mergeOne(index){
            try{
                if(index){
                    config.webSiteIndex = index
                    console.log(index)
                }
                notify(`正在切换到书源${config.webDesc[config.webSiteIndex]}...`,'info')
                await parseMain()
            }catch(e){
                console.log(e)
                config.webSiteIndex = (config.webSiteIndex + 1) % 6
                mergeOne()
            }
        }
    //MAIN-BEFORE 主程序预备函数
    if(QDgetChapterOrder()!=null){
       notify(`已订阅章节`)
    }else{
     addMenu()
    //MAIN 主程序
    notify(`您正在阅读${QDgetBookName()}的${QDgetBookChapter()}`)
    mergeOne()
    comment()
    hookSetting()
    }

        // Your code here...
})();
