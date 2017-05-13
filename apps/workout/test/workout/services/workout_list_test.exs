defmodule Workout.Services.WorkoutListTest do
  use ExUnit.Case, async: false

  alias Workout.Schemas
  alias Workout.Services
  alias Workout.Repo
  alias Workout.RepoHelper

  @date_format "{YYYY}-{0M}-{0D}"

  setup_all do
    Workout.Repositories.MockExercise.enable #enable mock genserver as proxy for test

    on_exit(fn -> Workout.Repositories.MockExercise.disable end)
    :ok
  end

  setup do
    Repo.delete_all(Schemas.Workout)
    Repo.delete_all(Schemas.PerformedExercise)
    Repo.delete_all(Schemas.Exercise)

    :ok
  end

  test "#list should fail if a wrong date is specified in a parameter" do
    assert {:error, {:invalid, _, details}} = Services.Workout.list(%{user_id: 1, from: "2017-2017-2017"})
    assert {:from, "Invalid date, expected YYYY-MM-DD format"} === List.first(details)
  end

  describe "#list pagination" do
    setup do
      workouts = RepoHelper.generate_workouts(12)
      |> Enum.map(&RepoHelper.create/1)

      {:ok, workouts: workouts}
    end

    @tag :list
    test "#list should only return workouts for the user_id specified" do
      assert {:ok, exercises} = Services.Workout.list(%{user_id: 1})

      user_ids = Enum.map(exercises, fn %{user_id: user_id} -> user_id end) |> Enum.uniq
      assert user_ids === [1]
    end

    @tag :list
    test "#list should only return 10 workouts" do
      assert {:ok, exercises} = Services.Workout.list(%{user_id: 1})

      assert Enum.count(exercises) === 10
    end

    @tag :list
    test "#list should return the specified paginated amount when passed" do
      assert {:ok, exercises} = Services.Workout.list(%{user_id: 1, limit: 1})

      assert Enum.count(exercises) === 1
    end

    @tag :list
    test "#list should break invalid limits to the default 10" do
      assert {:ok, exercises} = Services.Workout.list(%{user_id: 1, limit: 99})

      assert Enum.count(exercises) === 10
    end

    @tag :list
    test "#list should sort by date descending" do
      assert {:ok, exercises} = Services.Workout.list(%{user_id: 1})
      dates = Enum.map(exercises, fn %{workout_date: date} -> Timex.parse!(date, @date_format) end)
      assert Enum.reverse(Enum.sort_by(dates, fn x -> x end)) === dates
    end
  end

  describe "when filtering the #list action" do
    setup do
      datetime = Timex.to_datetime({{2017, 1, 1}, {0, 0, 0}})
      |> Timex.Ecto.DateTime.cast!

      %{id: exercise_id} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
      |> Exercise.RepoHelper.create_exercise

      %{id: exercise_id2} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
      |> Exercise.RepoHelper.create_exercise

      %Schemas.Workout{description: "Saturday workout",
        workout_date: datetime, user_id: 1, performed_exercises: [
          %{exercise_id: exercise_id, reps: 2, weight: 60.0, sets: 2}
        ]}
      |> RepoHelper.create

      datetime = Timex.to_datetime({{2017, 1, 3}, {0, 0, 0}})
      |> Timex.Ecto.DateTime.cast!

      %Schemas.Workout{description: "Monday workout",
        workout_date: datetime, user_id: 1, performed_exercises: [
          %{exercise_id: exercise_id2, reps: 2, weight: 50.0, sets: 2}
        ]}
      |> RepoHelper.create

      {:ok, %{exercise_ids: [exercise_id, exercise_id2]}}
    end

    @tag :list
    test "should filter on the exercise id", %{exercise_ids: [_,second|_]} do
      assert {:ok, [%{description: "Monday workout"}]} = Workout.Services.Workout.list(%{user_id: 1, exercise_id: second})
    end

    @tag :list
    test "should filter on the from date" do
      assert {:ok, [%{description: "Monday workout"}]} = Workout.Services.Workout.list(%{user_id: 1, from: "2017-01-03"})
    end

    @tag :list
    test "should filter on the until date" do
      assert {:ok, [%{description: "Saturday workout"}]} = Workout.Services.Workout.list(%{user_id: 1, until: "2017-01-01"})
    end
  end

  @tag :list
  test "#list should return performed_exercises, which have an exercise id, rep and weight" do
    datetime = Timex.to_datetime(:calendar.local_time)
    |> Timex.Ecto.DateTime.cast!


    %{id: exercise_id} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
    |> Exercise.RepoHelper.create_exercise

    %Schemas.Workout{description: "Saturday workout",
      workout_date: datetime, user_id: 1, performed_exercises: [
        %{exercise_id: exercise_id, reps: 2, weight: 60.0, sets: 2}
      ]}
    |> RepoHelper.create

    {:ok, [workout | _]} = Services.Workout.list(%{user_id: 1})
    assert %{performed_exercises: [%{exercise_id: ^exercise_id, reps: 2, weight: 60.0, sets: 2}]} = Map.take(workout, [:performed_exercises])
  end
end
