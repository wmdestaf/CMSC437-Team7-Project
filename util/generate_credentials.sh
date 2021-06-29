#!/bin/bash

#clear existing creds
if [[ -e login.txt ]]; then
	rm login.txt
fi

if [[ -e insecure.txt ]]; then
	rm insecure.txt
fi

#have we already pulled raw data?
if [[ ! -e first_names.txt || ! -e last_names.txt || ! -e common_words.txt ]]; then
	#get from web
	curl "https://www.usna.edu/Users/cs/roche/courses/s15si335/proj1/files.php%3Ff=names.txt&downloadcode=yes" > raw_first.txt
	curl "https://raw.githubusercontent.com/arineng/arincli/master/lib/last-names.txt" > raw_last.txt
	curl "https://raw.githubusercontent.com/hugsy/stuff/master/random-word/english-nouns.txt" > raw_words.txt

	#format
	perl t100.pl raw_first.txt > first_names.txt
	perl t100.pl raw_last.txt  > last_names.txt
	perl t100.pl raw_words.txt  > common_words.txt
	rm raw_first.txt
	rm raw_last.txt
	rm raw_words.txt
fi

#generate credentials
perl g_cred.pl first_names.txt last_names.txt common_words.txt > login.txt
echo "Done."