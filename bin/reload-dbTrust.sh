#!/bin/bash
# Run this file to load/reload the database.
# Put all board jsons you want loaded in
# db/boards
#
# **Make sure you edit db/creds.cfg before
#        running this script**
#
# USAGE
# -----
# /bin/bash reload-dbTrust.sh
# ---------------------------
#
# Happy mturking.


BINDIR=$( dirname $0 )

# Load credentials for db.
source ${BINDIR}/../db/creds.cfg

# Create database schema.
mysql -u ${DB_USER} -p${DB_PASS} < ${BINDIR}/../db/create-dbTrust.sql

# Load all of the boards.
for file in $( ls ${BINDIR}/../db/boards ); do
    stmt="INSERT INTO board (name,config)"
    json=$( cat ${BINDIR}/../db/boards/${file} )
    name=$( echo ${file} | cut -f1 -d'.' )
    insert="${stmt} VALUES ('${name}','${json}');"
    mysql -u ${DB_USER} -p${DB_PASS} dbTrust -e "${insert}"
done
