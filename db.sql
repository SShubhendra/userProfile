<!--mysql:workbench -->

CREATE DATABASE user;
use user;
CREATE TABLE IF NOT EXISTS  `users` (
  `user_id` int(10) NOT NULL AUTO_INCREMENT ,
  `image` varchar(255) NOT NULL,
   `name` varchar(250) NOT NULL ,
   `email` varchar(250) NOT NULL ,
   `password` varchar(250) NOT NULL ,
   `salt` varchar(10) NOT NULL ,
   PRIMARY KEY (`user_id`)
  )   DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

