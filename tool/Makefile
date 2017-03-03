.PHONY: clean all
GEOJSONDIR = geojson
TOPOJSONDIR = topojson
TMPDIR = tmp
DIRS = $(GEOJSONDIR) $(TOPOJSONDIR) $(TMPDIR)

TOPOJSON = topojson/yem_boundary.json topojson/yem_districts.json

all: $(DIRS) $(TOPOJSON)

$(TOPOJSONDIR)/yem_boundary.json: $(GEOJSONDIR)/yem_boundary.geojson
	../node_modules/.bin/geo2topo \
		boundary=$< > $(TMPDIR)/yem_boundary.json
	../node_modules/.bin/toposimplify $(TMPDIR)/yem_boundary.json \
		-S 0.001 \
		-o $@

$(TOPOJSONDIR)/yem_districts.json: $(GEOJSONDIR)/yem_districts.geojson
	../node_modules/.bin/geo2topo \
		districts=$< > $(TMPDIR)/yem_districts.json
	../node_modules/.bin/toposimplify $(TMPDIR)/yem_districts.json \
		-S 0.0005 \
		-o $@

$(GEOJSONDIR):
	mkdir -p geojson

$(TOPOJSONDIR):
	mkdir -p topojson

$(TMPDIR):
	mkdir -p tmp

$(GEOJSONDIR)/yem_boundary.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/yem_boundary.geojson \
		shp/yem_boundary/yem_bnd_reduced.shp

$(GEOJSONDIR)/yem_districts.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/yem_districts.geojson \
		shp/yem_districts/yem_dis_reduced.shp

clean:
	-rm -rf tmp geojson topojson

	
