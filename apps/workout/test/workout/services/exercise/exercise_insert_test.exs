defmodule Workout.Services.Exercise.InsertTest do
  use ExUnit.Case, async: false #since we reset DB each session as a clean slate
  alias Workout.Services
  alias Workout.Schemas
  alias Workout.Repo

  setup do
    Workout.Repositories.MockWorkout.enable #enable mock genserver as proxy for test

    on_exit(fn -> Workout.Repositories.MockWorkout.disable end)

    Repo.delete_all(Schemas.PerformedExercise)
    Repo.delete_all(Schemas.Workout)
    Repo.delete_all(Schemas.Exercise)
    :ok
  end

  @tag :create
  test "#insert should fail if no name is given" do
    payload = %{description: "foo", categories: ["bar"], type: "strength", metric: "kg"}

    assert {:error, {:invalid, "The request was deemed invalid.", [name: :required]}}=== Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should fail if no description is given" do
    payload = %{name: "foo", categories: ["bar"], type: "strength", metric: "kg"}

    assert {:error, {:invalid, "The request was deemed invalid.", [description: :required]}} === Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should fail if no categories are given" do
    payload = %{name: "foo", description: "bar", type: "strength", metric: "kg"}

    assert {:error, {:invalid, "The request was deemed invalid.", [categories: :required]}} === Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should fail if no type is given" do
    payload = %{name: "foo", description: "bar", categories: ["a"], metric: "kg"}

    assert {:error, {:invalid, "The request was deemed invalid.", [type: :required]}} === Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should fail if invalid type is given" do
    payload = %{name: "foo", description: "bar", categories: ["a"], type: "gamma", metric: "kg"}

    assert {:error, {:invalid, "The request was deemed invalid.", [type: :invalid_value]}} === Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should fail if no metric is given" do
    payload = %{name: "foo", description: "bar", categories: ["a"], type: "strength"}

    assert {:error, {:invalid, "The request was deemed invalid.", [metric: :required]}} === Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should save the exercise" do
    payload = %{name: "foo", categories: ["bar"], description: "baz", type: "strength", metric: "kg"}

    assert {:ok, %{id: _, type: "strength", metric: "kg"}} = Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should normalize the categories" do
    payload = %{name: "foo", categories: ["bar"], description: "baz", type: "strength", metric: "kg"}
    expected = ["Bar"]

    assert {:ok, %{categories: ^expected}} = Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should normalize the name" do
    payload = %{name: "foo", categories: ["bar"], description: "baz", type: "strength", metric: "kg"}
    expected = "Foo"

    assert {:ok, %{name: ^expected}} = Services.Exercise.create(payload)
  end
end