
PROJECT_DIR=${USER}/androidstudioprojects/tsumetto2
WIN_PROJECT_DIR=d:/users/${PROJECT_DIR}
WIN_MOUNT_DIR=/mnt/d/users/${PROJECT_DIR}
DIST_DIR=./
PORT=9000

deploy:
	npm run build
	mkdir -p $(WIN_MOUNT_DIR)
	rm -rf $(WIN_MOUNT_DIR)/src/*	
#	cp -r dist/* $(WIN_DIR)/
	rsync -av --exclude="node_modules/" --exclude=".git/" . ${WIN_MOUNT_DIR}	
	@echo "Copied to Windows."

serve:
	powershell.exe -Command "cd ${WIN_PROJECT_DIR}/dist; python -m http.server $(PORT) --bind 0.0.0.0"

#all: rsync run

dev:
	npm run dev
#rsync:
#	rm -rf src
#	rsync -av --exclude="node_modules/" --exclude=".git/" ${SOURCE_DIR} .

cap:
#	npm run build
	npx cap copy android
	npx cap sync android
	npx cap open android

# android studio: メモ
# Android Studio Iguana | 2023.2.1
# capacitor は v6をいれる
#	npm install  @capacitor/core@6 @capacitor/cli@6 @capacitor/android@6 @capacitor/share@6
# build.gradle で JAVA_21 とあったらJAVA_17に変える
#	File-ProjectStructure-Module 
# AGP 8.3 に： build.grade:  classpath 'com.android.tools.build:gradle:8.3.0'

# 開発サーバーメモ
# ローカルWSL： npm run dev
# Windowshttpサーバ： make deploy;  make serve
# 実機インストール：make deploy; windows上のandroid studioで実行