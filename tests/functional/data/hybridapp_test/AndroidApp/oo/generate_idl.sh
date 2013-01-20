#!/bin/sh

#  generate_idl.sh
#  cocktailsrt
#



generateJava() {
    FILE=$idl_dir/RT$1IDL.java

json=`cat $3 | sed -e 's/\"/\\\"/g' | tr '\n' ' '`

    cat > "$FILE" <<END;
    
package com.yahoo.platform.crt.service.IDL;
//
// Automatically generated @ `date`
//

public class RT$1IDL { 

    public static String  $2IDLString = "$json";
    
}

END
}

capitalize_first ()          
{                            
    string0="$1"
    firstchar=${string0:0:1}
    string1=${string0:1}
    FirstChar=`echo "$firstchar" | tr a-z A-Z`
    echo "$FirstChar$string1"
}

idl_dir="."



if [ -d $idl_dir ]
then
    for f in $idl_dir/*.json
    do
        o=`basename "$f" .json`
        capName=`capitalize_first $o`
        echo $capName
        echo $o
        echo $f
        generateJava $capName $o $f
    done
fi