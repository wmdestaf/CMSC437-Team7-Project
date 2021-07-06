#!/usr/bin/perl
use strict;
use warnings;

if(scalar @ARGV != 1) {
	print "usage: create_patient_info name";
	exit 1;
}
elsif($ARGV[0] !~ s/^(\S+)(\s+)(\S+)$/$1-$3/) {
	print "invalid name: $ARGV[0]\n";
	exit 1;
}

sub generateDate() {
	my $date = sprintf("%.2d-%.2d-%.4d", rand(12) + 1, rand(12) + 1, rand(93) + 1927);
	$date;
}

open(my $drugs_f, '<:encoding(UTF-8)', "drug_names.txt")
    or die "Could not open file drug_names.txt $!";
open(my $reasons_f, '<:encoding(UTF-8)', "reasons.txt")
    or die "Could not open file reasons.txt $!";
open(my $events_f, '<:encoding(UTF-8)', "medical_events.txt")
    or die "Could not open file medical_events.txt $!";
open(my $conditions_f, '<:encoding(UTF-8)', "medical_conditions.txt")
    or die "Could not open file medical_conditions.txt $!";

chomp(my @drugs = <$drugs_f>);
chomp(my @reasons = <$reasons_f>);
chomp(my @events = <$events_f>);
chomp(my @conditions = <$conditions_f>);

#......
print "\"data-$ARGV[0]\": {\n";
print "\t\"information\": {\n";
print "\t\t\"name\": \"$ARGV[0]\",\n";
my $dob = generateDate();
print "\t\t\"dob\": \"$dob\",\n";
my $sex = rand(100) < 49 ? "M" : "F";
print "\t\t\"sex\": \"$sex\",\n";
my $height = int(rand(125) + 100);
my $weight = int(rand(130) + 10);
print "\t\t\"height\": $height,\n";
print "\t\t\"weight\": $weight\n";
print "\t},\n";
print "\t\"medical-history\": {\n";
my $history_ct = int(rand(6)) + 1;
for(my $i = 0; $i < $history_ct; $i++) {
	print "\t\t\"" . generateDate() . "\": \"" . $events[rand(scalar @events)] . (($i == $history_ct - 1) ? "\"\n" : "\",\n");
}
print "\t},\n";
my $cur_med_ct = int(rand(5)) + 1;
print "\t\"current-medications\": [\n";
for(my $i = 0; $i < $cur_med_ct; $i++) {
	print "\t\t\"" . $drugs[rand(scalar @drugs)] . (($i == $cur_med_ct - 1) ? "\"\n" : "\",\n");
}
print "\t],\n";
print "\t\"former-medications\": [\n";
my $prev_med_ct = int(rand(6)) + 2;
for(my $i = 0; $i < $prev_med_ct; $i++) {
	print "\t\t\"" . $drugs[rand(scalar @drugs)] . (($i == $prev_med_ct - 1) ? "\"\n" : "\",\n");
}
print "\t],\n";
print "\t\"conditions\": [\n";
my $cond_count = int(rand(3)) + 1;
for(my $i = 0; $i < $cond_count; $i++) {
	print "\t\t\"" . $conditions[rand(scalar @conditions)] . (($i == $cond_count - 1) ? "\"\n" : "\",\n");
}
print "\t],\n";
print "\t\"reason-for-stay\": \"" . $events[rand(scalar @events)] . "\",\n";
print "\t\"saved-vitals\": {\n";
my $save_ct = int(rand(4)) + 1;
for(my $i = 0; $i < $save_ct; $i++) {
	print "\t\t\"" . generateDate() . "\": {\n";
	print "\t\t\t\"" . "hr\": " . int(rand(100) + 50)  . ",\n";
	print "\t\t\t\"" . "bp\": \"" . int(rand(100) + 100) . "/" . int(rand(100) + 80) . "\",\n";
	print "\t\t\t\"" . "SpO2\": " . int(rand(30) + 70) . ",\n";
	print "\t\t\t\"" . "Bpm\": " . int(rand(45) + 5) . ",\n";
	my $tmp = sprintf("%.1f", rand(13.7) + 94);
	print "\t\t\t\"" . "tmp\": " . $tmp . "\n";
	print (($i == $save_ct - 1) ? "\t\t}\n" : "\t\t},\n");
}
print "\t},\n";
print "\t\"saved-images\": [\n";
my $img_ct = int(rand(5)) + 1;
for(my $i = 0; $i < $img_ct; $i++) {
	my $randfile = int(rand(9)) . ".png";
	my $path = "ICU/patientdata/" . $ARGV[0] . generateDate() . ".png";
	system("cp ../xrays/$randfile ../$path");
	print "\t\t\"$path" . (($i == $img_ct - 1) ? "\"\n" : "\",\n");
}
print "\t]\n";
print "},\n";