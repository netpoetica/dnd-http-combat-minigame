#
# Local Development
#
start-local:
	npm run compile
	# Use docker-compose extended by .local
	docker-compose -f docker-compose.yml -f docker-compose.local.yml down -v
	docker-compose -f docker-compose.yml -f docker-compose.local.yml build
	docker-compose -f docker-compose.yml -f docker-compose.local.yml up

#
# Server/Production
#
start:
	npm run compile
	docker-compose -f docker-compose.yml down -v
	docker-compose -f docker-compose.yml build
	# Probably would use the -d option.
	docker-compose -f docker-compose.yml up