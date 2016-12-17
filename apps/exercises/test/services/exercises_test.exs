defmodule ExercisesTest do
  use ExUnit.Case
  doctest Exercises
  alias Exercises.Schemas
  alias Exercises.Services
  alias Exercises.Repo
  alias Exercises.RepoHelper

  setup_all do
    Repo.delete_all(Schemas.Exercise)

    exercise = RepoHelper.create_exercise(%{name: "Barbell Bench Press", description: "Barbell bench press",
      categories: ["Triceps", "Chest"]})
    {:ok, exercise: exercise}
  end

  test "#list should return a list of exercises", %{exercise: exercise} do
    assert Services.Exercise.list === {:ok, [exercise]}
  end

  test "#list should return nothing if the filter does not match", %{exercise: exercise} do
    payload = %{category: "lol"}
    assert Services.Exercise.list(payload) === {:ok, []}
  end

  test "#list should return the exercises that match the filter", %{exercise: exercise} do
    [category | _] = exercise.categories
    payload = %{category: category}
    assert Services.Exercise.list(payload) === {:ok, [exercise]}
  end

  test "#get should return an error if no exercise is found", %{exercise: %{id: id} = exercise} do
    assert Services.Exercise.get(id + 1) === {:error, :enotfound}
  end

  test "#get should return the found exercise", %{exercise: %{id: id} = exercise} do
    assert {:ok, exercise} === Services.Exercise.get(id)
  end
end
