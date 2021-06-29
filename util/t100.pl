#!/usr/bin/perl
use strict;
use warnings;

if(scalar @ARGV != 1) {
	print "usage: t100 ifile";
	exit 1;
}
open(my $fh, '<:encoding(UTF-8)', $ARGV[0])
    or die "Could not open file '$ARGV[0]' $!";

my $max = 100;
my $cur = 0;
while (my $row = <$fh>) {
    $row =~ /^(.)(.+)$/;
	print uc($1) . lc($2);
	last if(++$cur >= $max);
	print "\n";
}
close $fh