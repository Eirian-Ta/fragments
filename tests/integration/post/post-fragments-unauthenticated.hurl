# Confirm that posting a fragment when not authenticated produces a 401 error

# Unauthenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# Sending invalid credential
Authorization: Basic invalidCredential
# We're sending a plain text fragment
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We expect to get back an HTTP 401
HTTP/1.1 401
# We have various assertions about the response that we want to check 
[Asserts]
# error message
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"
