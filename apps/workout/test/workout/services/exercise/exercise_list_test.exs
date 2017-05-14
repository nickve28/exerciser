defmodule Workout.Services.ExerciseListTest do
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

  test "#list should return a list of exercises", %{exercise: exercise} do
    assert Services.Exercise.list == {:ok, [exercise]}
  end

  test "#list should return nothing if the filter does not match" do
    payload = %{category: "lol"}
    assert Services.Exercise.list(payload) === {:ok, []}
  end

  test "#list should return the exercises that match the filter", %{exercise: exercise} do
    [category | _] = exercise.categories
    payload = %{category: category}
    assert Services.Exercise.list(payload) === {:ok, [exercise]}
  end

  test "#list should allow filter on ids" do
    %{id: id_two} = RepoHelper.create_exercise(%{name: "Squats", description: "Barbell bench press",
      categories: ["Triceps", "Chest"], type: "strength", metric: "kg"})
    %{id: id_three} = RepoHelper.create_exercise(%{name: "Squats", description: "Barbell bench press",
      categories: ["Triceps", "Chest"], type: "strength", metric: "kg"})

    payload = %{ids: [id_two, id_three]}
    assert {:ok, [%{id: ^id_two}, %{id: ^id_three}]} = Services.Exercise.list(payload)
  end

  describe "when multiple exercises exist" do
    setup do
      exercise2 = RepoHelper.create_exercise(%{name: "barbell Test", description: "A test",
        categories: ["Triceps", "Chest"], type: "strength", metric: "kg"})
      exercise3 = RepoHelper.create_exercise(%{name: "a Test", description: "A test",
        categories: ["Triceps", "Chest"], type: "strength", metric: "kg"})
      {:ok, exercise2: exercise2, exercise3: exercise3}
    end

    test "#list should order on name case independent", %{exercise: exercise, exercise2: exercise2, exercise3: exercise3} do
      expected = [
        Map.take(exercise3, [:id, :name, :description, :categories, :type, :metric]),
        Map.take(exercise, [:id, :name, :description, :categories, :type, :metric]),
        Map.take(exercise2, [:id, :name, :description, :categories, :type, :metric])
      ]
      assert {:ok, expected} = Services.Exercise.list
    end
  end
end