
<h3 align="center">WorldWizQuiz</h3>

  <p align="center">
    An awesome opportunity to test your general knowledges over the different regions of the world!
</div>

<!-- ABOUT THE PROJECT -->
## About The Project
We know that you're dying to play and challenge yourself on our website, WorldWizQuiz, but you have some steps to follow carefully in order to make it work!

Here's the different steps: 
* Download our project via the Zip submitted.
* Extract it and open it in Visual Studio Code or any editor.
* Install Node.js if it's not already installed on your computer and run this command in your terminal : npm install npm@latest -g
* Then please import the database that you'll find at the bottom of this document, on your localhost.
* Once the database is created, run the following command in your terminal (make sure you're located in the file of the project) : 
* npm run devstart

Feel free to create your account once you're on the website.
You can also access the administrator part by loging in with the following credentials:
          <br>
          <strong> username: adminaccount
          <br>
          password: compteadmin</strong>

<p>


------Database:-------

     CREATE DATABASE regionsquiz; --Execute this command first
     
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

     INSERT INTO region (id,region) 
     VALUES(1,"Oceania"),
     (2,"North America"),
     (3,"South America"),
     (4,"Europe"),
     (5,"Asia"),
     (6,"Africa");

     INSERT INTO `login` (`username`, `password`, `permission`, `idregion`) VALUES
     ('adminaccount', '$2b$10$bdrA1nu44Dd4kEShObDWp.Ph4CTM6J4WXCjRtuUMB.QtwPU/Zx9mC', 'Admin', 5);

     INSERT INTO Questions (question, answer, option1, option2, option3, regionid, user_id)
     VALUES('What is the largest country in North America?', 'Canada', 'USA', 'Mexico', 'Greenland', 2,'adminaccount'),
    ('Which city is the capital of France?', 'Paris', 'Madrid', 'Berlin', 'London', 4,'adminaccount'),
    ('Which river is the longest in Asia?', 'Yangtze River', 'Mekong River', 'Indus River', 'Ganges River', 5, 'adminaccount'),
    ('Which country is known as the "Land Down Under"?', 'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 1, 'adminaccount'),
    ('What is the largest desert in Africa?', 'Sahara Desert', 'Kalahari Desert', 'Namib Desert', 'Gobi Desert', 6,'adminaccount'),
    ('Which mountain range runs through South America?', 'Andes', 'Rocky Mountains', 'Himalayas', 'Alps', 3,'adminaccount');

    INSERT INTO score(idregion,username,score,attempt) VALUES
    (1,"compteadmin",0,0),
    (2,"compteadmin",0,0),
    (3,"compteadmin",0,0),
    (4,"compteadmin",0,0),
    (5,"compteadmin",0,0),
    (6,"compteadmin",0,0);
    
</p>
