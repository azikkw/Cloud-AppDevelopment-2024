```

gcloud functions deploy send_notification \
    --runtime python39 \
    --trigger-http \
    --allow-unauthenticated \
    --region us-central1

```