.DEFAULT_GOAL := help

CMD := ./build.sh
ifeq ($(OS), Windows_NT)
	CMD := powershell .\build.ps1
endif

.PHONY: serve
serve:
	@echo 'To start serving Jekyll use: make serve'
	@echo ''
	Jekyll serve -w -l --force_polling