from subprocess import call
import os
import fileinput
import sys

def run_migrations():
    call(["MIX_ENV=prod mix ecto.create && mix ecto.migrate"], shell=True)

def build_fe():
    call(["npm", "run", "--if-present", "deploy"], cwd="./apps/api")

def increase_number(file_name):
    new_version_line = None
    with open(file_name, 'r') as file:
        version_line = None
        for line in file.readlines():
            if 'version' in line:
                version_line = line
        cur_version = version_line[-3]
        new_version = int(cur_version) + 1
        new_version_line = version_line[:-3] + str(new_version) + "\""
    for line in fileinput.input(file_name, inplace=True):
        if 'version' in line:
            line = new_version_line + "\n"
        sys.stdout.write(line)

if __name__ == '__main__':
    run_migrations()
    build_fe()
    increase_number('rel/config.exs')
