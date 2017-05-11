#!/usr/bin/env bash

for app in 'workout' 'user'
do
  bash -c "cd ./apps/$app && MIX_ENV=test mix ecto.create && MIX_ENV=test mix ecto.migrate"
done
