lea.DEFAULT_GOAL := help

CMD := ./build.sh
ifeq ($(OS), Windows_NT)
	CMD := powershell .\build.ps1
endif

.PHONY: install
install:
	@echo 'To install Jekyll use: make install'
	@echo ''
	bundle install

.PHONY: plantuml-jar
plantuml-jar:
	@echo 'Downloading PlantUML JAR to vendor/plantuml.jar...'
	@mkdir -p vendor
	curl -fsSL "https://github.com/plantuml/plantuml/releases/latest/download/plantuml.jar" \
		-o vendor/plantuml.jar
	@echo 'Installing Graphviz (required by PlantUML)...'
	sudo apt-get install -y default-jre-headless graphviz
	@echo 'Done.'

.PHONY: serve
serve:
	@echo 'To start serving Jekyll use: make serve'
	@echo ''
	bundle exec jekyll serve -w -l --force_polling --trace

.PHONY: build
build: 
	@echo 'To build Jekyll use: make build'
	@echo ''
	bundle exec jekyll build --trace