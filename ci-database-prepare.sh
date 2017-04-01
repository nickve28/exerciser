#!/usr/bin/env bash

for app in 'exercises' 'workout' 'user'
do
  bash -c "MIX_ENV=test cd ./apps/$app && mix ecto.create && mix ecto.migrate"
done
