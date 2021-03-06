defmodule Workout.Services.Exercise.UpdateTest do
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

  @tag :update
  test "#update should fail if no id is given" do
    assert_raise FunctionClauseError, fn ->
      Services.Exercise.update(%{})
    end
  end

  @tag :update
  test "#update should return :enotfound if no exercise is found", %{exercise: %{id: id}} do
    result = Services.Exercise.update(%{id: id + 1})
    assert {:error, {:enotfound, "Exercise not found",  []}} === result
  end

  @tag :update
  test "#update allow description update", %{exercise: %{id: id}} do
    {:ok, %{description: description}} = Services.Exercise.update(%{id: id, description: "foo"})
    assert description === "foo"
  end

  @tag :update
  test "#update allow categories update", %{exercise: %{id: id}} do
    {:ok, %{categories: categories}} = Services.Exercise.update(%{id: id, categories: ["foo", "bar", "baz"]})
    assert categories === ["Foo", "Bar", "Baz"]
  end

  @tag :update
  test "#update allow update without a change on name or type", %{exercise: %{id: id}} do
    assert {:ok, %{name: "Barbell Bench Press", type: "strength", id: ^id}} =
      Services.Exercise.update(%{id: id, categories: ["foo", "bar", "baz"]})
  end

  @tag :update
  test "#update allow not change name or type", %{exercise: %{id: id}} do
    assert {:ok, %{name: "Barbell Bench Press", type: "strength", id: ^id}} =
      Services.Exercise.update(%{id: id, categories: ["foo", "bar", "baz"]})
  end

  @tag :update
  test "#update allow metric update", %{exercise: %{id: id}} do
    assert {:ok, %{name: "Barbell Bench Press", metric: "km/h", id: ^id}} =
      Services.Exercise.update(%{id: id, metric: "km/h"})
  end
end