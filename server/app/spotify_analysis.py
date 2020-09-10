import pandas as pd
import numpy as np
from sklearn import preprocessing
from sklearn.decomposition import PCA
from sklearn.ensemble import IsolationForest

# Utility function
def get_sec(time_str):
    m, s = time_str.split(':')
    return int(m) * 60 + int(s)

def convert_s_to_min_sec(ms):
    minutes = str(int(ms / (60) % 60))
    seconds = str(int((ms % 60)))
    
    # Prepend zero if seconds is length 1
    if len(seconds) == 1:
        seconds = '0' + seconds
    return (minutes + ":" + seconds)

class SpotifyAnalysis:
    def __init__(self, data):
        self.df = pd.DataFrame(data)

    # Return describe data
    def find_average(self):
        def _convert_params(stats):
            results = []

            # Convert to array of feature descriptions for client to shape around
            for feature, feature_value in stats.items():
                feature_value["lower_perc"] = feature_value.pop("25%")
                feature_value["median"] = feature_value.pop("50%")
                feature_value["upper_perc"] = feature_value.pop("75%")
                feature_value["type"] = feature
                results.append(feature_value)
            
            return results

        return _convert_params(self.df.describe().to_dict())

    def find_outliers(self):

        results = []

        try:
            # Make a copy
            temp = self.df.copy()
            
            # Drop non-numerical columns
            temp.drop(columns=['id', 'key', 'mode', 'time_signature'], inplace=True)

            # Convert MM:SS to seconds
            temp["duration"] = temp["duration"].apply(get_sec)

            # Fit data
            min_max_scaler = preprocessing.StandardScaler()
            np_scaled = min_max_scaler.fit_transform(temp)
            data = pd.DataFrame(np_scaled)

            # Predict
            model = IsolationForest(contamination="auto")
            model.fit(data)

            # Check for anomalies
            temp["anomaly"] = pd.Series(model.predict(data))
            temp["anomaly"] = temp["anomaly"].map({ 1: 0, -1: 1 })
            
            # Rebuild data and filter for anomlies only to return
            temp = pd.concat([temp, self.df[["id"]]], axis = 1)
            temp["duration"] = temp["duration"].apply(convert_s_to_min_sec)
            is_anomaly = temp["anomaly"] == 1
            temp = temp[is_anomaly].to_dict("id")

            # Just need to return the id of the tracks
            for track_idx, track in temp.items():
                results.append(track["id"])

        except Exception as e:
            print(e)
        
        return results