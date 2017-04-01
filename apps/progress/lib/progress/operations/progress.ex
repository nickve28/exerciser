defmodule Progress.Operations.Progress do
  @user_repo Application.get_env(:progress, :user_repo)
  @workout_repo Application.get_env(:progress, :workout_repo)
  @exercise_repo Application.get_env(:progress, :exercise_repo)

  @list_workout_filters [:user_id, :exercise_id, :from, :until]

  def retrieve_progress_associated_data(payload) do
    workout_payload = Map.take(payload, @list_workout_filters)

    [user, workouts, exercise] = [
      Task.async(fn -> @user_repo.get(payload[:user_id]) end),
      Task.async(fn -> @workout_repo.list(workout_payload) end),
      Task.async(fn -> @exercise_repo.get(payload[:exercise_id]) end)
    ]
    |> Enum.map(&Task.await/1)

    errors = find_errors([{"user", user}, {"workout", workouts}, {"exercise", exercise}])

    case errors do
      []     ->
        {:ok, user_data}     = user
        {:ok, workout_data}  = workouts
        {:ok, exercise_data} = exercise
        {:ok, {user_data, workout_data, exercise_data}}
      errors -> {:error, errors}
    end
  end

  defp find_errors(result) when is_list(result) do
    find_errors(result, [])
  end

  defp find_errors([{entity, data}|rest], buffer) do
    case data do
      {:error, {code, _, _}} -> find_errors(rest, [{entity, "failed with code #{code}"} | buffer])
      _ -> find_errors(rest, buffer)
    end
  end

  defp find_errors([], buffer), do: buffer
end