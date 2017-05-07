defmodule CategoryTest do
  use ExUnit.Case, async: false #since we reset DB each session as a clean slate
  doctest Exercises
  alias Exercises.Schemas
  alias Exercises.Services
  alias Exercises.Repo
  alias Exercises.RepoHelper

  setup do
    Repo.delete_all(Schemas.Exercise)

    RepoHelper.create_exercise(%{name: "Barbell Bench Press", description: "Barbell bench press",
      categories: ["Triceps", "Chest", "Shoulders"], type: "strength", metric: "kg"})
    RepoHelper.create_exercise(%{name: "Shoulder Press", description: "Shoulder Press",
      categories: ["Shoulders"], type: "strength", metric: "kg"})
    :ok
  end

  test "#list returns a list of the known categories uniquely filtered" do
    expected = ["Chest", "Shoulders", "Triceps"]
    assert {:ok, expected} === Services.Category.list
  end
end