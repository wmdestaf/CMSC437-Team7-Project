#!/usr/bin/perl
system("curl https://clincalc.com/DrugStats/Top200Drugs.aspx > drugs.txt");
open(my $fh, '<:encoding(UTF-8)', "drugs.txt")
    or die "Could not open file 'drugs.txt' $!";
open(my $oh, '>', 'drug_names.txt')
    or die "Could not open output file (drug_names.txt) for writing!";

my $lines = 0;
while (my $row = <$fh>) {
    if($row =~ /<td><a href=\".*\">(.*)<\/a><\/td>/) {
		print $oh "$1\n";
		last if $lines++ == 100;
	}
}
close $fh;
close $oh;

system("rm drugs.txt");