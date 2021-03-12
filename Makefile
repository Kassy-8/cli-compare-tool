install:
	npm install
publish:
	npm publish --dry-run
lint:
	npx eslint .
push:
	git push -u origin main
test:
	node --experimental-vm-modules node_modules/.bin/jest