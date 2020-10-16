.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down -v

.PHONY: ui
ui:
	$ open http://localhost:8080/?pgsql=db&username=integration_testing&db=postgres&ns=public
