.PHONY: clean all
GEOJSONDIR = geojson
TOPOJSONDIR = topojson
TMPDIR = tmp
DIRS = $(GEOJSONDIR) $(TOPOJSONDIR) $(TMPDIR)

TOPOJSON = topojson/a0.json topojson/a2-sinluxor.json topojson/a2-withluxor.json topojson/a3.json topojson/districts.json

all: $(DIRS) $(TOPOJSON)

$(TOPOJSONDIR)/a0.json: $(GEOJSONDIR)/egy-a0.geojson
	../node_modules/.bin/geo2topo \
		egy0=$< > $(TMPDIR)/a0.json
	../node_modules/.bin/toposimplify $(TMPDIR)/a0.json \
		-S 0.001 \
		-o $@

$(TOPOJSONDIR)/a2-sinluxor.json: $(GEOJSONDIR)/egy-a2-sinluxor.geojson
	../node_modules/.bin/geo2topo \
		egy2=$< > $(TMPDIR)/a2-sinluxor.json
	../node_modules/.bin/toposimplify $(TMPDIR)/a2-sinluxor.json \
		-S 0.001 \
		-o $@

$(TOPOJSONDIR)/a2-withluxor.json: $(GEOJSONDIR)/egy-a2-withluxor.geojson
	../node_modules/.bin/geo2topo \
		egy2=$< > $(TMPDIR)/a2-withluxor.json
	../node_modules/.bin/toposimplify $(TMPDIR)/a2-withluxor.json \
		-S 0.001 \
		-o $@

$(TOPOJSONDIR)/a3.json: $(GEOJSONDIR)/egy-a3.geojson
	../node_modules/.bin/geo2topo \
		egy3=$< > $(TMPDIR)/a3.json
	../node_modules/.bin/toposimplify $(TMPDIR)/a3.json \
		-S 0.001 \
		-o $@

$(TOPOJSONDIR)/districts.json: $(GEOJSONDIR)/egy-districts.geojson
	../node_modules/.bin/geo2topo \
		districts=$< > $(TMPDIR)/districts.json
	../node_modules/.bin/toposimplify $(TMPDIR)/districts.json \
		-S 0.0005 \
		-o $@

$(GEOJSONDIR):
	mkdir -p geojson

$(TOPOJSONDIR):
	mkdir -p topojson

$(TMPDIR):
	mkdir -p tmp

$(GEOJSONDIR)/egy-a0.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/egy-a0.geojson \
		shp/egy_a0_boundaries/egy_admin0_2012.shp

$(GEOJSONDIR)/egy-a2-sinluxor.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/egy-a2-sinluxor.geojson \
		shp/egy_a2_boundary_sinluxor/egy_admin2_1995.shp

$(GEOJSONDIR)/egy-a2-withluxor.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/egy-a2-withluxor.geojson \
		shp/egy_a2_boundary_withluxor/egy_admin2_2016.shp

$(GEOJSONDIR)/egy-a3.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/egy-a3.geojson \
		shp/egy_a3_boundary/Qism_Markaz.shp

$(GEOJSONDIR)/egy-districts.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/egy-districts.geojson \
		shp/egy_districts/egy_districts_municipalities_dissolved.shp

clean:
	-rm -rf tmp geojson topojson

	
