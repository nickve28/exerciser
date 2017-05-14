defmodule Workout.Services.ExerciseCountTest do
  use ExUnit.Case, async: false #since we reset DB each session as a clean slate
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

  describe "#count" do
    setup do
      exercise2 = RepoHelper.create_exercise(%{name: "barbell Test", description: "A test",
        categories: ["Triceps", "Chest"], type: "strength", metric: "kg"})
      exercise3 = RepoHelper.create_exercise(%{name: "a Test", description: "A test",
        categories: ["Triceps", "Chest"], type: "strength", metric: "kg"})
      {:ok, exercise2: exercise2, exercise3: exercise3}
    end

    @tag :count
    test "should return the amount of exercises" do
      assert {:ok, 3} === Workout.Services.Exercise.count
    end
  end
end