defmodule Workout.Services.WorkoutTest do
  use ExUnit.Case, async: false
  doctest Workout.Services.Workout

  alias Workout.Schemas
  alias Workout.Repo

  setup_all do
    Workout.Repositories.MockExercise.enable #enable mock genserver as proxy for test

    on_exit(fn -> Workout.Repositories.MockExercise.disable end)
    :ok
  end

  setup do
    Repo.delete_all(Schemas.Workout)
    Repo.delete_all(Schemas.PerformedExercise)
    Repo.delete_all(Schemas.Exercise)

    :ok
  end
end
