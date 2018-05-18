﻿CREATE TABLE utilisateur_uti (
	uti_id SERIAL PRIMARY KEY,
	uti_nom VARCHAR(60) NOT NULL,
	uti_prenom VARCHAR(60) NOT NULL,
	uti_email VARCHAR(80) NOT NULL,
	uti_pseudo VARCHAR(60) NOT NULL,
	uti_password VARCHAR NOT NULL
)

CREATE TABLE musique_mus (
	mus_id SERIAL PRIMARY KEY,
	mus_titre VARCHAR(80) NOT NULL,
	mus_artiste VARCHAR(50) NOT NULL,
	mus_length VARCHAR(10) NOT NULL,
	mus_path VARCHAR NOT NULL,
	mus_filesize VARCHAR(20) NOT NULL,
	uti_id_uploader INTEGER NOT NULL REFERENCES utilisateur_uti ON DELETE CASCADE
)

CREATE TABLE playlist_pll (
	pll_id SERIAL PRIMARY KEY,
	pll_titre VARCHAR(80) NOT NULL,
	pll_length INTEGER NOT NULL,
	uti_id_maker INTEGER NOT NULL REFERENCES utilisateur_uti ON DELETE CASCADE
)

CREATE TABLE musiquelink_mul (
	mul_id SERIAL PRIMARY KEY,
	mus_id INTEGER NOT NULL REFERENCES musique_mus ON DELETE CASCADE,
	pll_id INTEGER NOT NULL REFERENCES playlist_pll ON DELETE CASCADE
)

CREATE TABLE like_lik (
	lik_id SERIAL PRIMARY KEY,
	mus_id INTEGER NOT NULL REFERENCES musique_mus ON DELETE CASCADE,
	uti_id_liker INTEGER NOT NULL REFERENCES utilisateur_uti ON DELETE CASCADE,
	lik_timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL
)