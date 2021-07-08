#!/usr/bin/perl
use strict;
use warnings;
use Digest::MD5 qw(md5_hex);

if(scalar @ARGV != 3) {
	print "usage: generate_patients first_names_file last_names_file npatients";
	exit 1;
}
open(my $fnh, '<:encoding(UTF-8)', $ARGV[0])
    or die "Could not open file '$ARGV[0]' $!";
open(my $lnh, '<:encoding(UTF-8)', $ARGV[1])
    or die "Could not open file '$ARGV[1]' $!";
open (my $patient_list, '>', 'patient_list.txt')
	or die "Could not open (patient_list.txt) for writing!"; 
open (my $patient_data, '>', 'patient_data.json')
	or die "Could not open (patient_data.json) for writing!"; 

`rm ../ICU/patientdata/*.png`;

chomp(my @first = <$fnh>);
chomp(my @lasts = <$lnh>);
close $fnh;
close $lnh;

print $patient_data "{\n";

for(my $i = 0; $i < $ARGV[2]; ++$i) {
	my $name = $first[rand(scalar @first)] . " " . $lasts[rand(scalar @lasts)];
	#add name to list
	print $patient_list "$name\n";
	#add created data to list
	my $patient_json = qx/perl create_patient_info.pl "${name}"/;
	if($i == $ARGV[2] - 1) {
		$patient_json = substr($patient_json, 0, length($patient_json) - 2) . "\n";
	}
	print $patient_data $patient_json;
}
print $patient_data "}\n";

close $patient_list;
close $patient_data;