# tests/integration/get-ext-html.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/html
```<h1>This is a fragment!</h1>```

HTTP/1.1 201

[Captures]
url: header "Location"

# 2. Try to GET the fragment we just posted by its URL and valid extension
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Type: text/html
[Asserts]
body startsWith "<h1>This is a fragment!</h1>"

GET {{url}}.html
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Type: text/html
[Asserts]
body startsWith "<h1>This is a fragment!</h1>"

GET {{url}}.txt
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "<h1>This is a fragment!</h1>"

# Html fragment cannot be returned as markdown or image

GET {{url}}.md
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 415

GET {{url}}.png
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 415



