# -*- coding: utf8 -*-
# import json
import re
import time

import requests
from random import randint
from utils import jsonencode as json
from utils.toutiao_reward import TouTiao
from utils.unicomLogin import UnicomClient


class SigninApp(UnicomClient):
    """
        联通日常签到
    """

    def __init__(self, mobile, password):
        super(SigninApp, self).__init__(mobile, password)
        self.session.headers = requests.structures.CaseInsensitiveDict({
            "accept": "application/json, text/plain, */*",
            "origin": "https://img.client.10010.com",
            "user-agent": self.useragent,
            "content-type": "application/x-www-form-urlencoded",
            "referer": "https://img.client.10010.com/SigininApp/index.html",
            "x-requested-with": "com.sinovatech.unicom.ui"
        })
        self.hasDouble = False
        self.toutiao = TouTiao(mobile)
        self.message = ''

    def listTaskInfo(self):
        url = 'https://act.10010.com/SigninApp/convert/listTaskInfo'
        resp = self.session.post(url=url)
        result = resp.json()
        print(json.dumps(result, indent=4, ensure_ascii=False))
        paramsList = result['data']['paramsList']
        self.message += "[气泡任务]\n"
        for item in paramsList:
            self.message += f'{item["prizeName"]}: {"已完成" if int(item["accomplish"]) else "未完成"}\n'
        return paramsList

    def doTask(self, item, orderId):
        url = 'https://act.10010.com/SigninApp/task/doTask'
        data = {
            "markId": item['markId'],
            "orderId": orderId,
            "prizeType": item['prizeType'],
        }
        resp = self.session.post(url=url, data=data)
        print(resp.json())

    def getIntegral(self):
        url = 'https://act.10010.com/SigninApp/signin/getIntegral'
        resp = self.session.post(url=url)
        print(resp.json())

    def getContinuous(self):
        url = 'https://act.10010.com/SigninApp/signin/getContinuous'
        resp = self.session.post(url=url)
        result = resp.json()
        print(json.dumps(result, indent=4, ensure_ascii=False))
        data = result['data']  # ['daySignList']
        doubleBtn = data['doubleBtn']
        self.message += '[签到任务]\n'
        if int(doubleBtn['click']) == 1:
            self.hasDouble = True
            self.message += '红包翻倍: 未翻倍\n'
        else:
            self.message += '红包翻倍: 已翻倍\n'
        if int(data['todaySigned']) == 0:
            print("今日已签到")
            self.message += '每日签到: 已签到\n'
            return True
        self.message += '每日签到: 未签到\n'

    def getGoldTotal(self):
        url = 'https://act.10010.com/SigninApp/signin/getGoldTotal'
        resp = self.session.post(url=url)
        print(resp.json())

    def signIn(self):
        url = 'https://act.10010.com/SigninApp/signin/daySign'
        resp = self.session.post(url=url)
        resp.encoding = 'utf8'
        data = resp.json()
        print(json.dumps(data, indent=4, ensure_ascii=False))

    def bannerAdPlayingLogo(self, orderId):
        # signin
        url = 'https://act.10010.com/SigninApp/task/bannerAdPlayingLogo'
        data = {
            "orderId": orderId
        }
        resp = self.session.post(url=url, data=data)
        print(json.dumps(resp.json(), indent=4, ensure_ascii=False))

    def recordLog(self, log):
        record = self.readCookie(f'{self.mobile}SigninAppRecord')
        if not record:
            record = {}
        if len(record) > 30:
            k = list(record.keys())[0]
            record.pop(k)
        record[self.now_date] = log
        self.saveCookie(f'{self.mobile}SigninAppRecord', record)


    def Dingxiang100(self):
        # data = {
        #     'from': random.choice('123456789') + ''.join(random.choice('0123456789') for i in range(10))
        # }
        try:
            data = 'from=98880000020'
            integral = self.session.post('https://m.client.10010.com/welfare-mall-front/mobile/integral/gettheintegral/v1',
                                     data=data)
            integral.encoding = 'utf-8'
            res = integral.json()
            print(res)
            print("100定向积分: " + res['msg'] )
            time.sleep(3)
        except Exception as e:
            print('【100定向积分】: 错误，原因为: ' + str(e))


    def Dongao(self):
        # data = {
        #     'from': random.choice('123456789') + ''.join(random.choice('0123456789') for i in range(10))
        # }
        trance = [600, 300, 300, 300, 300, 300, 300]
        try:
            # 领取积分奖励
            data = {"from": ""}
            dongaoPoint = self.session.post(
                'https://winolympic.10010.com/welfare-mall-front/mobile/winterTwo/getIntegral/v1',
                 data=json.dumps(data))
            dongaoPoint.encoding = 'utf-8'
            res1 = dongaoPoint.json()
            print(res1)
            time.sleep(1)
            # 查询领了多少积分
            dongaoNum = self.session.post('https://m.client.10010.com/welfare-mall-front/mobile/winterTwo/winterTwoShop/v1',
                                      data=data)
            dongaoNum.encoding = 'utf-8'
            res2 = dongaoNum.json()
            print(res2)
            # 领取成功
            if res1['resdata']['code'] == '0000':
                # 当前为连续签到的第几天
                day = int(res2['resdata']['signDays'])
                # 签到得到的积分

                point = trance[day % 7] + 300 if day == 1 else trance[day % 7]
                print('东奥积分活动: ' + res1['resdata']['desc'] + '，' + str(point) + '积分')
            else:
                print('东奥积分活动: ' + res1['resdata']['desc'] + '，' + res2['resdata']['desc'])
            time.sleep(3)
        except Exception as e:

            print('东奥积分活动: 错误，原因为: ' + str(e))

    # 沃钱包
    def wallet(self):
        try:
            if_wallet =True

            if if_wallet == False:
                print("沃钱包：该帐号设置为不执行")
            else:
                timestamp = int(time.time())
                # url = f'https://u.10010.cn/qAPHI?version=iphone_c@8.0802&desmobile={self.mobile}&yw_code=&time={timestamp}'
                # res = requests.get(url=url, headers=self.headers, allow_redirects=False)
                # location = res.headers['Location']
                # print(location)
                # 获取ticket
                url = f'https://m.client.10010.com/mobileService/openPlatform/openPlatLineNew.htm?to_url=https://epay.10010.com/partyServer/clockIn/index.html?channel=stsy&channelType=null&duanlianjieabc=qAPHI&desmobile={self.mobile}&yw_code=&version=iphone_c@8.0802&time={timestamp}'
                res = self.session.get(url=url,  allow_redirects=False)
                location = res.headers['Location']
                ticket = re.findall('ticket=(.*?)&', location)[0]
                # 登录
                url = 'https://epay.10010.com/partyServer/login/changeTicket.do'
                data = f'activityId=TTLXJ20210330&bizFrom=stsy&ticket={ticket}&type=02&channelType=null'
                res = self.session.post(url=url, data=json.dumps(data)).json()
                print(res)
                wap_sessionid = res['wap_sessionid']
                if res['returnCode'] == '0':
                    # 登录成功 开始签到
                    url = 'https://epay.10010.com/partyServer/ttlxj/unifyDraw.do'
                    import datetime
                    if datetime.datetime.now().isoweekday() == 7:
                        data = f'loginId={self.mobile}&activityId=TTLXJ20210330&wap_sessionID={wap_sessionid}&version=3.0.0&bizFrom=stsy&channelType=null&markerName=ttlxj&validatorId=1&drawType=C'
                    else:
                        data = f'loginId={self.mobile}&activityId=TTLXJ20210330&wap_sessionID={wap_sessionid}&version=3.0.0&bizFrom=stsy&channelType=null&markerName=ttlxj&validatorId=1&drawType=B'
                    res = self.session.post(url=url, data=data).json()
                    print(res)
                    if res['returnCode'] == '0':
                        print(f'沃钱包：签到成功，获得{res["amount"]}现金')

                    else:
                        print(f'沃钱包签到：签到失败，{res["returnMsg"]}')
                    # 获取本周签到信息
                    url = 'https://epay.10010.com/partyServer/ttlxj/userDrawInfo.do'
                    data = f'loginId={self.mobile}&activityId=TTLXJ20210330&wap_sessionID={wap_sessionid}&version=3.0.0&bizFrom=stsy'
                    res = self.session.post(url=url, data=data).json()
                    print(res)
                    print(f'沃钱包明细：累积金额{res["countAmount"]}，累积参与{res["countTimes"]}天')
                else:
                    print(f'沃钱包：登录失败')

        except Exception as e:
            print(f"沃钱包：执行出错，{e}")

    def run(self):
        self.Dingxiang100()
        self.Dongao()
        self.wallet()
        if self.last_login_time.find(self.now_date) == -1:
            self.onLine()
        if not self.getContinuous():
            self.signIn()
            # self.getGoldTotal()
            # self.getIntegral()
            self.getContinuous()
        if self.hasDouble:
            self.flushTime(randint(10, 15))
            options = {
                'arguments1': '',
                'arguments2': '',
                'codeId': 945535743,
                'channelName': 'android-签到看视频翻倍得积分-激励视频',
                'remark': '签到成功看视频再得奖',
                'ecs_token': self.session.cookies.get('ecs_token')
            }
            orderId = self.toutiao.reward(options)
            self.bannerAdPlayingLogo(orderId)
        for item in self.listTaskInfo():
            if int(item['accomplish']) or not int(item['click']):
                continue
            self.flushTime(randint(25, 30))
            options = {
                'arguments1': '',
                'arguments2': '',
                'codeId': 945558051,
                'channelName': 'android-签到气泡任务-激励视频',
                'remark': '签到页头气泡看视频得奖励',
                'ecs_token': self.session.cookies.get('ecs_token')
            }
            orderId = self.toutiao.reward(options)
            self.doTask(item, orderId)
        self.flushTime(randint(3, 5))
        self.message = ''
        self.getContinuous()
        self.listTaskInfo()
        self.recordLog(self.message)


if __name__ == '__main__':
    pass
