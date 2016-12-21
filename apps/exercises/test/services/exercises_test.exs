defmodule ExercisesTest do
  use ExUnit.Case, async: false #since we reset DB each session as a clean slate
  doctest Exercises
  alias Exercises.Schemas
  alias Exercises.Services
  alias Exercises.Repo
  alias Exercises.RepoHelper

  setup do
    Repo.delete_all(Schemas.Exercise)

    exercise = RepoHelper.create_exercise(%{name: "Barbell Bench Press", description: "Barbell bench press",
      categories: ["Triceps", "Chest"]})
    {:ok, exercise: exercise}
  end

  test "#list should return a list of exercises", %{exercise: exercise} do
    assert Services.Exercise.list === {:ok, [exercise]}
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

  test "#get should return an error if no exercise is found", %{exercise: %{id: id}} do
    assert Services.Exercise.get(id + 1) === {:error, :enotfound}
  end

  test "#get should return the found exercise", %{exercise: %{id: id} = exercise} do
    assert {:ok, exercise} === Services.Exercise.get(id)
  end

  test "#insert should fail if no name is given" do
    payload = %{description: "foo", categories: ["bar"]}

    assert {:error, [{:name, :required}]} === Services.Exercise.create(payload)
  end

  test "#insert should fail if no description is given" do
    payload = %{name: "foo", categories: ["bar"]}

    assert {:error, [{:description, :required}]} === Services.Exercise.create(payload)
  end

  test "#insert should fail if no categories are given" do
    payload = %{name: "foo", description: "bar"}

    assert {:error, [{:categories, :required}]} === Services.Exercise.create(payload)
  end

  test "#insert should save the exercise" do
    payload = %{name: "foo", categories: ["bar"], description: "baz"}

    assert {:ok, %{id: _}} = Services.Exercise.create(payload)
  end

  test "#insert should normalize the categories" do
    payload = %{name: "foo", categories: ["bar"], description: "baz"}
    expected = ["Bar"]

    assert {:ok, %{categories: ^expected}} = Services.Exercise.create(payload)
  end

  test "#insert should normalize the name" do
    payload = %{name: "foo", categories: ["bar"], description: "baz"}
    expected = "Foo"

    assert {:ok, %{name: ^expected}} = Services.Exercise.create(payload)
  end

  test "#delete should return :enotfound when no exercise is found", %{exercise: %{id: id}} do
    assert {:error, :enotfound} === Services.Exercise.delete(%{id: id + 1})
  end

  test "#delete should return the exercise that is deleted", %{exercise: %{id: id}} do
    assert {:ok, id} === Services.Exercise.delete(%{id: id})
  end
end
