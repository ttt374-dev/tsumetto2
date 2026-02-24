
#SOURCE_DIR=/z/home/tom/source/tsumetto2/
WIN_DIR=/mnt/d/users/tom/AndroidstudioProjects/tsumetto2
DIST_DIR=./
PORT=9000

deploy:
	npm run build
	mkdir -p $(WIN_DIR)
	rm -rf $(WIN_DIR)/src/*	
#	cp -r dist/* $(WIN_DIR)/
	rsync -av --exclude="node_modules/" --exclude=".git/" . ${WIN_DIR}	
	@echo "Copied to Windows."

serve:
	powershell.exe -Command "cd d:/users/tom/AndroidstudioProjects/tsumetto2/dist; python -m http.server $(PORT) --bind 0.0.0.0"

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

