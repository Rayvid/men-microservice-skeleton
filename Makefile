SHELL:=/bin/bash

-include .makerc

build:
	-docker-compose -f compose.dev.yml build

up:
	-docker-compose -f compose.dev.yml up

login:
	cat ~/.gitlab | docker login registry.gitlab.com --username $(GITLAB_USER) --password-stdin

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

#deploy-%:
#	docker --tls login registry.gitlab.com
#	DOCKER_HOST=tcp://swarm.lympo.io:2376 docker --tls stack deploy --compose-file=prod.$*.yml --prune --with-registry-auth $*
#
#deploy: deploy-main deploy-mon deploy-tools
