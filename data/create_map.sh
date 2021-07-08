#!/bin/bash

gawk "-F," "BEGIN{print\"{\"}{if($6 == \"nurse\"){printf(\"\\\"data-%s-%s\\\": [\n],\n\",$2,$1);}}END{print\"}\n\"}" ../util/login.txt > patient_map.json
head -n -3 patient_map.json > tmp.txt
cat tmp.txt ending.txt > patient_map.json
rm tmp.txt