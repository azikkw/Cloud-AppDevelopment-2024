import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler

model = tf.keras.models.load_model('my_model.keras')
data = pd.read_csv('Customer.csv')

label_encoder = LabelEncoder()
data['Segment'] = label_encoder.fit_transform(data['Segment'])

input_data = pd.DataFrame({'Segment': ['Consumer']})

input_data['Segment'] = label_encoder.transform(input_data['Segment'])
scaler = StandardScaler()
input_scaled = scaler.fit_transform(input_data)

predicted_age = model.predict(input_scaled)

print(f'Predicted age: {predicted_age[0][0]}')