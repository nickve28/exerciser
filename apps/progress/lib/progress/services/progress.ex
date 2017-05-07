defmodule Progress.Services.Progress do
  alias Progress.Validator

  import Progress.Error
  import Progress.Operations.Progress, only: [retrieve_progress_associated_data: 1]

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
    exercise_type: String.t,
    exercise_metric: String.t,
    progress: [progress_data]
  }
  @type unprocessable :: {:error, {:unprocessable, String.t, [{atom, String.t}]}}
  @type invalid :: {:error, {:invalid, String.t, [{atom, String.t}]}}
  @type internal :: {:error, {:internal, String.t, [{atom, String.t}]}}

  @exercise_properties [:weight, :sets, :reps, :duration, :amount, :mode, :metric]

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
    {:ok, %{exercise_id: 3, exercise_type: "strength", exercise_metric: "kg", progress: [%{date: "2017-01-01", weight: 1.0, sets: 2, reps: 3}]}}
  """
  @spec get(get_payload) :: {:ok, progress} | {:error, unprocessable} | {:error, invalid} | {:error, internal}
  def get(payload) do
    :poolboy.transaction(:progress_pool, fn pid ->
      GenServer.call(pid, {:get, payload})
    end)
  end

  def handle_call({:get, payload}, _from, state) do
    with :ok                                <- Validator.validate(:get, payload),
         {:ok, {_user, workouts, exercise}} <- retrieve_progress_associated_data(payload),
         %{type: type, metric: metric}      <- exercise,
         progression                        <- to_progression(workouts, payload[:exercise_id]),
         result                             <- %{
                                                  exercise_id: payload[:exercise_id],
                                                  progress: progression,
                                                  exercise_type: type,
                                                  exercise_metric: metric
                                                }
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
      Enum.find(exercises, &(&1.exercise_id === exercise_id))
      |> Map.take(@exercise_properties)
      |> Map.put(:date, date)
    end
  end
end
