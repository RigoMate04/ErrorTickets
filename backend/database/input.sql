CREATE  DATABASE errTickets;


USE errTickets;


CREATE TABLE roles (id INT PRIMARY KEY,name VARCHAR(20) NOT NULL UNIQUE);

CREATE TABLE urgency_levels (
    id INT PRIMARY KEY,
    uLevelName VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO roles (id,name) VALUES (4,'dolgozo'),(3,'szemelyzet'), (2,'manager'), (1,'admin');
INSERT INTO urgency_levels (id,uLevelName) VALUES (1,'Nem surgos'),(2,'Surgos'),(3,'Kritikus'),(10,'Not assigned');

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT INTO users (username, password, email, role_id) VALUES 
("Administrator","$2a$12$mw3h2hnLFoto6McIvbxyzeOBf2UgmxQdDT0blLxkBaVuob.vVMjoW","administrator@admin.com", 1),
("Manager", "$2a$12$t2BEaJZidZZqEd5MT/wEzuByUwVwFI5dL6Q2YmXWcKEyBxElu2fsG","manager@manager.com", 2),
("Staff", "$2a$12$O45r.7U1j4TjNd9NgjXMEOS.6yoiuNeT/mOuu.UoyGIbkFJNA3JUS","staff@staff.com", 3),
("Worker", "$2a$12$seWfmhAyKayE5sof.UTOXeq4BXsB2H5RxI.8MHbdqO7wVEZHFEAYS","worker@worker.com", 4);
/*administrator1,staff1,manager1,worker1*/

CREATE TABLE tickets(
id INT AUTO_INCREMENT PRIMARY KEY, 
title VARCHAR(100) NOT NULL, 
place VARCHAR(25) NOT NULL, 
description VARCHAR(512) NOT NULL, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
urgentid INT NOT NULL, 
FOREIGN KEY (urgentid) REFERENCES urgency_levels(id), 
userid INT, FOREIGN KEY (userid) REFERENCES users(id));


INSERT INTO tickets (title, place, description, urgentid, userid) VALUES ('Hibás a nyomtató az irodában', 'Iroda', 'A nyomtató nem működik megfelelően, nem nyomtat ki semmit.', 3, 4), ('Internet kapcsolat megszakadt', 'Iroda', 'Az internet kapcsolat folyamatosan megszakad, nehéz dolgozni.', 2, 4), ('Szoftver frissítés szükséges', 'Iroda', 'A számítógépeken lévő szoftverek elavultak, frissítés szükséges.', 2, 4), ('Légkondicionáló nem működik', 'Iroda', 'A légkondicionáló nem hűt megfelelően, javításra szorul.', 3, 3), ('Projektor hibásan működik a tárgyalóban', 'Tárgyaló', 'A projektor képe elmosódott és néha kikapcsol.', 2, 4); 

CREATE VIEW ticket_view_Manager AS
SELECT id, title, place, description, created_at, urgentid, userid
FROM tickets;

CREATE VIEW ticket_view_Staff AS
SELECT id, title, place, description, urgentid, created_at
FROM tickets;

CREATE VIEW ticket_view_Worker AS
SELECT id, title, place, description, created_at, urgentid, userid
FROM tickets;