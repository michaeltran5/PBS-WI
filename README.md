# PBS Wisconsin Content Recommendation Engine
A recommendation engine for PBS Wisconsin's WordPress website to improve user experience and engagement on the platform by suggesting national and local content to viewers based on personalized preferences and viewer history.

## Tech Used:

Web development was done using **React, Typescript, and the Bootstrap framework** to create the user interface.
The backend of this application is built using a PHP server.
The recommendation engine was built using **Machine Learning and AWS (S3, Lambda, Personalize)**

## PHP Installation with Homebrew
1. Install Homebrew (if needed): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
2. Install PHP: `brew install php`
3. Verify installation: `php -v`

## Link to the PBS Media Manager php client
https://github.com/tamw-wnet/PBS_Media_Manager_Client/tree/master

## Start the php server
php -S localhost:8000

## Run w/VITE

**$npm install**

**$npm run build**

**$npm run dev**

## EC2 Instance Startup
ssh -i spring2025team1.pem ec2-user@3.86.235.248
You have to make a spring2025team1.pem file with the EC2 credentials
chmod 400 for security

## Authors:

**Camille Forster:** https://github.com/camilleforster

**Michael Tran:** https://github.com/michaeltran5

**Nik Nordquist:** https://github.com/niknordquist

**Owen Loucks:** https://github.com/owenloucks
