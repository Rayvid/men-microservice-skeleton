SHELL:=/bin/bash

clean:
	-docker system prune -f

destroy:
	-docker kill $(shell docker ps -q)
	-docker rm $(shell docker ps -a -q)
	-docker rmi -f $(shell docker images -q -f dangling=true)
	-docker rmi -f $(shell docker images -q)
	-docker volume ls -qf dangling=true | xargs docker volume rm
	-docker system prune -f

kill:
	-docker kill $(shell docker ps -q)

#deploy-%:
#	docker --tls login registry.gitlab.com
#	DOCKER_HOST=tcp://swarm.lympo.io:2376 docker --tls stack deploy --compose-file=prod.$*.yml --prune --with-registry-auth $*
#deploy: deploy-main deploy-mon deploy-tools
