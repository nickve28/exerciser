defmodule Progress.Services.Progress do
  alias Progress.Validator

  @type get_payload :: %{exercise_id: integer, from: String.t, until: String.t, user_id: integer}
  @type progress_data :: %{
    date: String.t,
    type: String.t,
    weight: float,
    reps: integer,
    sets: integer,
    amount: float,
    duration: float,
    metric: String.t,
    mode: float
  }
  @type progress :: %{
    exercise_id: integer,
    progress: [progress_data]
  }
  @type unprocessable :: {:error, {:unprocessable, String.t, [{atom, String.t}]}}
  @type invalid :: {:error, {:invalid, String.t, [{atom, String.t}]}}
  @type internal :: {:error, {:internal, String.t, [{atom, String.t}]}}

  @user_repo Application.get_env(:progress, :user_repo)
  @workout_repo Application.get_env(:progress, :workout_repo)

  @exercise_properties [:weight, :sets, :reps, :duration, :amount, :mode, :metric]

  @list_workout_filters [:user_id, :exercise_id, :from, :until]

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
    - from: Only fetch workout progression starting from and including this date (YYYY-MM-DD formatted string)\n
    - until: Only fetch workout progression until and including this date (YYYY-MM-DD formatted string)\n

    iex> Progress.get(%{exercise_id: 3, user_id: 1})
    {:ok, %{exercise_id: 3, exercise_type: "strength", progress: [%{date: "2017-01-01", weight: 1.0, sets: 2, reps: 3}]}}
  """
  @spec get(get_payload) :: {:ok, progress} | {:error, unprocessable} | {:error, invalid} | {:error, internal}
  def get(payload) do
    :poolboy.transaction(:progress_pool, fn pid ->
      GenServer.call(pid, {:get, payload})
    end)
  end

  def handle_call({:get, payload}, _from, state) do
    with :ok                               <- Validator.validate(:get, payload),
         {:ok, _}                          <- @user_repo.get(payload[:user_id]),
         workout_payload                   <- Map.take(payload, @list_workout_filters),
         {:ok, workouts}                   <- @workout_repo.list(workout_payload),
         progression                       <- to_progression(workouts, payload[:exercise_id]),
         result                            <- %{exercise_id: payload[:exercise_id], progress: progression, exercise_type: to_type(workouts)}
    do
      {:reply, {:ok, result}, state}
    else
      error ->
        response = handle_error(error)
        {:reply, response, state}
    end
  end


  #TODO: Consider coupling to the exercise service, tradeoff being we need to handle :enotfound
  defp to_type([%{performed_exercises: exercises}|_]) do
    [exercise|_] = exercises
    exercise[:type]
  end

  defp to_type(_), do: nil

  defp to_progression([], _), do: []

  defp to_progression(workouts, exercise_id) do
    for %{performed_exercises: exercises, workout_date: date} <- workouts do
      Enum.find(exercises, &(&1[:exercise_id] === exercise_id))
      |> Map.take(@exercise_properties)
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
