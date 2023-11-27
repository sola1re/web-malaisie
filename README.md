------Database:-------

    CREATE TABLE RegionsQuiz (
        id INT PRIMARY KEY AUTO_INCREMENT,
        question VARCHAR(255) NOT NULL,
        
        answer VARCHAR(255) NOT NULL,
        option1 VARCHAR(255) NOT NULL,
        option2 VARCHAR(255) NOT NULL,
        option3 VARCHAR(255) NOT NULL,
        
        published_by VARCHAR(50) NOT NULL,
        region ENUM('North America', 'Europe', 'Asia', 'Oceania', 'Africa', 'South America') NOT NULL
        user_id VARCHAR(255) NOT NULL,

        FOREIGN KEY (user_id) REFERENCES login(username)
    );

    CREATE TABLE `login` (
     `username` varchar(255) NOT NULL,
     `password` varchar(255) NOT NULL,
     `country` varchar(255) NOT NULL
    )

    ALTER TABLE `login`
      ADD PRIMARY KEY (`username`),
      ADD UNIQUE KEY `UNIQUE` (`username`);


------Queries:-------

    INSERT INTO `login` (`username`, `password`, `country`) VALUES('Admin', 'Admin', 'Europe');

    INSERT INTO RegionsQuiz (question, answer, option1, option2, option3, published_by, region, user_id)
    VALUES ('What is the largest country in North America?', 'Canada', 'USA', 'Mexico', 'Greenland', 'Your Name', 'North                    America','Admin');

    INSERT INTO RegionsQuiz (question, answer, option1, option2, option3, published_by, region, user_id)
    VALUES ('Which city is the capital of France?', 'Paris', 'Madrid', 'Berlin', 'London', 'Your Name', 'Europe','Admin');

    INSERT INTO RegionsQuiz (question, answer, option1, option2, option3, published_by, region, user_id)
    VALUES ('Which river is the longest in Asia?', 'Yangtze River', 'Mekong River', 'Indus River', 'Ganges River', 'Your Name', 'Asia',     'Admin');

    INSERT INTO RegionsQuiz (question, answer, option1, option2, option3, published_by, region, user_id)
    VALUES ('Which country is known as the "Land Down Under"?', 'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Your Name',        'Oceania', 'Admin');

    INSERT INTO RegionsQuiz (question, answer, option1, option2, option3, published_by, region, user_id)
    VALUES ('What is the largest desert in Africa?', 'Sahara Desert', 'Kalahari Desert', 'Namib Desert', 'Gobi Desert', 'Your Name',        'Africa','Admin');

    INSERT INTO RegionsQuiz (question, answer, option1, option2, option3, published_by, region, user_id)
    VALUES ('Which mountain range runs through South America?', 'Andes', 'Rocky Mountains', 'Himalayas', 'Alps', 'Your Name', 'South        America','Admin');

