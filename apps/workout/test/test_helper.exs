
#Load any non default test dep
Code.require_file("test/mocks/repositories/mock_exercise.ex")
Code.require_file("test/mocks/repositories/mock_workout.ex")

{:ok, _pid} = Workout.Repositories.MockExercise.start_link
{:ok, _pid} = Workout.Repositories.MockWorkout.start_link

ExUnit.start()

defmodule Workout.RepoHelper do
  alias Workout.Repo
  alias Workout.Schemas.{Workout}

  def create(data) do
    Repo.insert!(data)
  end

  def generate_workouts(x, user_id \\ 1) when is_number(x) do
    for number <- 1..x do
      {{y, m, _}, t} = :calendar.local_time
      new_date = Enum.random(1..28)
      %Workout{
          description: "Test workout ##{number}",
          workout_date: Timex.to_datetime({{y, m, new_date}, t}) |> Timex.Ecto.DateTime.cast!,
          user_id: user_id
      }
    end
  end
end

defmodule Exercise.RepoHelper do
  def create_exercise(%{name: name, description: description, categories: categories, type: type, metric: metric}) do
    {:ok, data} = %Workout.Schemas.Exercise{name: name, description: description, categories: categories, type: type, metric: metric}
    |> Workout.Repo.insert!
    |> Workout.Models.Exercise.to_model

    data
  end
end