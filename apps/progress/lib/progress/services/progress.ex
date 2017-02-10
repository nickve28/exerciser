defmodule Progress.Services.Progress do
  alias Progress.Validator

  @user_repo Application.get_env(:progress, :user_repo)
  @workout_repo Application.get_env(:progress, :workout_repo)

  use GenServer

  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  def init(state), do: {:ok, state}

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
    for %{performed_exercises: [%{exercise_id: ^exercise_id} = exercise], workout_date: date} <- workouts do
      %{Map.take(exercise, [:weight, :sets, :reps])) | date: date}
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
