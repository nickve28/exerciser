defmodule Workout.Services.ExerciseTest do
  use ExUnit.Case, async: false #since we reset DB each session as a clean slate
  doctest Workout.Services.Exercise
  alias Workout.Schemas
  alias Workout.Services
  alias Workout.Repo
  alias Exercise.RepoHelper

  setup do
    Workout.Repositories.MockWorkout.enable #enable mock genserver as proxy for test

    on_exit(fn -> Workout.Repositories.MockWorkout.disable end)

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

  test "#get should return an error if no exercise is found", %{exercise: %{id: id}} do
    assert Services.Exercise.get(id + 1) === {:error, {:enotfound, "Exercise not found", []}}
  end

  test "#get should return the found exercise", %{exercise: %{id: id} = exercise} do
    assert {:ok, exercise} === Services.Exercise.get(id)
  end

  @tag :delete
  describe "when no exercise is found" do
    setup do
      Workout.Repositories.MockWorkout.stub(:count, {:ok, 0})
      :ok
    end

    test "#delete should return :enotfound when no exercise is found", %{exercise: %{id: id}} do
      assert {:error, {:enotfound, _, []}} = Services.Exercise.delete(%{id: id + 1})
    end
  end

  describe "when the exercise is not in used in a workout" do
    setup do
      Workout.Repositories.MockWorkout.stub(:count, {:ok, 0})
      :ok
    end

    @tag :delete
    test "#delete should return the exercise that is deleted", %{exercise: %{id: id}} do
      assert {:ok, id} === Services.Exercise.delete(%{id: id})
    end
  end

  @tag :delete
  describe "when the exercise exists in a workout" do
    setup do
      Workout.Repositories.MockWorkout.stub(:count, {:ok, 1})
      :ok
    end

    test "#delete should return unprocessable", %{exercise: %{id: id}} do
      expected = {:unprocessable, "The request could not be processed.", [
        {:id, "is used in a workout"}
      ]}
      assert {:error, expected} === Services.Exercise.delete(%{id: id})
    end
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