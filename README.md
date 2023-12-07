------Database:-------

     CREATE TABLE region (
         id INT PRIMARY KEY AUTO_INCREMENT,
         region ENUM("Europe","North America","South America","Oceania","Africa","Asia") NOT NULL
     );
    
     CREATE TABLE login (
     username varchar(255) PRIMARY KEY NOT NULL,
     password varchar(255) NOT NULL,
     permission varchar(255) DEFAULT 'User' NOT NULL,
     idregion INT NOT NULL,

     UNIQUE(username),
     FOREIGN KEY (idregion) REFERENCES region(id)
     );

     CREATE TABLE Questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        question VARCHAR(255) NOT NULL,
        
        answer VARCHAR(255) NOT NULL,
        option1 VARCHAR(255) NOT NULL,
        option2 VARCHAR(255),
        option3 VARCHAR(255) ,
        
        regionid INT NOT NULL,
        user_id VARCHAR(255) NOT NULL,

        FOREIGN KEY (user_id) REFERENCES login(username),
        FOREIGN KEY (regionid) REFERENCES region(id)
    );

    CREATE TABLE score(
        idregion int NOT NULL,
        username VARCHAR(255) NOT NULL,
        score INT DEFAULT 0,
        attempt INT DEFAULT 0,
    
        FOREIGN KEY (idregion) REFERENCES region(id),
        FOREIGN KEY (username) REFERENCES login(username),
        PRIMARY KEY(idregion, username)
     );


------Queries:-------

    INSERT INTO `login` (`username`, `password`, `permission`, `idregion`) VALUES
     ('compteadmin', '$2b$10$bdrA1nu44Dd4kEShObDWp.Ph4CTM6J4WXCjRtuUMB.QtwPU/Zx9mC', 'Admin', 5),
     ('Paul', '$2b$10$Nnyx/KoSbPs1/ft7wlyHj.M0D6OsXGvWjxWsVodhphVZbz7HsbYby', 'User', 4),
     ('Raph', '$2b$10$I8xSU1bLxj1Ihnix1upVLOaeUXmEMIe5lErGOT2r5Ib9dNnPn4lv.', 'User', 4);

    INSERT INTO Questions (question, answer, option1, option2, option3, region, user_id)
    VALUES ('What is the largest country in North America?', 'Canada', 'USA', 'Mexico', 'Greenland', 'North America','compteadmin');

    INSERT INTO Questions (question, answer, option1, option2, option3, region, user_id)
    VALUES ('Which city is the capital of France?', 'Paris', 'Madrid', 'Berlin', 'London', 'Europe','compteadmin');

    INSERT INTO Questions (question, answer, option1, option2, option3, region, user_id)
    VALUES ('Which river is the longest in Asia?', 'Yangtze River', 'Mekong River', 'Indus River', 'Ganges River', 'Asia', 'Raph');

    INSERT INTO Questions (question, answer, option1, option2, option3, region, user_id)
    VALUES ('Which country is known as the "Land Down Under"?', 'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Oceania', 'compteadmin');

    INSERT INTO Questions (question, answer, option1, option2, option3, region, user_id)
    VALUES ('What is the largest desert in Africa?', 'Sahara Desert', 'Kalahari Desert', 'Namib Desert', 'Gobi Desert', 'Africa','Paul');

    INSERT INTO Questions (question, answer, option1, option2, option3, region, user_id)
    VALUES ('Which mountain range runs through South America?', 'Andes', 'Rocky Mountains', 'Himalayas', 'Alps', 'South America','compteadmin');

