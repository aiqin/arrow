
#If need collect code coverage of unction test, please update commands in hybridapp_commands.sh to add '--coverage' in below commands, 
#mkdir ../../bak
cp -r ../../lib/ ../../bak/lib
istanbul instrument ../../bak/lib/ -o ../../lib/
./hybridapp_commands.sh
rm -rf ../../lib
cp -r ../../bak/lib/ ../../lib

