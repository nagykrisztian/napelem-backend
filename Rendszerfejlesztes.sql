DROP TABLE IF EXISTS Alkatresz
CREATE TABLE Alkatresz(
    alkatreszID INT NOT NULL PRIMARY KEY,
    nev VARCHAR(50),
    ar INT,
    reszenkenti_darabszam INT
)

DROP TABLE IF EXISTS Jogosultsag
CREATE TABLE Jogosultsag(
    jogosultsagID INT NOT NULL PRIMARY KEY,
    jogosultsagnev VARCHAR(50)
)

DROP TABLE IF EXISTS Felhasznalo
CREATE TABLE Felhasznalo(
    felhasznalonev VARCHAR(50) NOT NULL PRIMARY KEY,
    jelszo VARCHAR(50) NOT NULL,
    jogosultsagID INT NOT NULL FOREIGN KEY REFERENCES Jogosultsag(jogosultsagID)
)

DROP TABLE IF EXISTS Allapot
CREATE TABLE Allapot(
    allapotID INT NOT NULL PRIMARY KEY,
    allapot_nev VARCHAR(50),
)

DROP TABLE IF EXISTS Megrendelo
CREATE TABLE Megrendelo(
    szigSzam VARCHAR(50) NOT NULL PRIMARY KEY,
    nev VARCHAR(50),
    lakcim VARCHAR(50),
    telefon INT,
    email VARCHAR(50)
)

DROP TABLE IF EXISTS Projekt
CREATE TABLE Projekt(
    projektID INT NOT NULL PRIMARY KEY,
    felhasznalonev VARCHAR(50) NOT NULL FOREIGN KEY REFERENCES Felhasznalo(felhasznalonev),
    megrendelesi_datum DATE,
    munkavegzesi_ido INT,
    munkadij INT,
    helyszin VARCHAR(50),
    leiras VARCHAR(50),
    megrendeloSzigSzam VARCHAR(50) NOT NULL FOREIGN KEY REFERENCES Megrendelo(szigSZam),
    aktualis_allapotID INT NOT NULL FOREIGN KEY REFERENCES Allapot(allapotID)
)

DROP TABLE IF EXISTS Raktar
CREATE TABLE Raktar(
    sor INT NOT NULL,
    oszlop INT NOT NULL,
    szint INT NOT NULL,
    alkatreszID INT NOT NULL FOREIGN KEY REFERENCES Alkatresz(alkatreszID),
    jelenlegi_darabszam INT
)

DROP TABLE IF EXISTS Alkatresz_szukseglet
CREATE TABLE Alkatresz_szukseglet(
    alkatreszID INT NOT NULL FOREIGN KEY REFERENCES Alkatresz(alkatreszID),
    projektID INT NOT NULL FOREIGN KEY REFERENCES Projekt(projektID),
    ar INT NOT NULL,
    reszenkenti_darabszam INT
)

DROP TABLE IF EXISTS Naplo
CREATE TABLE Naplo(
    projektID INT NOT NULL FOREIGN KEY REFERENCES Projekt(projektID),
    allapotID INT NOT NULL FOREIGN KEY REFERENCES Allapot(allapotID),
    kezdoDatum DATE,
    vegDatum DATE,
)