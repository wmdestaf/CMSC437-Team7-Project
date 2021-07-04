#!/usr/bin/perl
system("curl https://stacker.com/stories/2046/top-100-reasons-emergency-room-visits > internment_reasons.txt");
open(my $fh, '<:encoding(UTF-8)', "internment_reasons.txt")
    or die "Could not open file 'drugs.txt' $!";
open(my $oh, '>', 'reasons.txt')
    or die "Could not open output file (insecure.txt) for writing!";

while (my $row = <$fh>) {
    if($row =~ /<div>#\d{2,3}\. (.*)<\/div>/) {
		print $oh "$1\n";
	}
}
close $fh;
close $oh;

system("rm internment_reasons.txt");