CREATE TABLE pins
(
    gid serial,
    name char(10),
    lat double precision,
    lng double precision,
    srid char(10),
    geom geometry(Point,4326)
);


INSERT INTO public.pins (gid, name, lat, lng, srid, geom)
VALUES (1, 'drzewo1', 53.3655, 14.6499, '4326', ST_GeomFromText('POINT(14.6499 53.3655)', 4326));

INSERT INTO public.pins (name, lat, lng, srid, geom)
VALUES ('drzewo2', 53.3654, 14.6494, '4326', ST_GeomFromText('POINT(14.6494 53.3654)', 4326));