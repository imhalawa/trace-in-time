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

.PHONY: serve
serve:
	@echo 'To start serving Jekyll use: make serve'
	@echo ''
	bundle exec jekyll serve -w -l --force_polling --trace	

