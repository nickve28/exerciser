defmodule Workout.Repo.Migrations.DeriveExerciseMetric do
  use Ecto.Migration
  import Ecto.Query

  def change do
    performed_exercises = Workout.Repo.all(
      from exercise in "performed_exercises",
      distinct: exercise.exercise_id,
      select: {exercise.exercise_id, exercise.metric}
    )
    for {id, metric} <- performed_exercises do
      new_metric = case metric do
        nil -> "kg"
        other -> other
      end

      from(e in "exercises", where: e.id == ^id)
      |> Workout.Repo.update_all(set: [metric: new_metric])
    end
  end
end
