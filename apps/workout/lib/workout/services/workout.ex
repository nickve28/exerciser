defmodule Workout.Services.Workout do
  @moduledoc """
    This module is a layer to communicate with the workout data
  """
  use GenServer

  @type performed_exercise :: %{
    exercise_id: integer,
    weight: float,
    reps: integer,
    sets: integer,
    metric: String.t,
    amount: float,
    duration: float,
    mode: float
  }
  @type workout :: %{id: integer, description: String.t, workout_date: String.t, performed_exercises: [performed_exercise]}

  @type create_workout_payload :: %{description: String.t, workout_date: String.t, performed_exercises: [performed_exercise]}
  @type bad_request :: {:invalid, String.t, [{atom(), String.t}]}
  @type not_found :: {:enotfound, String.t, [any()]}
  @type internal :: {:internal, String.t, [any()]}
  @type filter :: %{exercise_id: [integer]}
  @type list_payload :: %{user_id: integer}

  @count_filters [:exercise_id, :user_id]
  @list_filters [:user_id, :exercise_id, :from, :until]

  alias Workout.Schemas
  alias Workout.Helpers.{Validator, Pagination, Date}

  import Workout.Operations.{Workout, Exercise}
  import Workout.Error


  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  def init(state), do: {:ok, state}

  @doc """
    Lists the workouts for the given user, allowing the optional filters:

    - exercise_id: Only include workouts that contain this exercise\n
    - from: Exclude workouts earlier than this date\n
    - until: Exclude workouts later than this date\n
    - limit: Limit the amount of results (default: 10)\n
    - offset: Skip the amount of results (default: 0)\n


    iex> Workout.Services.Workout.list(%{user_id: 1})
    {:ok, []}
  """
  @spec list(list_payload) :: {:ok, [workout]} | {:ok, []}
  def list(%{user_id: id} = payload) when is_integer(id) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:list, payload})
    end)
  end


  @doc """
    Finds a workout by its id, or an error if the workout can not be found.
  """
  @spec get(%{id: integer}) :: {:ok, workout} | {:error, not_found}
  def get(%{id: id}) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:get, id})
    end)
  end


  @doc """
    Creates a workout
  """
  @spec create(create_workout_payload) :: {:ok, workout} | {:error, bad_request} | {:error, internal}
  def create(payload) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:create, payload})
    end)
  end

  @doc """
    Updates the workout matching the id.
    Performed exercises passed will replace all existing exercises.
  """
  @spec update(workout) :: {:ok, workout} | {:error, not_found} | {:error, internal}
  def update(%{id: _} = payload) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:update, payload})
    end)
  end


  @doc """
    Deletes the workout with the given id, or a not found error if no workout with the given id exists
  """
  @spec delete(%{id: integer}) :: {:ok, integer} | {:error, not_found} | {:error, internal}
  def delete(%{id: id}) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:delete, id})
    end)
  end

  @doc """
   This endpoint counts the amount of workouts for the user

   Available parameters are:

   user_id: integer - Filters only workouts for this user\n
   exercise_id: [integer] - Filters workouts that have this exercise included in it\n

   Returns: {:ok, count}

   ## Examples

     iex> Workout.Services.Workout.count(%{user_id: 1337})
     {:ok, 0}
  """
  @spec count(%{user_id: integer, exercise_id: [integer]}) :: {:ok, integer}
  def count(payload) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:count, payload})
    end)
  end

  def handle_call({:get, id}, _from, state) do
    workout = case Workout.Repositories.Workout.get(id) do
      {:ok, nil} -> {:error, {:enotfound, "Workout could not be found", []}}
      {:ok, workout} -> {:ok, workout}
    end
    {:reply, workout, state}
  end

  def handle_call({:list, payload}, _from, state) do
    filtered_payload = Map.take(payload, @list_filters)
    pagination = Pagination.set_pagination(payload)
    filtered_payload = Map.merge(filtered_payload, pagination)

    with :ok                 <- Validator.validate_list(filtered_payload),
         transformed_payload <- Date.to_date(filtered_payload, :from) |> Date.to_date(:until)
    do
      workouts = Workout.Repositories.Workout.list(transformed_payload)
      {:reply, workouts, state}
    else
      error -> {:reply, {:error, handle_error(:list, error)}, state}
    end
  end

  def handle_call({:update, payload}, _from, state) do
    id = payload[:id]
    result = with {:ok, workout}         <- find_workout(id),
                  {:ok, exercises}       <- get_exercises_details(payload),
                  update_payload         <- %{payload | performed_exercises: exercises},
                  {:ok, changeset}       <- Workout.Schemas.Workout.update_changeset(workout, update_payload),
                  {:ok, updated_workout} <- Workout.Repositories.Workout.update(changeset)
    do
      {:ok, updated_workout}
    else
      error -> result = handle_error(:update, error)
    end

    {:reply, result, state}
  end

  def handle_call({:delete, id}, _from, state) do
    result = case Workout.Repositories.Workout.delete(id) do
      {count, _} when count === 1 -> {:ok, id}
      {count, _} when count === 0 -> {:error, {:enotfound, "Workout not found", []}}
      _ -> {:error, :internal}
    end
    {:reply, result, state}
  end

  def handle_call({:create, payload}, _from, state) do
    result = with  {:ok, exercises} <- get_exercises_details(payload),
                   updated_payload  <- %{payload | performed_exercises: exercises},
                   {:ok, changeset} <- Schemas.Workout.create_changeset(updated_payload),
                   {:ok, workout}   <- Workout.Repositories.Workout.create(changeset)
    do
      {:ok, workout}
    else
      error -> result = handle_error(:create, error)
    end

    {:reply, result, state}
  end

  def handle_call({:count, payload}, _from, state) do
    count_payload = Map.take(payload, @count_filters)

    result = Workout.Repositories.Workout.count(count_payload)
    {:reply, result, state}
  end
end
