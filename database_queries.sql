
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

