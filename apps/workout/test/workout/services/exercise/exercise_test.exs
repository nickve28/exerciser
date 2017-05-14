defmodule Workout.Services.ExerciseTest do
  use ExUnit.Case, async: false #since we reset DB each session as a clean slate
  doctest Workout.Services.Exercise
  alias Workout.Schemas
  alias Workout.Repo
  alias Exercise.RepoHelper

  setup do
    Workout.Repositories.MockWorkout.enable #enable mock genserver as proxy for test

    on_exit(fn -> Workout.Repositories.MockWorkout.disable end)

    Repo.delete_all(Schemas.PerformedExercise)
    Repo.delete_all(Schemas.Workout)
    Repo.delete_all(Schemas.Exercise)

    exercise = RepoHelper.create_exercise(%{name: "Barbell Bench Press", description: "Barbell bench press",
      categories: ["Triceps", "Chest"], type: "strength", metric: "kg"})
    {:ok, exercise: exercise}
  end
end