
PROJECT_DIR=/users/${USER}/androidstudioprojects/tsumetto2
WIN_PROJECT_DIR=d:/${PROJECT_DIR}
WIN_MOUNT_DIR=/mnt/d/${PROJECT_DIR}
PORT=9000

SRC := $(shell find src -type f)
DIST := dist/.built

$(DIST): $(SRC)
	npm run build
	mkdir -p dist
	touch $(DIST)

build: $(DIST)

.PHONY: clean
clean:
	rm -rf dist

dev:
	npm run dev

run-android: build	
	npx cap sync android
	mkdir -p ${WIN_MOUNT_DIR}
	rsync -av --progress android ${WIN_MOUNT_DIR}

serve-android: build
	mkdir -p ${WIN_MOUNT_DIR}
	rsync -av --progress dist ${WIN_MOUNT_DIR}
	powershell.exe -Command "cd ${WIN_PROJECT_DIR}/dist; python -m http.server $(PORT) --bind 0.0.0.0"

deploy:
#	npx cap sync android
	mkdir -p $(WIN_MOUNT_DIR)
#	cp -r android/ $(WIN_MOUNT_DIR)
#	cp -r dist/ $(WIN_MOUNT_DIR)
#	rm -rf $(WIN_MOUNT_DIR)/src/*	
#	rsync -av --exclude="node_modules/" --exclude=".git/" --exclude="/android" . ${WIN_MOUNT_DIR}	
#	rsync -av --exclude="node_modules/" --exclude=".git/" . ${WIN_MOUNT_DIR}	
	rsync -av --progress android dist ${WIN_MOUNT_DIR}
	@echo "Copied to Windows."

#serve:
#	powershell.exe -Command "cd ${WIN_PROJECT_DIR}/dist; python -m http.server $(PORT) --bind 0.0.0.0"

#all: rsync run

#rsync:
#	rm -rf src
#	rsync -av --exclude="node_modules/" --exclude=".git/" ${SOURCE_DIR} .

#cap:
#	npm run build
#	npx cap copy android
#	npx cap sync android
#	npx cap open android

# android studio: メモ

# AGP 8.9.1
# gradle: 8.11
# JDK 17

# 開発サーバーメモ
# ローカルWSL： npm run dev
# Windowshttpサーバ： make build; make deploy;  make serve
# 実機インストール：
#	WSL: make build;make deploy
#   Windows: android/ フォルダで android studioで実行