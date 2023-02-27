DROP TABLE IF EXISTS Parts
CREATE TABLE Parts(
    partID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    partName VARCHAR(50),
    price INT,
    partPerBox INT
)

DROP TABLE IF EXISTS [Permissions]
CREATE TABLE [Permissions](
    permissionID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    permissionName VARCHAR(50)
)

DROP TABLE IF EXISTS Users
CREATE TABLE Users(
    username VARCHAR(50) NOT NULL PRIMARY KEY,
    [password] VARCHAR(100) NOT NULL,
    perrmissionID INT NOT NULL FOREIGN KEY REFERENCES [Permissions](permissionID)
)

DROP TABLE IF EXISTS [States]
CREATE TABLE [States](
    stateID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    stateName VARCHAR(50),
)

DROP TABLE IF EXISTS Customers
CREATE TABLE Customers(
    SSN VARCHAR(50) NOT NULL PRIMARY KEY,
    [name] VARCHAR(50),
    [address] VARCHAR(50),
    phone VARCHAR(15),
    email VARCHAR(50)
)

DROP TABLE IF EXISTS Projects
CREATE TABLE Projects(
    projectID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL FOREIGN KEY REFERENCES Users(username),
    orderDate DATE,
    workingTime INT,
    laborFee INT,
    [address] VARCHAR(50),
    [description] VARCHAR(50),
    customerSSN VARCHAR(50) NOT NULL FOREIGN KEY REFERENCES Customers(SSN),
    currentStateID INT NOT NULL FOREIGN KEY REFERENCES [States](stateID)
)

DROP TABLE IF EXISTS Storage
CREATE TABLE Storage(
    ID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [row] INT NOT NULL,
    [column] INT NOT NULL,
    [level] INT NOT NULL,
    partID INT NOT NULL FOREIGN KEY REFERENCES Parts(partID),
    currentPieces INT
)

DROP TABLE IF EXISTS Parts_needed
CREATE TABLE Parts_needed(
    partID INT NOT NULL FOREIGN KEY REFERENCES Parts(partID),
    projectID INT NOT NULL FOREIGN KEY REFERENCES Projects(projectID),
    reguiredQuantity INT,
    PRIMARY KEY(partID, projectID)
)

DROP TABLE IF EXISTS Telemetry
CREATE TABLE Telemetry(
    projectID INT NOT NULL FOREIGN KEY REFERENCES Projects(projectID),
    stateID INT NOT NULL FOREIGN KEY REFERENCES [States](stateID),
    startDate DATE,
    finishDate DATE,
    PRIMARY KEY(projectID, stateID)
)
--GO
-- DROP TABLE IF EXISTS Telemetry
-- DROP TABLE IF EXISTS Parts_needed
-- DROP TABLE IF EXISTS Storage
-- DROP TABLE IF EXISTS Projects
-- DROP TABLE IF EXISTS Customers
-- DROP TABLE IF EXISTS [States]
-- DROP TABLE IF EXISTS Users
-- DROP TABLE IF EXISTS [Permissions]
-- DROP TABLE IF EXISTS Parts
-- GO



INSERT INTO Parts([partName], price, partPerBox)
    VALUES
    ('BSD Panel', 89990, 5), 
    ('Huaewi Panel', 119000, 8),
    ('Huawei Inverter', 310000, 2),
    ('Fronius Inverter', 423000, 2),
    ('Tartókonzol', 20000, 10),
    ('Kábel 6mm', 1200, 200),
    ('Kábel 3mm', 800, 300)

INSERT INTO [Permissions](permissionName)
    VALUES('Szakember'),('Raktáros'),('Raktárvezető')

INSERT INTO Users
    VALUES
    ('szakember1','58ac22875aee49f8f6ec08c5c7bdc20094fa0bf7384bf841d4ef6d8a6013a59c',1),-- szakember1, szakemberjelszo
    ('raktaros1','4c28b8b24fed825f74f0df5749274682c7d88f3c08d816d52efe9c9a25e440d3',2),-- raktaros1, raktarosjelszo
    ('raktarvezeto1','4bd05fb1bef4fafabce6dcd47491614d5bc9a089bf1c28cf7369ac5d3a313bee',3)-- raktaros1, raktarvezetojelszo

INSERT INTO States
    VALUES
    ('New'),('Draft'),('Wait'),('Scheduled'),('InProgress'),('Completed'),('Failed')

INSERT INTO Customers
    VALUES
    ('123456AB','Kovács Elek', 'Veszprém', '+36301234567','kovacs.elek@gmail.com'),
    ('634792HF','Nagy Géza', 'Budapest', '+36201249857','nagy.geza@gmail.com'),
    ('7654321KD','Kiss Etelka', 'Ajka', '+36706352040','kiss.etelka@gmail.com')

INSERT INTO Projects(username, orderDate, workingTime, laborFee, [address], [description], customerSSN, currentStateID)
    VALUES
    ('szakember1', '2023-01-15',3, 200000,'Balatonalmádi','Kis nyaraló, nagy pénz', '123456AB', 1),
    ('szakember1', '2023-02-27', 4, 100000,'Budapest','Nagy nyaraló, kis pénz', '634792HF', 1)

INSERT INTO Storage
    VALUES
    (1,1,1,1,5),
    (1,2,1,2,8),
    (1,3,1,3,2),
    (2,1,1,4,2),
    (2,2,1,5,10),
    (2,3,1,6,200),
    (3,1,1,7,300)


