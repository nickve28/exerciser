defmodule Workout.Services.ExerciseGetTest do
  use ExUnit.Case, async: false #since we reset DB each session as a clean slate
  alias Workout.Schemas
  alias Workout.Services
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

  test "#get should return an error if no exercise is found", %{exercise: %{id: id}} do
    assert Services.Exercise.get(id + 1) === {:error, {:enotfound, "Exercise not found", []}}
  end

  test "#get should return the found exercise", %{exercise: %{id: id} = exercise} do
    assert {:ok, exercise} === Services.Exercise.get(id)
  end
end