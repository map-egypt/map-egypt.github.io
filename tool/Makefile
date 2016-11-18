geojson:
	mkdir -p geojson
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/egy-a0.geojson \
		shp/egy_a0_boundaries/egy_admin0_2012.shp
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/egy-a2-sinluxor.geojson \
		shp/egy_a2_boundary_sinluxor/egy_admin2_1995.shp
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/egy-a2-withluxor.geojson \
		shp/egy_a2_boundary_withluxor/egy_admin2_2016.shp
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/egy-a3.geojson \
		shp/egy_a3_boundary/Qism_Markaz.shp
	ogr2ogr -f GeoJSON -t_srs crs:84 \
		geojson/egy-districts.geojson \
		shp/egy_districts/egy_districts_municipalities_dissolved.shp

topojson:
	mkdir -p topojson
	mkdir -p tmp

	../node_modules/.bin/geo2topo \
		egy0=geojson/egy-a0.geojson > tmp/a0.json
	../node_modules/.bin/toposimplify tmp/a0.json \
		-S 0.001 \
		-o topojson/a0.json

	../node_modules/.bin/geo2topo \
		egy2=geojson/egy-a2-sinluxor.geojson > tmp/a2-sinluxor.json
	../node_modules/.bin/toposimplify tmp/a2-sinluxor.json \
		-S 0.001 \
		-o topojson/a2-sinluxor.json

	../node_modules/.bin/geo2topo \
		egy2=geojson/egy-a2-withluxor.geojson > tmp/a2-withluxor.json
	../node_modules/.bin/toposimplify tmp/a2-withluxor.json \
		-S 0.001 \
		-o topojson/a2-withluxor.json

	../node_modules/.bin/geo2topo \
		egy3=geojson/egy-a3.geojson > tmp/a3.json
	../node_modules/.bin/toposimplify tmp/a3.json \
		-S 0.001 \
		-o topojson/a3.json

	../node_modules/.bin/geo2topo \
		districts=geojson/egy-districts.geojson > tmp/districts.json
	../node_modules/.bin/toposimplify tmp/districts.json \
		-S 0.0005 \
		-o topojson/districts.json

	rm tmp/*.json
