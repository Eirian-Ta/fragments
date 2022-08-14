# tests/integration/put-fragments-image.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: image/jpeg
file, images/laptop_1.jpg;

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
Content-Type: image/jpeg
file, images/another_laptop.jpg;

HTTP/1.1 201
# We have various assertions about the response that we want to check 
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{id}}
jsonpath "$.fragment.ownerId" == {{ownerId}}
jsonpath "$.fragment.created" == {{createdTime}}
jsonpath "$.fragment.updated" != {{updatedTime}}
jsonpath "$.fragment.type" == "image/jpeg"


# 4. Try to get the updated fragment
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: image/jpeg
