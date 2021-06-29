#!/usr/bin/perl
use strict;
use warnings;
use Digest::MD5 qw(md5_hex);

if(scalar @ARGV != 3) {
	print "usage: g_cred first_names_file last_names_file words_file";
	exit 1;
}
open(my $fnh, '<:encoding(UTF-8)', $ARGV[0])
    or die "Could not open file '$ARGV[0]' $!";
open(my $lnh, '<:encoding(UTF-8)', $ARGV[1])
    or die "Could not open file '$ARGV[1]' $!";
open(my $wdh, '<:encoding(UTF-8)', $ARGV[2])
    or die "Could not open file '$ARGV[2]' $!";
open(my $isc, '>', 'insecure.txt')
    or die "Could not open output file (insecure.txt) for writing!";
	

chomp(my @first = <$fnh>);
chomp(my @lasts = <$lnh>);
chomp(my @words = <$wdh>);
close $fnh;
close $lnh;
close $wdh;

#precompute list of password characters (printable ASCII) to draw from
use constant sal_len => 128; #a bit on the long side
use constant pwc_len => 94;
my $pwc = "";
for(my $i = 33; $i < 127; ++$i) { 
	$pwc .= chr($i); 
}

sub gen {
	my $pw = "";
	for(my $i = 0; $i < $_[0]; ++$i) { $pw .= substr($pwc, rand(pwc_len), 1); } 
	$pw =~ s/,/0/g; #hacky but preserves comma integrity of line
	$pw
}

my @jobs = ("nurse", "nurse", "physician");


#In the unlikely event of a username collision:
my %usernames;

for(my $i = 0; $i < 100; ++$i) {
	#first name
	my $fn = $first[rand(scalar @first)];
	#last name
	my $ln = $lasts[rand(scalar @lasts)]; 
	
	#username
	my $user = lc(substr($fn, 0, 1)) . lc($ln);
	#handle username collision
	if(!exists($usernames{"$user"})) {
		$usernames{"$user"} = 1;
	}
	else {
		$user .= ++$usernames{"$user"};
	}
	
	#password
	#this is a deliberatley insecure scheme, to show off the salt + hash
	my $pw = $words[rand(scalar @words)] . $words[rand(scalar @words)];
	my $job = $jobs[rand(scalar @jobs)];
	print $isc "$user,$pw,$job\n";
	
	#if this was being built seriously I would instead use a CSPRNG, but it'll work for Proof of Concept
	my $salt = gen(sal_len);
	
	$pw = md5_hex($salt . $pw);
	print "$ln,$fn,$user,$pw,$salt,$job\n";
}

close $isc