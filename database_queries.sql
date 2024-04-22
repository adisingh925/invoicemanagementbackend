`client`CREATE DATABASE lndtraining;

SELECT * FROM invoice_table;

DROP TABLE CLIENT;

CREATE TABLE CLIENT (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    PASSWORD VARCHAR(255),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    password_update_time TIMESTAMP
);

CREATE TABLE gym (
    gym_id INT AUTO_INCREMENT PRIMARY KEY,
    gym_name VARCHAR(255),
    gym_address VARCHAR(255),
    gym_phone_number VARCHAR(20),
    gym_email VARCHAR(255),
    client_id INT,
    is_deleted BOOLEAN DEFAULT FALSE, 
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES CLIENT(client_id)
);

DROP TABLE gym;

CREATE TABLE membership (
    membership_id INT AUTO_INCREMENT PRIMARY KEY,
    membership_name VARCHAR(255),
    membership_price DECIMAL(10, 2),
    membership_duration_months INT,
    client_id INT,
    gym_id INT,
    is_deleted BOOLEAN DEFAULT FALSE, 
    insert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES CLIENT(client_id),
    FOREIGN KEY (gym_id) REFERENCES gym(gym_id)
);

DROP TABLE membership;

DROP TABLE CLIENT;

CREATE TABLE invoice();

DESC invoice_table;

DROP TABLE 1_invoices;

DROP TABLE customer;

INSERT INTO invoice_table VALUES (19, "IN", 12, "test", "2008-11-11", 12, 0, 1, 12, "abc", 12);

SHOW DATABASES;

SELECT fileTypes FROM customer WHERE fk_client_id = 1;

CREATE TABLE manager (
    manager_id INT AUTO_INCREMENT PRIMARY KEY,
    manager_name VARCHAR(255) NOT NULL,
    manager_phone_number VARCHAR(20) UNIQUE,
    manager_email VARCHAR(255) UNIQUE,
    client_id INT,
    gym_id INT,
    is_deleted BOOLEAN DEFAULT FALSE, 
    insert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES CLIENT(client_id),
    FOREIGN KEY (gym_id) REFERENCES gym(gym_id)
);

CREATE TABLE MEMBER (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    member_name VARCHAR(255) NOT NULL,
    member_email VARCHAR(255) UNIQUE,
    member_phone_number VARCHAR(20) UNIQUE,
    member_membership_type INT,
    client_id INT,
    gym_id INT,
    payment_due_date TIMESTAMP, 
    insert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES CLIENT(client_id),
    FOREIGN KEY (gym_id) REFERENCES gym(gym_id),
    FOREIGN KEY (member_membership_type) REFERENCES membership(membership_id)
);


DROP TABLE MEMBER;


