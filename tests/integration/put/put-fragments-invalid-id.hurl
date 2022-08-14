
# tests/integration/put-fragments-invalid-id.hurl
PUT http://localhost:8080/v1/fragments/invalidId
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain; charset=utf-8
# Body of the request goes in ```...``` when it's a string
```This is the updated content```

HTTP/1.1 404
