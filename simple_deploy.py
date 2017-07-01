from subprocess import call
import os
import fileinput
import sys

RELEASE = 1
UPGRADE = 2

def run_migrations():
    call(["MIX_ENV=prod mix ecto.create && mix ecto.migrate"], shell=True)

def build_fe():
    call(["npm", "run", "--if-present", "deploy"], cwd="./apps/api")

def increase_number(file_name):
    new_version = None
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
    return str(new_version)

def build_release(type):
    if type == UPGRADE:
      call(["MIX_ENV=prod mix release --upgrade"], shell=True)
    else:
      call(["MIX_ENV=prod mix release"], shell=True)

def deploy_version(new_version, type):
    cmd = "MIX_ENV=prod PORT=4000 _build/prod/rel/exerciser/bin/exerciser console"
    if type == UPGRADE:
      cmd = "MIX_ENV=prod _build/prod/rel/exerciser/bin/exerciser upgrade %s" % str(new_version)
    call([cmd], shell=True, cwd="./")

if __name__ == '__main__':
    #type = UPGRADE if ('upgrade' in  sys.argv) else RELEASE
    run_migrations()
    #build_fe()
    #new_version = increase_number('rel/config.exs')
    build_release(RELEASE)
    #deploy_version(new_version, type)
