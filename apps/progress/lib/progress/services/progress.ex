defmodule Progress.Services.Progress do
  alias Progress.Validator

  @user_repo Application.get_env(:progress, :user_repo)
  @workout_repo Application.get_env(:progress, :workout_repo)

  use GenServer

  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  def init(state), do: {:ok, state}

  @doc """
    Gets the progression on an exercise for the given user. The following
    parameters are available

    - exercise_id: Only include workouts that contain this exercise (required)\n
    - user_id: Only include workouts from this user (required)\n

    iex> Progress.get(%{exercise_id: 3, user_id: 1})
    {:ok, %{exercise_id: 3, progress: [%{date: "2017-01-01", weight: 1.0, sets: 2, reps: 3}]}}
  """
  def get(payload) do
    :poolboy.transaction(:progress_pool, fn pid ->
      GenServer.call(pid, {:get, payload})
    end)
  end

  def handle_call({:get, payload}, _from, state) do
    with :ok                   <- Validator.validate(:get, payload),
         {:ok, %{id: user_id}} <- @user_repo.get(payload[:user_id]),
         workout_payload       <- %{user_id: user_id, exercise_id: payload[:exercise_id]},
         {:ok, workouts}       <- @workout_repo.list(workout_payload),
         progression           <- to_progression(workouts, payload[:exercise_id]),
         result                <- %{exercise_id: payload[:exercise_id], progress: progression}
    do
      {:reply, {:ok, result}, state}
    else
      error ->
        response = handle_error(error)
        {:reply, response, state}
    end
  end

  defp to_progression([], _), do: []

  defp to_progression(workouts, exercise_id) do
    for %{performed_exercises: exercises, workout_date: date} <- workouts do
      #Todo make test to show that ordering of exercises does not matter
      exercise = Enum.find(exercises, &(&1[:exercise_id] === exercise_id))

      Map.take(exercise, [:weight, :sets, :reps])
      |> Map.put(:date, date)
    end
  end

  defp handle_error({:error, {:enotfound, message, []}}) do
    {:error, {:unprocessable, "The request could not be processed.", [{:user_id, message}]}}
  end

  defp handle_error({:error, details}) do
    {:error, {:invalid, "The request was deemed invalid.", details}}
  end

  defp handle_error(_) do
    {:error, {:internal, "Internal Server Error", []}}
  end
end
