defmodule Workout.Services.WorkoutTest do
  use ExUnit.Case, async: false

  alias Workout.Schemas
  alias Workout.Services
  alias Workout.Repo
  alias Workout.RepoHelper

  setup do
    Repo.delete_all(Schemas.Workout)
    :ok
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
    test "#list should sort by date descending" do
      assert {:ok, exercises} = Services.Workout.list(%{user_id: 1})
      dates = Enum.map(exercises, fn %{workout_date: date} -> Timex.parse!(date, "%FT%T%:z", :strftime) end)
      assert Enum.reverse(Enum.sort_by(dates, fn x -> x end)) === dates
    end
  end

  @tag :list
  test "#list should return performed_exercises, which have an exercise id, rep and weight" do
    datetime = Timex.to_datetime(:calendar.local_time)
    |> Timex.Ecto.DateTime.cast!

    exercise = %Schemas.Workout{description: "Saturday workout",
      workout_date: datetime, user_id: 1, performed_exercises: [
        %{exercise_id: 1, reps: 2, weight: 60.0}
      ]}
    |> RepoHelper.create

    {:ok, [exercise | _]} = Services.Workout.list(%{user_id: 1})
    assert %{performed_exercises: [%{exercise_id: 1, reps: 2, weight: 60.0} | _]} = exercise
  end

  @tag :get
  test "#get should return 404 if no workout is found" do
    assert {:error, {:enotfound, _, _}} = Services.Workout.get(%{id: 1})
  end

  @tag :get
  test "#get should return the exercise if it is found" do
    datetime = Timex.to_datetime(:calendar.local_time)
    |> Timex.Ecto.DateTime.cast!

    exercise = %Schemas.Workout{description: "Saturday workout",
      workout_date: datetime, user_id: 1, performed_exercises: [
        %{exercise_id: 1, reps: 2, weight: 60.0}
      ]}
    |> RepoHelper.create

    id = exercise.id
    assert {:ok, %{id: ^id}} = Services.Workout.get(%{id: exercise.id})
  end

  describe "#create" do
    @tag :create
    test "should return invalid if workout date can not be parsed to a datetime" do
      payload = %{
        workout_date: "2016-12",
        description: "Some description",
        user_id: 1,
        performed_exercises: [
          %{
            exercise_id: 1,
            reps: 12,
            sets: 2,
            weight: 60.0
          }
        ]
      }

      assert {:error, {:invalid, [{:workout_date, _} | _]}} =
             Workout.Services.Workout.create(payload)
    end

    @tag :create
    test "should return invalid if one of the exercise_ids can not be found" do
      payload = %{
        workout_date: "2016-12-01",
        description: "Some description",
        user_id: 1,
        performed_exercises: [
          %{
            exercise_id: 0,
            reps: 12,
            sets: 2,
            weight: 60.0
          }
        ]
      }

      assert {:error, {:invalid, [{:exercise_id, _} | _]}} =
             Workout.Services.Workout.create(payload)
    end

    @tag :create
    test "should return the created workout if it is valid" do
      payload = %{
        workout_date: "2016-12-01",
        description: "Some description",
        user_id: 1,
        performed_exercises: [
          %{
            exercise_id: 1,
            reps: 12,
            sets: 2,
            weight: 60.0
          }
        ]
      }

      assert {:ok, %{id: _}} = Workout.Services.Workout.create(payload)
    end
  end

  @tag :delete
  test "#delete should return :enotfound if workout is not found" do
    assert {:error, :enotfound} === Workout.Services.Workout.delete(%{id: 1})
  end

  @tag :delete
  test "#delete should return the deleted workout" do
    datetime = Timex.to_datetime(:calendar.local_time)
    |> Timex.Ecto.DateTime.cast!

    exercise = %Schemas.Workout{description: "Saturday workout",
      workout_date: datetime, user_id: 1, performed_exercises: [
        %{exercise_id: 1, reps: 2, weight: 60.0}
      ]}
    |> RepoHelper.create

    assert {:ok, exercise.id} === Workout.Services.Workout.delete(%{id: exercise.id})
  end
end
