批处理定时任务

@echo off
set INTERVAL=600
:Again
echo start server
cd /d C:\Users\Adminstrator\.AutoSignMachine
del /s /q C:\Users\Adminstrator\.AutoSignMachine\*.*
cd /d D:\azmodan-clmp
node index.js unicom --tryrun --tasks dailysignin,winterTwo,dxIntegralEveryDay,dailygamebox,dailylotteryintegral,dailycomment,dailywoTree,dailyBookRead,dailyBookLuckdraw,dailyLiuLan,dailyVideoFreeGoods,dailyGrabdollPage,jflottery,jflotteryad,dailyYYY,dailyVideoScratchcard,dailyLKMH,dailyYYQ,bcow,dailyVideo,dailylottery,gameYearBox,producGameSignin,dailygameflow,dailygameIntegral,todayDailyTask,dailyCourse,ingots,threeSquirrels,freeDownFloorAd,dailyBaWangcard,book5video,dailyFingerqd,dailyFingerqd2,taocan,dailyTurncards,fapiao,fetchCoins
timeout %INTERVAL%
goto Again 

或者

@echo off
set INTERVAL=600
:Again
echo start server
cd /d C:\Users\Adminstrator\.AutoSignMachine
del /s /q C:\Users\Adminstrator\.AutoSignMachine\*.*
time 22：30
cd /d D:\azmodan-clmp
node index.js unicom --tryrun --tasks dailygameflow
timeout %INTERVAL%
goto Again 

或者

@echo off
set INTERVAL=900
:Again
echo start server
cd /d D:\asm
node index.js unicom --user 1766512968 --password 86525 --appid 07ec93c65ce5c412a7bbb29dd8bbda3621efe286bf55ea6073946d17177569c481b4b834ab48a1d8f6ce7847de6c90f1
timeout %INTERVAL%
goto Again
