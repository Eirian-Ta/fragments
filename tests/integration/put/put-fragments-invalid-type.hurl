# tests/integration/put-fragments-invalid-type.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Captures]
createdTime : jsonpath "$.fragment.created" 
updatedTime : jsonpath "$.fragment.updated" 
id: jsonpath "$.fragment.id"
ownerId : jsonpath "$.fragment.ownerId"

# 3. Update the fragment
PUT {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: application/json
# Body of the request goes in ```...``` when it's a string
```This is the updated content```

HTTP/1.1 400
[Asserts]
jsonpath "$.error.code" == 400
