SHELL:=/bin/bash

-include .makerc

up:
	docker-compose -f compose.dev.yml up

build:
	-docker-compose -f compose.dev.yml stop
	-docker-compose -f compose.dev.yml rm --force
	docker-compose -f compose.dev.yml build --no-cache

login:
	docker login registry.gitlab.com

clean:
	-docker system prune -f

destroy:
	-docker kill $(shell docker ps -q)
	-docker rm $(shell docker ps -a -q)
	-docker rmi -f $(shell docker images -q -f dangling=true)
	-docker rmi -f $(shell docker images -q)
	-docker volume prune -f
	-docker system prune -f

kill:
	-docker kill $(shell docker ps -q)
