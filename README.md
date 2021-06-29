# CMSC437-Team7-Project
Git Repository for Team 7's project in Prof. Donayee's CMSC437 SS1 class.

util/generate_credentials.sh depends on perl
the credential lookup will not work unless this is running on like XAMPP,
because it will complain about cross source origin lookup when going for the files.
unhashed username/passwords are stored in util/insecure.txt after generation