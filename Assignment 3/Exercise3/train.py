import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler

data = pd.read_csv('Customer.csv')

data.dropna(inplace=True)

label_encoder = LabelEncoder()
data['Segment'] = label_encoder.fit_transform(data['Segment'])

x = data[['Segment']]
y = data['Age']

scaler = StandardScaler()
x_scaled = scaler.fit_transform(x)
x_train, X_test, y_train, y_test = train_test_split(x_scaled, y, test_size=0.2, random_state=42)

model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(x_train.shape[1],)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1)
])

model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])
model.fit(x_train, y_train, epochs=50, batch_size=16, validation_split=0.1)

model.save('my_model.keras')