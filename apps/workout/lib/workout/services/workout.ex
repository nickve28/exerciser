defmodule Workout.Services.Workout do
  use GenServer

  @type performed_exercise :: %{exercise_id: integer, weight: float, reps: integer, sets: integer}
  @type workout :: %{id: integer, description: String.t, workout_date: String.t, performed_exercises: [performed_exercise]}

  @type create_workout_payload :: %{description: String.t, workout_date: String.t, performed_exercises: [performed_exercise]}

  @exercise_repo Application.get_env(:workout, :exercise_repo)

  alias Workout.Schemas

  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  def init(state), do: {:ok, state}

  @spec list(%{user_id: integer}) :: {:ok, [workout]} | {:ok, []}
  def list(%{user_id: _id} = payload) when is_integer(_id) do
    filtered_payload = Map.take(payload, [:user_id, :limit, :offset])
    filtered_payload = Map.merge(%{limit: 10, offset: 0}, filtered_payload)

    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:list, filtered_payload})
    end)
  end

  @spec get(%{id: integer}) :: {:ok, workout} | {:error, :enotfound}
  def get(%{id: id}) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:get, id})
    end)
  end

  @spec create(create_workout_payload) :: {:ok, workout} | {:error, any}
  def create(payload) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:create, payload})
    end)
  end

  @spec update(workout) :: {:ok, workout} | {:error, any}
  def update(%{id: _} = payload) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:update, payload})
    end)
  end


  @spec delete(%{id: integer}) :: {:ok, integer} | {:error, :enotfound}
  def delete(%{id: id}) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:delete, id})
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
    workouts = Workout.Repositories.Workout.list(payload)
    {:reply, workouts, state}
  end

  def handle_call({:update, payload}, _from, state) do
    id = payload[:id]
    result = with {:ok, workout}         <- find_workout(id),
                  {:ok, update_payload}  <- Workout.Schemas.Workout.update_changeset(workout, payload),
                  {:ok, _}  <- validate_exercise_existence(payload),
                  {:ok, updated_workout} <- Workout.Repositories.Workout.update(update_payload)
    do
      {:ok, updated_workout}
    else
      {:error, error} -> {:error, error}
      _ -> {:error, :internal}
    end

    {:reply, result, state}
  end

  def handle_call({:delete, id}, _from, state) do
    result = case Workout.Repositories.Workout.delete(id) do
      {count, _} when count === 1 -> {:ok, id}
      {count, _} when count === 0 -> {:error, :enotfound}
      _ -> {:error, :internal}
    end
    {:reply, result, state}
  end

  def handle_call({:create, payload}, _from, state) do
    result = with {:ok, changeset} <- Schemas.Workout.create_changeset(payload),
         {:ok, _}         <- validate_exercise_existence(payload),
         {:ok, workout}   <- Workout.Repositories.Workout.create(changeset)
    do
      {:ok, workout}
    else
      {:error, reason} -> {:error, reason}
      _ -> {:error, :internal}
    end

    {:reply, result, state}
  end

  defp find_workout(id) do
    case Workout.Repositories.Workout.get(id) do
      {:ok, nil} -> {:error, {:enotfound, "Workout could not be found", []}}
      result -> result
    end
  end

  defp validate_exercise_existence(payload) do
    exercise_ids = for %{exercise_id: id} <- payload.performed_exercises, do: id
    {:ok, exercises} = @exercise_repo.list(%{ids: exercise_ids})

    found_exercise_ids = for %{id: id} <- exercises, do: id

    case Enum.sort(exercise_ids) === Enum.sort(found_exercise_ids) do
      true -> {:ok, payload}
      false -> {:error, {:invalid, [{:exercise_id, "Not found"}]}}
    end
  end
end
