# cURL Requests

These are just some example cURLs if you want to test the API from the command line. Use `npm run start:server` to run a local instance (this starts on 8081), otherwise, change cURL command to use port 8080 if you want to use the one running in Docker.

Note: you will need to modify cURLs to utilize the ID passed back by /api/initialize.

## /api/initialize

```
curl -X GET http://localhost:8081/api/initialize
```

## /api/add-temporary-hit-points

```
curl -X POST http://localhost:8081/api/add-temporary-hit-points -H "Content-Type: application/json" -d '{"targetId":"622ee774-3518-461d-9ffc-ec59b876d484","temporaryHitPoints":14}' --compressed -k
```

## /api/heal

```
curl -X POST http://localhost:8081/api/heal -H "Content-Type: application/json" -d '{"targetId":"c2b20251-e9b3-4ee0-8bca-d3e2e47bf023","totalHitPoints":14}' --compressed -k
```

## /api/deal-damage

```
curl -X POST http://localhost:8081/api/deal-damage -H "Content-Type: application/json" -d '{"targetId":"c2b20251-e9b3-4ee0-8bca-d3e2e47bf023","damagePoints":[["fire", 4],["slashing",12]]}' --compressed -k
```
