
import json
from sklearn.svm import SVR
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np
from pyecharts import Map
import pandas as pd
import datetime as dt
import matplotlib.dates as mdates
from urllib import request
from os import remove, listdir

filename = R'./src/world_confirmed_data.json'
url = R'https://covid.ourworldindata.org/data/total_cases.csv'
font = fm.FontProperties(fname=R'./src/SIMHEI.TTF')

lookback = 4
ONEDAY = dt.timedelta(days=1)
tomorrow = dt.date.today()+ONEDAY


class Predict:

    def _plot_curve(self, country, data_list):
        if len(data_list) > 10:
            data_list = data_list[-10:]
        dates = [tomorrow]
        for i in range(1, len(data_list)):
            dates.insert(0, tomorrow-i*ONEDAY)

        fig = plt.figure()
        ax = fig.add_subplot(1, 1, 1)
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%m-%d'))
        plt.plot(dates[:-1], data_list[:-1],
                 c='dodgerblue', alpha=1, label='近日感染人数')
        plt.plot(dates[-2:], data_list[-2:],
                 c='cornflowerblue', alpha=1, linestyle='--', label='预计明日人数')
        plt.title(country+"'s confirmed cases")
        plt.legend(prop=font, fancybox=True, shadow=True)
        plt.gcf().autofmt_xdate()
        plt.savefig(R'./daily_data/images/ '[:-1]+country+'.png')

    def daily_update(self, filename=filename):
        self._load_model()
        world_data_dict = self._load_data(filename)
        self._creat_map(world_data_dict)
        pred_data = dict()
        for country, num_list in world_data_dict.items():
            if len(num_list) < lookback + 1:
                num_list = [0] * (lookback + 1 - len(num_list)) + num_list

            pred_num = self._predict(num_list)

            pred_data[country] = pred_num

            if num_list[-1] > 5000:
                self._plot_curve(country, num_list+[pred_num])

        with open(R'./daily_data/predict_data.json', 'w') as f:
            f.write(json.dumps(pred_data, ensure_ascii=False, indent=4))

    def _creat_map(self, world_data_dict):
        countries = []
        confirmed = []
        for country, data_list in world_data_dict.items():
            if data_list:
                countries.append(country)
                confirmed.append(data_list[-1])
        map = Map("covid-19疫情地图", width=1000, height=500)
        map.add(
            "",
            countries,
            confirmed,
            maptype="world",
            is_visualmap=True,
            is_map_symbol_show=False,
            is_piecewise=True,
            visual_text_color="#000",
            pieces=[
                    {"max": 10, "min": 0, "label": "0~10"},
                    {"max": 100, "min": 10, "label": "10~100"},
                    {"max": 1000, "min": 100, "label": "100~1000"},
                    {"max": 10000, "min": 1000, "label": "1000~10000"},
                    {"max": 99999999, "min": 10000, "label": "10000+"},
            ]
        )
        map.render(R'./daily_data/world_map.html')

    def _load_data(self, filename):
        with open(filename) as fr:
            lines = fr.readlines()

        json_str = ''
        for line in lines:
            json_str += line

        world_data_dict = json.loads(json_str)

        return world_data_dict

    def clean(self):
        paths = [R"./daily_data/images/ "[:-1]+x
                     for x in listdir(R'./daily_data/images')]
        for path in paths:
            remove(path)

    def download(self):
        request.urlretrieve(url, filename=R'./src/world_data.csv')

    def preprocess(self):
        df=pd.read_csv(R'./src/world_data.csv', header=None)

        world_data=dict()

        for i in range(2, df.shape[1]):
            country=df[i][0]
            data=list(df[i].dropna()[1:].astype(int))
            world_data[country]=data

        with open(R'./src/world_confirmed_data.json', 'w') as f:
            f.write(json.dumps(world_data, ensure_ascii=False, indent=4))

    def _load_model(self):
        svr_3=SVR(kernel='poly', C=50, gamma='auto', degree=3, epsilon=.1,
                    coef0=1)
        svr_2=SVR(kernel='poly', C=50, gamma='auto', degree=2, epsilon=.1,
                    coef0=1)
        svr_1=SVR(kernel='linear', C=50, gamma='auto')
        self.models=[svr_3, svr_2, svr_1]
        self.x=np.array(range(1, 6)).reshape(-1, 1)
        self.pred=np.array([6]).reshape(1, -1)

    def _predict(self, data_list):
        data_array=np.array(data_list[-5:]).reshape(-1, 1)
        predicts=[]
        for svr in self.models:
            y_pred=svr.fit(self.x, data_array).predict(self.pred)
            predicts.append(y_pred)
        pred_num=sorted(predicts)[1]
        pred_num=int(max(pred_num, data_list[-1]))
        return pred_num


log_path = R'./src/log.txt'

p=Predict()
with open(log_path,'a') as f:
    f.write(dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S\n'))
p.clean()
with open(log_path,'a') as f:
    f.write('cleaned\n')
p.download()
with open(log_path,'a') as f:
    f.write('download\n')
p.preprocess()
with open(log_path,'a') as f:
    f.write('convert csv to json\n')
p.daily_update()
with open(log_path,'a') as f:
    f.write('updated\n')
