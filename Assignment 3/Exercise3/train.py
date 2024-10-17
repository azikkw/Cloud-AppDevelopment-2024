import tensorflow as tf 
import pandas as pd 
 
# Load training data from Google Cloud Storage 
data_path = 'gs://azat-ass3-bucket/Customer.csv' 
data = pd.read_csv(data_path) 
 
# Assume your data has 'features' and 'label' columns 
X = data['features'].values.reshape(-1, 1) 
y = data['label'].values 
 
# Create a simple model 
model = tf.keras.Sequential([ 
    tf.keras.layers.Dense(1, input_shape=(1,)) 
]) 
 
model.compile(optimizer='adam', loss='mean_squared_error') 
 
# Train the model 
model.fit(X, y, epochs=10) 
 
# Save the trained model to GCS 
model.save('gs://cloud-app-dev/trained_model')




# import tensorflow as tf
# import numpy as np

# X_train = np.random.rand(1000, 784) 
# y_train = np.random.randint(0, 10, size=(1000,))

# def create_model():
#     model = tf.keras.Sequential([
#         tf.keras.layers.Dense(10, activation='relu', input_shape=(784,)),
#         tf.keras.layers.Dense(10, activation='softmax')
#     ])
#     model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
#     return model

# def main():
#     model = create_model()
#     train_data = tf.data.Dataset.from_tensor_slices((X_train, y_train)).batch(32)
#     model.fit(train_data, epochs=5)
#     model.save('gs://azat-ass3-bucket/Customer.csv')

# if __name__ == '__main__':
#     main()
