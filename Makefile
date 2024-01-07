.DEFAULT_GOAL := default

ifndef ENV
$(error ENV must be set)
endif

DEST_DIR=site/$(ENV)
ifeq ($(ENV),production)
	MINIFY_CSS_FLAG=--minify --keep-names
	MINIFY_JS_FLAG=--minify --keep-names
ifndef PROD_DIR
$(error PROD_DIR must be set)
endif
	DEST_DIR=$(PROD_DIR)
else
	MINIFY_CSS_FLAG=
	MINIFY_JS_FLAG=
endif
EJS_DATA_FILE=ejs_data_file.$(ENV).json

## Source Files
SRC_DIR=src

HTML_SRC_DIR=$(SRC_DIR)/html
HTML_SRC_FILES=$(shell find $(HTML_SRC_DIR) -name '*.html' -not -path '*/templates/*')

CSS_SRC_DIR=$(SRC_DIR)/css
CSS_SRC_FILE=$(CSS_SRC_DIR)/index.css

JS_SRC_DIR=$(SRC_DIR)/js
JS_SRC_FILE=$(JS_SRC_DIR)/index.js
JS_TEST_SRC_FILE=$(JS_SRC_DIR)/tests.js
JS_SRC_FILES=$(shell find $(JS_SRC_DIR) -name '*.js')

IMAGES_SRC_DIR=$(SRC_DIR)/images
IMAGES_SRC_FILES=$(shell find $(IMAGES_SRC_DIR) -name '*.*')
ICON_SRC_FILE=$(IMAGES_SRC_DIR)/icons/icon.png

ASSETS_SRC_DIR=$(SRC_DIR)/assets
ASSETS_SRC_FILES=$(shell find $(ASSETS_SRC_DIR) -name '*.*')
MANIFEST_DEST=$(DEST_DIR)/manifest.webmanifest

## Destination Files

HTML_DEST_DIR=$(DEST_DIR)
HTML_DEST_FILES=${subst $(HTML_SRC_DIR),$(HTML_DEST_DIR),$(HTML_SRC_FILES)}

IMAGES_DEST_DIR=$(DEST_DIR)/images
ICONS_DEST_DIR=$(IMAGES_DEST_DIR)/icons
IMAGES_DEST_FILES=${subst $(IMAGES_SRC_DIR),$(IMAGES_DEST_DIR),$(IMAGES_SRC_FILES)}
FAVICON_ICO=$(DEST_DIR)/favicon.ico
ICON_180=$(ICONS_DEST_DIR)/icon-180.png
ICON_192=$(ICONS_DEST_DIR)/icon-192.png
ICON_512=$(ICONS_DEST_DIR)/icon-512.png

ASSETS_DEST_DIR=$(DEST_DIR)/assets
ASSETS_DEST_FILES=${subst $(ASSETS_SRC_DIR),$(ASSETS_DEST_DIR),$(ASSETS_SRC_FILES)}

CSS_DEST_DIR=$(DEST_DIR)/css
CSS_DEST_FILE=$(CSS_DEST_DIR)/styles.css

JS_DEST_DIR=$(DEST_DIR)/js
JS_DEST_FILE=$(JS_DEST_DIR)/main.js
JS_TEST_DEST_FILE=$(JS_DEST_DIR)/tests.js

$(CSS_DEST_FILE) : $(CSS_SRC_FILE)
	npx esbuild $(MINIFY_CSS_FLAG) --sourcemap --bundle $(CSS_SRC_FILE) --outfile=$(CSS_DEST_FILE)

$(JS_DEST_FILE) : $(JS_SRC_FILES)
	npx esbuild $(MINIFY_JS_FLAG) --sourcemap --bundle $(JS_SRC_FILE) --outfile=$@

$(JS_TEST_DEST_FILE) : $(JS_SRC_FILES)
	npx esbuild $(MINIFY_JS_FLAG) --sourcemap --bundle $(JS_TEST_SRC_FILE) --outfile=$@

$(HTML_DEST_DIR)/%.html: $(HTML_SRC_DIR)/%.html
	@mkdir -p `dirname $@`
	npx ejs --data-file $(EJS_DATA_FILE) --output-file $@ $<

$(IMAGES_DEST_DIR):
	@mkdir -p $(IMAGES_DEST_DIR)

$(ICONS_DEST_DIR): $(IMAGES_DEST_DIR)
	@mkdir -p $(ICONS_DEST_DIR)

$(ASSETS_DEST_DIR):
	@mkdir -p $(ASSETS_DEST_DIR)

$(IMAGES_DEST_DIR)/%: $(IMAGES_SRC_DIR)/%
	cp $< $@

$(FAVICON_ICO): $(ICON_SRC_FILE)
	@convert -background transparent "$(ICON_SRC_FILE)" -define icon:auto-resize=16,24,32,48,64,72,96,128,256 "$(FAVICON_ICO)"
$(ICON_180): $(ICON_SRC_FILE)
	@convert "$(ICON_SRC_FILE)" -resize 180x180 "$(ICON_180)"
$(ICON_192): $(ICON_SRC_FILE)
	@convert "$(ICON_SRC_FILE)" -resize 192x192 "$(ICON_192)"
$(ICON_512): $(ICON_SRC_FILE)
	@convert "$(ICON_SRC_FILE)" -resize 512x512 "$(ICON_512)"

$(ASSETS_DEST_DIR)/%: $(ASSETS_SRC_DIR)/%
	cp $< $@

$(MANIFEST_DEST): $(ICON_512) $(ICON_192)
	@echo "{" > $(MANIFEST_DEST)
	@echo "  \"icons\": [" >> $(MANIFEST_DEST)
	@echo "    { \"src\": \"/images/icons/icon-192.png\", \"type\": \"image/png\", \"sizes\": \"192x192\" }," >> $(MANIFEST_DEST)
	@echo "    { \"src\": \"/images/icons/icon-512.png\", \"type\": \"image/png\", \"sizes\": \"512x512\" }" >> $(MANIFEST_DEST)
	@echo "  ]" >> $(MANIFEST_DEST)
	@echo "}" >> $(MANIFEST_DEST)

clean:
	@rm -rf $(DEST_DIR)

debug:
	@echo $(ASSETS_DEST_FILES)

default: $(CSS_DEST_FILE) $(JS_DEST_FILE) $(JS_TEST_DEST_FILE) $(HTML_DEST_FILES) $(ICONS_DEST_DIR) $(IMAGES_DEST_DIR) $(IMAGES_DEST_FILES) $(ASSETS_DEST_DIR) $(ASSETS_DEST_FILES) $(FAVICON_ICO) $(MANIFEST_DEST) $(ICON_180)
	@echo Done with $(ENV)
