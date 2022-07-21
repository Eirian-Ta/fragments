# Confirm that posting an unsupported Content-Type produces a 415 error

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending an unsupported Content-Type
Content-Type: text/ecmascript
# Body of the request goes in ```...``` when it's a string
```This is an unsupported fragment!```

# We expect to get back an HTTP 415
HTTP/1.1 415
# We have various assertions about the response that we want to check 
[Asserts]
# Check error 
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "req.body is not a Buffer"
jsonpath "$.error.code" == 415

